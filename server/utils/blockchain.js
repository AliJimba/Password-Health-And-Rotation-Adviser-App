const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

let contract = null;
let provider = null;
let wallet = null;

// Initialize blockchain connection
const initBlockchain = () => {
    try {
        // Load deployed contract info
        const deployedPath = path.join(__dirname, '../contracts/deployed.json');
        
        if (!fs.existsSync(deployedPath)) {
            console.warn('⚠ Deployed contract info not found at:', deployedPath);
            console.warn('⚠ Run "npm run deploy" in blockchain folder first.');
            return null;
        }

        const deployed = JSON.parse(fs.readFileSync(deployedPath, 'utf8'));

        if (!process.env.BLOCKCHAIN_RPC) {
            console.error('✗ BLOCKCHAIN_RPC not set in .env');
            return null;
        }

        if (!process.env.GANACHE_PRIVATE_KEY) {
            console.error('✗ GANACHE_PRIVATE_KEY not set in .env');
            return null;
        }

        // Connect to Ganache
        provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
        
        // Create wallet
        wallet = new ethers.Wallet(process.env.GANACHE_PRIVATE_KEY, provider);

        // Initialize contract
        contract = new ethers.Contract(deployed.address, deployed.abi, wallet);

        console.log('✓ Blockchain connected');
        console.log('✓ Contract address:', deployed.address);
        console.log('✓ Network:', deployed.network);
        
        return contract;
    } catch (error) {
        console.error('✗ Blockchain initialization error:', error.message);
        return null;
    }
};

// Get contract instance
const getContract = () => {
    if (!contract) {
        return initBlockchain();
    }
    return contract;
};

// Get provider instance
const getProvider = () => {
    if (!provider) {
        initBlockchain();
    }
    return provider;
};

// Get wallet instance
const getWallet = () => {
    if (!wallet) {
        initBlockchain();
    }
    return wallet;
};

module.exports = {
    initBlockchain,
    getContract,
    getProvider,
    getWallet
};

