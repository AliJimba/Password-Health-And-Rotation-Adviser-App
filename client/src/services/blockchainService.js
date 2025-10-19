import { ethers } from 'ethers';
import contractABI from '../blockchain/smartContractABI.json';

let provider = null;
let signer = null;
let contract = null;

export const initializeBlockchain = async () => {
  try {
    if (typeof window.ethereum !== 'undefined') {
      // MetaMask is installed
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      signer = provider.getSigner();
      
      const contractAddress = contractABI.address;
      contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
      
      return { provider, signer, contract };
    } else {
      throw new Error('MetaMask not installed');
    }
  } catch (error) {
    console.error('Blockchain initialization error:', error);
    throw error;
  }
};

export const getProvider = () => provider;
export const getSigner = () => signer;
export const getContract = () => contract;

export const connectWallet = async () => {
  try {
    if (!provider) {
      await initializeBlockchain();
    }
    const address = await signer.getAddress();
    return address;
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw error;
  }
};

export const addPasswordToBlockchain = async (service, encryptedPassword) => {
  try {
    if (!contract) await initializeBlockchain();
    const tx = await contract.addPassword(service, encryptedPassword);
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error('Add password error:', error);
    throw error;
  }
};

export const getPasswordsFromBlockchain = async () => {
  try {
    if (!contract) await initializeBlockchain();
    const passwords = await contract.getAllPasswords();
    return passwords.map((pwd, index) => ({
      index,
      service: pwd.service,
      encryptedPassword: pwd.encryptedPassword,
      timestamp: pwd.timestamp.toNumber()
    }));
  } catch (error) {
    console.error('Get passwords error:', error);
    throw error;
  }
};

export const deletePasswordFromBlockchain = async (index) => {
  try {
    if (!contract) await initializeBlockchain();
    const tx = await contract.deletePassword(index);
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error('Delete password error:', error);
    throw error;
  }
};
