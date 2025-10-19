const { ethers } = require('ethers');
const smartContractABI = require('../contracts/deployed.json');

let provider;
let contract;

async function initBlockchain() {
  if (!provider) {
    provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, smartContractABI.abi, wallet);
  }
}

async function registerPasswordHash(passwordId, hash) {
  await initBlockchain();
  const tx = await contract.registerPasswordHash(passwordId, hash);
  return tx.wait();
}

async function verifyPasswordHash(passwordId, hash) {
  await initBlockchain();
  return contract.verifyPasswordHash(passwordId, hash);
}

async function getHashHistory(passwordId) {
  await initBlockchain();
  return contract.getHashHistory(passwordId);
}

module.exports = {
  registerPasswordHash,
  verifyPasswordHash,
  getHashHistory,
};


