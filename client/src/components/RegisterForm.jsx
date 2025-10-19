import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-auth-card fade-in">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join us and secure your digital life</p>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            className="form-input"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-input"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? (
            <>
              <div className="spinner" style={{ width: '20px', height: '20px', margin: '0 0.5rem 0 0' }}></div>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
        Already have an account?{' '}
        <button 
          onClick={onSwitchToLogin}
          style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
