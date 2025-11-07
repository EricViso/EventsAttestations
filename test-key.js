// Quick test to validate your private key format
require('dotenv').config({ path: '.env.local' });
const { Wallet } = require('ethers');

const privateKey = process.env.ORGANIZER_PRIVATE_KEY;

console.log('\n=== Private Key Test ===\n');
console.log('Private key length:', privateKey ? privateKey.length : 0);
console.log('Starts with 0x:', privateKey ? privateKey.startsWith('0x') : false);
console.log('Expected length: 64 chars (without 0x) or 66 chars (with 0x)');

try {
  const wallet = new Wallet(privateKey);
  console.log('\n✅ SUCCESS! Private key is valid');
  console.log('Wallet address:', wallet.address);
} catch (error) {
  console.log('\n❌ ERROR: Private key is invalid');
  console.log('Error:', error.message);
  console.log('\nTips:');
  console.log('- Private key should be 64 hex characters (no 0x) or 66 with 0x');
  console.log('- Make sure there are no spaces or quotes around it');
  console.log('- Should look like: abc123...def456 (64 chars)');
  console.log('- Or: 0xabc123...def456 (66 chars)');
}
