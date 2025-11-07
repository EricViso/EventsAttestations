import type { NextApiRequest, NextApiResponse } from "next";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { JsonRpcProvider, Wallet, isAddress } from "ethers";

const {
  RPC_URL,
  ORGANIZER_PRIVATE_KEY,
  SCHEMA_UID,
  EAS_ADDRESS,
  EVENT_ID,
  EVENT_TITLE,
  EVENT_DATE_UNIX,
  EVENT_LOCATION,
  EVENT_ORGANIZER,
} = process.env;

if (!RPC_URL || !ORGANIZER_PRIVATE_KEY || !SCHEMA_UID || !EAS_ADDRESS) {
  throw new Error("Missing required environment variables");
}

// IMPORTANT: This must exactly match your schema definition
// Adjust this to match your actual schema
const schemaString = "string eventID,string eventTitle,uint64 date,string location,string organizer,address attester,bool attended";
const encoder = new SchemaEncoder(schemaString);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Create fresh provider and signer for each request
    const provider = new JsonRpcProvider(RPC_URL);
    const signer = new Wallet(ORGANIZER_PRIVATE_KEY!, provider);

    // Check network
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);

    // EAS connection
    const eas = new EAS(EAS_ADDRESS!);
    eas.connect(signer);

    // Helper function for address resolution
    async function resolveToAddress(input: string) {
      const trimmed = input.trim();
      if (isAddress(trimmed)) return trimmed;
      // Try ENS resolution
      try {
        const addr = await provider.resolveName(trimmed);
        if (addr && isAddress(addr)) return addr;
      } catch {}
      return null;
    }

    const {
      recipient,
      eventId,
      eventTitle,
      date,
      location
    }: {
      recipient?: string;
      eventId?: string;
      eventTitle?: string;
      date?: string;
      location?: string;
    } = req.body || {};

    if (!recipient) {
      return res.status(400).json({ error: "Missing recipient address or ENS" });
    }

    const resolved = await resolveToAddress(recipient);
    if (!resolved) {
      return res.status(400).json({ error: "Invalid address or ENS name" });
    }

    // Debug: Check wallet balance
    const signerAddress = await signer.getAddress();
    const balance = await provider.getBalance(signerAddress);
    console.log(`Organizer wallet: ${signerAddress}`);
    console.log(`Balance: ${balance.toString()} wei (${balance / BigInt(1e18)} ETH)`);

    if (balance === 0n) {
      return res.status(500).json({
        error: `Organizer wallet has zero balance. Address: ${signerAddress}. Please fund with Base Sepolia ETH.`
      });
    }

    // Use URL params or fall back to env vars
    const finalEventId = eventId || EVENT_ID!;
    const finalEventTitle = eventTitle || EVENT_TITLE!;
    const finalDate = date ? BigInt(date) : BigInt(EVENT_DATE_UNIX!);
    const finalLocation = location || EVENT_LOCATION!;

    // Encode your event data
    const encoded = encoder.encodeData([
      { name: "eventID", value: finalEventId, type: "string" },
      { name: "eventTitle", value: finalEventTitle, type: "string" },
      { name: "date", value: finalDate, type: "uint64" },
      { name: "location", value: finalLocation, type: "string" },
      { name: "organizer", value: EVENT_ORGANIZER!, type: "string" },
      { name: "attester", value: await signer.getAddress(), type: "address" },
      { name: "attended", value: true, type: "bool" },
    ]);

    // On-chain issuance (organizer pays gas)
    const tx = await eas.attest({
      schema: SCHEMA_UID!,
      data: {
        recipient: resolved,
        expirationTime: 0n, // never expires
        revocable: true, // allow revocation if needed
        refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encoded,
        value: 0n,
      },
    });

    console.log("Attestation transaction sent, waiting for confirmation...");

    // EAS SDK's tx.wait() will both wait for the transaction AND try to parse the UID
    // But it fails to parse events on Base Sepolia
    // We need to call wait() to get the receipt, then extract both hash and UID manually
    let newAttestationUID: string;
    let txHash: string;

    try {
      // Try the normal flow first
      newAttestationUID = await tx.wait();
      // If we get here, it worked! Get the hash from the now-populated receipt
      txHash = tx.receipt?.hash || "unknown";
      console.log("Attestation successful via tx.wait()!");
      console.log("UID:", newAttestationUID);
      console.log("TxHash:", txHash);
    } catch (waitError: any) {
      // tx.wait() failed to parse the UID, but the transaction was still sent
      // The receipt should now be populated in tx.receipt
      console.log("tx.wait() failed, extracting data manually...");
      console.log("tx.receipt after wait():", tx.receipt ? "exists" : "null");

      if (tx.receipt) {
        txHash = tx.receipt.hash || "unknown";
        console.log("Extracted txHash from tx.receipt:", txHash);
        console.log("Receipt status:", tx.receipt.status);
        console.log("Receipt logs from EAS SDK:", tx.receipt.logs?.length);

        if (tx.receipt.status !== 1) {
          return res.status(500).json({
            error: "Transaction failed",
            txHash: txHash,
          });
        }

        // EAS SDK's receipt might not have full logs, fetch from provider
        console.log("Fetching full receipt from provider...");
        const fullReceipt = await provider.getTransactionReceipt(txHash);
        console.log("Full receipt logs count:", fullReceipt?.logs?.length);

        if (!fullReceipt) {
          console.error("Could not fetch full receipt");
          newAttestationUID = "unknown";
        } else {
          // Parse the Attested event from logs to get the UID
          const attestedEvent = fullReceipt.logs?.find((log: any) =>
            log.topics[0] === '0x8bf46bf4cfd674fa735a3d63ec1c9ad4153f033c290341f3a588b75685141b35'
          );

          if (attestedEvent) {
            newAttestationUID = attestedEvent.topics[2] || attestedEvent.topics[3] || "unknown";
            console.log("Extracted UID from logs:", newAttestationUID);
          } else {
            console.log("No Attested event found, checking all logs...");
            console.log("All log topics:", fullReceipt.logs?.map((l: any) => l.topics[0]));
            newAttestationUID = "unknown";
          }
        }
      } else {
        // No receipt at all - this shouldn't happen
        console.error("No receipt available after tx.wait() failed");
        return res.status(500).json({
          error: "Transaction sent but no receipt available",
        });
      }
    }

    console.log("Final UID:", newAttestationUID);
    console.log("Final txHash:", txHash);

    return res.status(200).json({
      status: "ok",
      uid: newAttestationUID,
      txHash: txHash,
    });
  } catch (err: any) {
    console.error("Attestation error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
