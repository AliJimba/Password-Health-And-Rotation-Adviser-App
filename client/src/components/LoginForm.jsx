import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginForm = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-auth-card fade-in">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to access your secure password vault</p>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? (
            <>
              <div className="spinner" style={{ width: '20px', height: '20px', margin: '0 0.5rem 0 0' }}></div>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
        Don't have an account?{' '}
        <button 
          onClick={onSwitchToRegister}
          style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
