import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../blockchain/Web3ContextProvider';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const { account, connected, connect } = useWeb3();
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/dashboard');
  };

  const goSettings = () => {
    navigate('/settings');
  };

  const goSecurityAnalysis = () => {
    navigate('/security-analysis');
  };

  return (
    <nav className="modern-navbar">
      <div 
        className="navbar-brand" 
        onClick={goHome}
        style={{ cursor: 'pointer' }}
      >
        🔐 SecureVault
      </div>

      <div className="navbar-actions">
        {user && (
          <span style={{ color: '#666', fontSize: '0.95rem' }}>
            Welcome, <strong>{user.username}</strong>
          </span>
        )}

        <button className="btn btn-secondary" onClick={goSecurityAnalysis}>
          🔍 Security Analysis
        </button>

        <button className="btn btn-secondary" onClick={goSettings}>
          ⚙️ Settings
        </button>

        {connected && account ? (
          <div className="wallet-info">
            🟢 {account.substring(0, 6)}...{account.substring(38)}
          </div>
        ) : (
          <button className="btn btn-secondary" onClick={connect}>
            Connect Wallet
          </button>
        )}

        <button className="btn btn-danger" onClick={logout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
