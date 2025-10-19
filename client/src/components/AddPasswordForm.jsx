import React, { useState } from 'react';
import { addPassword } from '../services/apiService';

const AddPasswordForm = ({ onClose, onPasswordAdded }) => {
  const [formData, setFormData] = useState({
    service: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simple encryption (for demo - use proper encryption in production)
  const encryptPassword = (password) => {
    return btoa(password); // Base64 encoding (NOT secure for production!)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.service || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const encryptedPassword = encryptPassword(formData.password);
      await addPassword(formData.service, encryptedPassword);
      onPasswordAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        <div className="modal-header">
          <h3 className="modal-title">Add New Password</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              name="service"
              className="form-input"
              placeholder="e.g., Gmail, Facebook, Netflix"
              value={formData.service}
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', margin: '0 0.5rem 0 0' }}></div>
                  Adding...
                </>
              ) : (
                'Add Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPasswordForm;
