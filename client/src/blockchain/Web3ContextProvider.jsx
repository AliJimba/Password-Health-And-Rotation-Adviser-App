import React, { createContext, useContext } from 'react';
import { useWeb3Blockchain } from './useWeb3Blockchain';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const web3Data = useWeb3Blockchain();
  return <Web3Context.Provider value={web3Data}>{children}</Web3Context.Provider>;
};
