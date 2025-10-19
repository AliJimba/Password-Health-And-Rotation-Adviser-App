import { useState, useEffect } from 'react';
import { initializeBlockchain, connectWallet } from '../services/blockchainService';

export const useWeb3Blockchain = () => {
  const [account, setAccount] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnected(true);
          await initializeBlockchain();
        }
      }
    } catch (err) {
      console.error('Check connection error:', err);
    }
  };

  const connect = async () => {
    setLoading(true);
    setError(null);
    try {
      const address = await connectWallet();
      setAccount(address);
      setConnected(true);
    } catch (err) {
      setError(err.message);
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setConnected(false);
  };

  return {
    account,
    connected,
    loading,
    error,
    connect,
    disconnect
  };
};
