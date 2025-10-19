# 🔗 Blockchain Module - Password Manager Smart Contract

This module contains Solidity smart contracts for decentralized password storage on Ethereum blockchain.

## 📁 Structure

blockchain/
├── contracts/
│ └── PasswordManager.sol # Main smart contract
├── scripts/
│ ├── compile.js # Compilation script
│ └── deploy.js # Deployment script
├── test/
│ └── PasswordManager.test.js # Mocha tests
├── artifacts/
│ └── PasswordManager.json # Compiled contract (generated)
├── package.json
└── README.md


## 🛠️ Installation

npm install


## 📝 Smart Contract Overview

### PasswordManager.sol

A Solidity 0.7.6 smart contract that stores password entries for users with the following features:

**Functions:**
- `addPassword(service, encryptedPassword)` - Add a new password entry
- `getPasswordCount()` - Get total password count for user
- `getPassword(index)` - Get password at specific index
- `getAllPasswords()` - Get all passwords for user
- `deletePassword(index)` - Delete password at specific index

**Events:**
- `PasswordAdded` - Emitted when password is added
- `PasswordDeleted` - Emitted when password is deleted

**Data Structure:**

struct PasswordEntry {
string service;
string encryptedPassword;
uint256 timestamp;
}


## 🚀 Usage

### 1. Start Ganache UI

- Download from https://trufflesuite.com/ganache/
- Open Ganache and create/start a workspace
- RPC Server should be running on `http://127.0.0.1:7545`
- Note down a private key from any account

### 2. Configure Environment

Create `.env` file:

GANACHE_URL=http://127.0.0.1:7545
GANACHE_PRIVATE_KEY=0xYOUR_GANACHE_PRIVATE_KEY_HERE


### 3. Compile Smart Contract

npm run compile


This creates `artifacts/PasswordManager.json` with ABI and bytecode.

### 4. Deploy Smart Contract

npm run deploy


This deploys the contract to Ganache and saves deployment info to:
- `server/contracts/deployed.json` - For backend
- `client/src/blockchain/smartContractABI.json` - For frontend

### 5. Run Tests

npm test


## 📦 Scripts

- `npm run compile` - Compile smart contract
- `npm run deploy` - Deploy to Ganache
- `npm test` - Run Mocha tests

## 🔍 Testing

Tests are written using Mocha and Chai:

npm test


Test coverage includes:
- Adding passwords
- Retrieving passwords
- Getting password count
- Deleting passwords
- Error handling for invalid operations

## 🐛 Troubleshooting

### Error: "invalid opcode"

**Cause**: Ganache UI doesn't support Solidity 0.8+

**Solution**: Contract uses Solidity 0.7.6 for compatibility

### Error: "Cannot find module 'ganache-cli'"

**Solution**: We use Ganache UI instead of CLI. No installation needed.

### Error: "Contract not deployed"

**Solution**: 
1. Ensure Ganache UI is running
2. Check RPC URL in `.env` matches Ganache (usually 7545)
3. Verify private key is correct
4. Run `npm run deploy` again

## 📄 License

MIT License
