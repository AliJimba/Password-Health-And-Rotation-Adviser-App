// Load environment variables first
const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}

console.log('Environment variables loaded');
console.log('GANACHE_URL:', process.env.GANACHE_URL);
console.log('GANACHE_PRIVATE_KEY present:', !!process.env.GANACHE_PRIVATE_KEY);

// Validate environment variables
if (!process.env.GANACHE_URL) {
    console.error('ERROR: GANACHE_URL is not set in .env file');
    process.exit(1);
}

if (!process.env.GANACHE_PRIVATE_KEY) {
    console.error('ERROR: GANACHE_PRIVATE_KEY is not set in .env file');
    process.exit(1);
}

// Import ethers after validation
const { ethers } = require('ethers');
const fs = require('fs-extra');
const path = require('path');

async function main() {
    try {
        console.log('Starting deployment...');
        
        // Create provider
        console.log('Creating provider with URL:', process.env.GANACHE_URL);
        const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL);
        
        // Test provider connection
        try {
            const network = await provider.getNetwork();
            console.log('Connected to network, chainId:', network.chainId);
        } catch (providerError) {
            console.error('Failed to connect to Ganache. Is Ganache UI running?');
            console.error('Provider error:', providerError.message);
            process.exit(1);
        }
        
        // Create wallet
        console.log('Creating wallet...');
        let wallet;
        try {
            wallet = new ethers.Wallet(process.env.GANACHE_PRIVATE_KEY, provider);
            console.log('Wallet created with address:', wallet.address);
        } catch (walletError) {
            console.error('Failed to create wallet. Check your GANACHE_PRIVATE_KEY format.');
            console.error('Wallet error:', walletError.message);
            process.exit(1);
        }

        // Check balance
        const balance = await wallet.getBalance();
        console.log('Account balance:', ethers.utils.formatEther(balance), 'ETH');
        
        if (balance.isZero()) {
            console.error('WARNING: Account has zero balance. Cannot deploy.');
            process.exit(1);
        }

        // Load compiled artifact
        const artifactPath = path.resolve(__dirname, '../artifacts/PasswordManager.json');
        console.log('Looking for artifact at:', artifactPath);
        
        if (!fs.existsSync(artifactPath)) {
            console.error('ERROR: Artifact not found. Run "npm run compile" first.');
            process.exit(1);
        }
        
        const compiled = await fs.readJson(artifactPath);
        console.log('Artifact loaded successfully');

        // Deploy contract
        console.log('Deploying PasswordManager contract...');
        const factory = new ethers.ContractFactory(compiled.abi, compiled.bytecode, wallet);
        const contract = await factory.deploy();
        
        console.log('Waiting for deployment transaction to be mined...');
        await contract.deployed();

        console.log('✓ PasswordManager deployed at:', contract.address);

        // Prepare deployment info
        const deploymentInfo = {
            address: contract.address,
            abi: compiled.abi,
            network: 'ganache',
            chainId: (await provider.getNetwork()).chainId,
            deployedAt: new Date().toISOString()
        };

        // Save for backend
        const serverPath = path.resolve(__dirname, '../../server/contracts/deployed.json');
        await fs.ensureDir(path.dirname(serverPath));
        await fs.writeJSON(serverPath, deploymentInfo, { spaces: 2 });
        console.log('✓ Deployment info saved for backend:', serverPath);

        // Save for frontend
        const clientPath = path.resolve(__dirname, '../../client/src/blockchain/smartContractABI.json');
        await fs.ensureDir(path.dirname(clientPath));
        await fs.writeJSON(clientPath, deploymentInfo, { spaces: 2 });
        console.log('✓ Deployment info saved for frontend:', clientPath);

        console.log('\n=== Deployment Complete ===');
        console.log('Contract Address:', contract.address);
        console.log('Network:', 'Ganache Local');
        console.log('Chain ID:', deploymentInfo.chainId);

    } catch (err) {
        console.error('\n✗ Deployment failed');
        console.error('Error message:', err.message);
        console.error('Full error:', err);
        process.exit(1);
    }
}

main();
