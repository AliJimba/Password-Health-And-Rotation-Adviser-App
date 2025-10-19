# ⚛️ Frontend - Password Health React App

Modern React frontend for the Password Health Management System with beautiful UI and blockchain integration.

## 📁 Structure

client/
├── public/
│ └── index.html
├── src/
│ ├── components/ # React components
│ │ ├── LoginForm.jsx
│ │ ├── RegisterForm.jsx
│ │ ├── NavigationBar.jsx
│ │ ├── UserDashboard.jsx
│ │ ├── PasswordListPage.jsx
│ │ ├── PasswordItem.jsx
│ │ ├── AddPasswordForm.jsx
│ │ ├── UserSettings.jsx
│ │ ├── SecurityReports.jsx
│ │ └── AutoRefreshComponent.jsx
│ ├── blockchain/ # Web3 integration
│ │ ├── Web3ContextProvider.jsx
│ │ ├── useWeb3Blockchain.js
│ │ └── smartContractABI.json (generated)
│ ├── services/ # API services
│ │ ├── securityService.js
│ │ ├── settingsService.js
│ │ ├── apiService.js
│ │ └── blockchainService.js
│ ├── context/ # React context
│ │ └── AuthContext.jsx
│ ├── App.jsx # Main app component
│ ├── App.css # Global styles
│ └── index.js # Entry point
├── .env
├── package.json
└── README.md


## 🛠️ Installation

npm install


## 🔧 Configuration

Create `.env` file:

REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BLOCKCHAIN_RPC=http://127.0.0.1:7545
REACT_APP_CHAIN_ID=1337


**Important**: After changing `.env`, restart the development server!

## 🚀 Usage

### Start Development Server

npm start


Opens browser at http://localhost:3000

### Build for Production

npm run build


Creates optimized build in `build/` folder.

### Run Tests

npm test


## 🎨 Features

### ✨ Modern UI Design

- Glass morphism effects
- Gradient backgrounds
- Smooth animations
- Responsive design
- Custom scrollbars

### 🔐 Authentication

- JWT-based login/register
- Protected routes
- Auto-redirect on authentication
- Persistent login (localStorage)

### 🔗 Blockchain Integration

- MetaMask wallet connection
- Display wallet address
- Blockchain transaction tracking
- Real-time updates

### 📊 Dashboard

- Password count statistics
- Security score
- Blockchain status
- Last activity tracking

### 🔑 Password Management

- Add new passwords
- View encrypted passwords
- Delete passwords
- Auto-refresh list

## 📱 Pages & Routes

- `/` - Redirects to dashboard or login
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard (protected)
- `/settings` - User settings (protected)
- `/security` - Security reports (protected)

## 🎯 Components Overview

### Authentication Components

- **LoginForm** - User login with pre-filled test credentials
- **RegisterForm** - New user registration with validation

### Dashboard Components

- **UserDashboard** - Main dashboard with stats and password list
- **NavigationBar** - Top navigation with wallet connect
- **PasswordListPage** - List of all passwords
- **PasswordItem** - Individual password card
- **AddPasswordForm** - Modal to add new password

### Utility Components

- **UserSettings** - User profile and settings
- **SecurityReports** - Security analysis and recommendations
- **AutoRefreshComponent** - Auto-refresh data every 30 seconds

## 🔌 API Integration

All API calls are handled through `services/apiService.js`:

import { login, register, getCurrentUser } from '../services/apiService';
import { addPassword, getAllPasswords, deletePassword } from '../services/apiService';


## 🎨 Styling

- Modern CSS with custom properties
- Glass morphism design
- Gradient backgrounds
- Hover animations
- Responsive breakpoints
- Custom components

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔍 Development

### React DevTools

Install React Developer Tools browser extension for debugging.

### Debug Mode

Check browser console (F12) for logs:
- API requests/responses
- Authentication flow
- Blockchain transactions

## 🐛 Troubleshooting

### Blank Page

**Solution**: Check browser console for errors. Usually CORS or API connection issues.

### Cannot Login

**Solution**:
1. Verify backend is running on port 5000
2. Check `.env` file has correct API_URL
3. Restart React app after `.env` changes
4. Check Network tab in DevTools

### MetaMask Not Connecting

**Solution**:
1. Install MetaMask browser extension
2. Create/import wallet
3. Connect to Ganache network (RPC: http://127.0.0.1:7545, Chain ID: 1337)

### Styles Not Loading

**Solution**:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Restart development server

## 📦 Dependencies

### Core
- react
- react-dom
- react-router-dom

### HTTP & API
- axios

### Blockchain
- ethers

### UI (Optional)
- @mui/material
- @emotion/react
- framer-motion

## 📄 License

MIT License

## 🤝 Contributing

1. Follow existing code style
2. Add comments for complex logic
3. Test on multiple browsers
4. Update documentation

