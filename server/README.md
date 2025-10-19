# 🖥️ Backend API - Password Health Server

Node.js + Express backend API for password management with MongoDB and blockchain integration.

## 📁 Structure

server/
├── config/
│ └── database.js # MongoDB connection
├── controllers/
│ ├── blockchainintegrationController.js
| ├── authController.js # Authentication logic
| ├── securityControler.js
| ├── settingsController.js
│ └── passwordController.js # Password management
├── middleware/
│ └── auth.js # JWT authentication middleware
├── models/
| ├── Settings.js #Settings schema
│ └── User.js # User schema
├── routes/
│ ├── authRoutes.js # Auth endpoints
| ├── securityRoutes.js # Analysis endpoints
| ├── settingsRoutes.js # Settings endpoints
│ └── passwordRoutes.js # Password endpoints
├── utils/
| ├── passwordAnalyzer.js # Password Analyzer
| ├── passwordWorker.js
│ └── blockchain.js # Blockchain integration
├── contracts/
│ └── deployed.json # Deployed contract info (generated)
├── scripts/
| ├── deployContract.js 
│ └── seedDatabase.js # Database seeding script
├── workers/
| └── realtimeScanWorker.js 
├── .env
├── app.js # Express app configuration
├── package.json
├── server.js # Server entry point
└── README.md


## 🛠️ Installation

npm install


## 🔧 Configuration

Create `.env` file:

PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/passwordhealth
JWT_SECRET=your_random_jwt_secret_key
JWT_EXPIRE=7d
BLOCKCHAIN_RPC=http://127.0.0.1:7545
GANACHE_PRIVATE_KEY=0xYOUR_GANACHE_PRIVATE_KEY


### Generate JWT Secret


node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"



### MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier works)
3. Create database user with password
4. Whitelist your IP (or allow from anywhere: 0.0.0.0/0)
5. Get connection string and add to `.env`

**Important**: URL-encode special characters in password:
- `@` becomes `%40`
- `#` becomes `%23`
- etc.

## 🚀 Usage

### Start Server

Development mode (with auto-restart):

npm run dev


Production mode:


### Seed Database with Test Users

npm run seed


This creates test accounts:
- `admin@passwordhealth.com` / `admin123`
- `test@example.com` / `test123`
- `john@example.com` / `password123`
- `alice@example.com` / `secure456`

## 📡 API Endpoints

### Authentication Endpoints

#### Register User

POST /api/auth/register
Content-Type: application/json

{
"username": "johndoe",
"email": "john@example.com",
"password": "password123"
}


#### Login

POST /api/auth/login
Content-Type: application/json

{
"email": "john@example.com",
"password": "password123"
}


#### Get Current User

GET /api/auth/me
Authorization: Bearer <token>


### Password Management Endpoints

All password endpoints require authentication.

#### Add Password

POST /api/passwords
Authorization: Bearer <token>
Content-Type: application/json

{
"service": "Gmail",
"encryptedPassword": "base64_encoded_password"
}


#### Get All Passwords

GET /api/passwords
Authorization: Bearer <token>


#### Get Password Count

GET /api/passwords/count
Authorization: Bearer <token>


#### Get Specific Password

GET /api/passwords/:index
Authorization: Bearer <token>


#### Delete Password

DELETE /api/passwords/:index
Authorization: Bearer <token>


### Health Check

GET /health


## 🔐 Authentication

- JWT tokens expire in 7 days (configurable via JWT_EXPIRE)
- Tokens must be sent in Authorization header: `Bearer <token>`
- Passwords are hashed using bcryptjs with 10 salt rounds

## 🗄️ Database Schema

### User Model

{
username: String (required, unique, min: 3 chars),
email: String (required, unique, lowercase),
password: String (required, hashed, min: 6 chars),
walletAddress: String (optional),
createdAt: Date (default: now),
lastLogin: Date
}


## 🔗 Blockchain Integration

The server connects to Ganache blockchain to store passwords on-chain:

- Reads deployed contract from `contracts/deployed.json`
- Uses ethers.js to interact with smart contract
- All password operations are blockchain transactions

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error**: "URI must include hostname, domain name, and tld"

**Solution**: URL-encode special characters in password

### Blockchain Service Unavailable

**Error**: "Blockchain service unavailable"

**Solution**:
1. Ensure Ganache UI is running
2. Deploy smart contract: `cd blockchain && npm run deploy`
3. Restart server

### Port Already in Use

**Error**: "EADDRINUSE: address already in use :::5000"

**Solution**: 
- Kill process on port 5000
- Or change PORT in `.env`

## 📊 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with test users

## 📄 License

MIT License


