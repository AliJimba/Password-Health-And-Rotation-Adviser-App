# 🔐 Password Health Management System

A decentralized password management application built with blockchain technology, React, Node.js, and MongoDB.

## 📋 Project Overview

This project is a full-stack application that securely stores passwords on the blockchain using Ganache (local Ethereum network) while managing user authentication via MongoDB Atlas. The application provides a modern, secure way to manage passwords with blockchain immutability and transparency.

## 🏗️ Project Structure

password-health-app/
├── blockchain/ # Smart contracts & deployment scripts
├── server/ # Backend API (Node.js + Express)
├── client/ # Frontend (React)
└── README.md # This file


## 🚀 Features

- ✅ **User Authentication** - JWT-based secure authentication
- ✅ **Blockchain Storage** - Passwords stored on Ethereum blockchain (Ganache)
- ✅ **Encrypted Passwords** - Base64 encryption for password security
- ✅ **Modern UI** - Beautiful, responsive interface with glass morphism design
- ✅ **MetaMask Integration** - Connect wallet for blockchain interactions
- ✅ **Security Dashboard** - View password health and security scores
- ✅ **MongoDB Atlas** - Cloud database for user management
- ✅ **Real-time Updates** - Auto-refresh password list

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Axios
- Ethers.js v5
- Material-UI
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- ethers.js

### Blockchain
- Solidity 0.7.6
- Ganache UI
- ethers.js
- solc compiler

## 📦 Installation

### Prerequisites

- Node.js v16+ and npm
- MongoDB Atlas account (free tier works)
- Ganache UI (download from https://trufflesuite.com/ganache/)
- Git

### 1. Clone Repository

git clone <your-repo-url>
cd password-health-app


### 2. Setup Blockchain

See [blockchain/README.md](blockchain/README.md) for detailed instructions.

cd blockchain
npm install
npm run compile
npm run deploy


### 3. Setup Backend

See [server/README.md](server/README.md) for detailed instructions.

cd server
npm install

Configure .env file
npm run seed
npm start


### 4. Setup Frontend

See [client/README.md](client/README.md) for detailed instructions.

cd client
npm install

Configure .env file
npm start


## 🔧 Configuration

### Environment Variables

Create `.env` files in each folder:

**blockchain/.env**

GANACHE_URL=http://127.0.0.1:7545
GANACHE_PRIVATE_KEY=0xYOUR_GANACHE_PRIVATE_KEY


**server/.env**

PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
BLOCKCHAIN_RPC=http://127.0.0.1:7545
GANACHE_PRIVATE_KEY=0xYOUR_GANACHE_PRIVATE_KEY


**client/.env**

REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BLOCKCHAIN_RPC=http://127.0.0.1:7545
REACT_APP_CHAIN_ID=1337


## 🎯 Usage

### Start the Application

1. **Start Ganache UI** - Open Ganache and start a workspace
2. **Start Backend** - `cd server && npm start`
3. **Start Frontend** - `cd client && npm start`
4. **Open Browser** - Navigate to http://localhost:3000

### Test Accounts

After seeding the database:

- Email: `admin@passwordhealth.com` / Password: `admin123`
- Email: `test@example.com` / Password: `test123`

## 📚 Documentation

- [Blockchain Documentation](blockchain/README.md)
- [Backend API Documentation](server/README.md)
- [Frontend Documentation](client/README.md)

## 🔐 Security Features

- JWT-based authentication with secure tokens
- Password hashing with bcryptjs (10 salt rounds)
- Blockchain immutability for password storage
- CORS protection on backend
- Input validation and sanitization
- Encrypted password transmission

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Muhamed Ali Jinnah 

## Acknowledgments

- Ganache for local blockchain development
- MongoDB Atlas for cloud database
- OpenZeppelin for smart contract best practices
- React community for excellent documentation

## 📧 Contact

For questions or support, please open an issue or contact [muhamedalijinnah9@gmail.com]

---

**Note**: This is a demonstration project. For production use, implement proper encryption (AES-256), key management, and security audits.


