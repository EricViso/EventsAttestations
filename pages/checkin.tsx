import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Checkin() {
  const router = useRouter();
  const [manual, setManual] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ uid: string; txHash: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [eventInfo, setEventInfo] = useState<{
    eventId?: string;
    eventTitle?: string;
    date?: string;
    location?: string;
  }>({});

  useEffect(() => {
    if (router.isReady) {
      setEventInfo({
        eventId: router.query.eventId as string,
        eventTitle: router.query.eventTitle as string,
        date: router.query.date as string,
        location: router.query.location as string,
      });
    }
  }, [router.isReady, router.query]);

  async function submit(addr?: string) {
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const recipient = (addr || manual).trim();
      const r = await fetch("/api/attest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          eventId: eventInfo.eventId,
          eventTitle: eventInfo.eventTitle,
          date: eventInfo.date,
          location: eventInfo.location,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed to mint attestation");
      setResult({ uid: data.uid, txHash: data.txHash });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPending(false);
    }
  }

  async function connectAndSubmit() {
    // Optional wallet connect via injected provider
    const anyWin = window as any;
    if (!anyWin.ethereum) {
      return setError("No wallet found. Please paste your ENS or address instead.");
    }
    try {
      const accounts = await anyWin.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts?.[0];
      if (!address) throw new Error("No account found");
      await submit(address);
    } catch (e: any) {
      setError(e.message || "Wallet connection error");
    }
  }

  return (
    <>
      <Head>
        <title>EthFloripa Attendance - Claim Your Attestation</title>
        <meta name="description" content="Claim your EthFloripa attendance attestation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ maxWidth: 480, margin: "80px auto", fontFamily: "system-ui", padding: "0 20px" }}>
        <img
          src="/ethfloripa-banner.jpg"
          alt="EthFloripa"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            marginBottom: "1.5rem"
          }}
        />
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          {eventInfo.eventTitle || "EthFloripa Attendance"}
        </h1>
        {eventInfo.eventId && (
          <p style={{ color: "#0070f3", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            Event: {eventInfo.eventId}
          </p>
        )}
        {eventInfo.date && (
          <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            Date: {new Date(parseInt(eventInfo.date) * 1000).toLocaleDateString()}
          </p>
        )}
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          Connect your wallet or paste your ENS / 0x address to mint your attendance attestation on Sepolia.
        </p>

        <button
          onClick={connectAndSubmit}
          disabled={pending}
          style={{
            padding: "12px 20px",
            width: "100%",
            backgroundColor: pending ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            cursor: pending ? "not-allowed" : "pointer",
            marginBottom: "16px",
          }}
        >
          {pending ? "Minting..." : "Connect Wallet & Mint"}
        </button>

        <div style={{ textAlign: "center", margin: "16px 0", color: "#999" }}>— or —</div>

        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="vitalik.eth or 0x1234..."
          disabled={pending}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "1rem",
            border: "1px solid #ddd",
            borderRadius: "6px",
            marginBottom: "8px",
          }}
        />
        <button
          onClick={() => submit()}
          disabled={pending || !manual}
          style={{
            padding: "12px 20px",
            width: "100%",
            backgroundColor: pending || !manual ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            cursor: pending || !manual ? "not-allowed" : "pointer",
          }}
        >
          {pending ? "Minting..." : "Mint with ENS / Address"}
        </button>

        {error && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "6px",
              color: "#c00",
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: "16px",
              padding: "16px",
              backgroundColor: "#efe",
              border: "1px solid #cfc",
              borderRadius: "6px",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>Attestation Minted!</p>
            <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
              <strong>UID:</strong> <code style={{ fontSize: "0.8rem" }}>{result.uid}</code>
            </p>
            {result.uid && result.uid !== 'undefined' && (
              <p style={{ marginBottom: "8px" }}>
                <a
                  href={`https://base-sepolia.easscan.org/attestation/view/${result.uid}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#0070f3", textDecoration: "underline" }}
                >
                  View on EAS (Base Sepolia)
                </a>
              </p>
            )}
            {result.txHash && result.txHash !== 'unknown' && (
              <p>
                <a
                  href={`https://sepolia.basescan.org/tx/${result.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#0070f3", textDecoration: "underline" }}
                >
                  View Transaction on BaseScan
                </a>
              </p>
            )}
          </div>
        )}
      </main>
    </>
  );
}
