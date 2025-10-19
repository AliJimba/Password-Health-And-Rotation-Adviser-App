import React, { useState, useEffect, useCallback } from 'react';
import { getAllPasswords, deletePassword } from '../services/apiService';
import PasswordItem from './PasswordItem';
import AddPasswordForm from './AddPasswordForm';

const PasswordListPage = ({ onPasswordCountChange }) => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPasswords = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllPasswords();
      setPasswords(data);
    } catch (err) {
      setError('Failed to load passwords');
      console.error(err);
      setPasswords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPasswords();
  }, [loadPasswords]);

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this password? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deletePassword(index);
      
      await loadPasswords();
      
      if (onPasswordCountChange) {
        onPasswordCountChange();
      }
    } catch (err) {
      setError('Failed to delete password');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePasswordAdded = async () => {
    setShowAddForm(false);
    
    await loadPasswords();
    
    if (onPasswordCountChange) {
      onPasswordCountChange();
    }
  };

  if (loading) {
    return (
      <div className="password-section">
        <div className="loading" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading passwords...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="password-section">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-title">Your Passwords</h2>
        <button className="btn btn-success" onClick={() => setShowAddForm(true)}>
          ➕ Add Password
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isDeleting && (
        <div className="alert alert-info">
          <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '0.5rem', display: 'inline-block' }}></div>
          Deleting password...
        </div>
      )}

      {passwords.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3 className="empty-title">No Passwords Yet</h3>
          <p className="empty-subtitle">
            Start securing your digital life by adding your first password
          </p>
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            Add Your First Password
          </button>
        </div>
      ) : (
        <div>
          {passwords.map((password) => (
            <PasswordItem
              key={`${password.index}-${password.service}`}
              password={password}
              onDelete={() => handleDelete(password.index)}
            />
          ))}
        </div>
      )}

      {showAddForm && (
        <AddPasswordForm
          onClose={() => setShowAddForm(false)}
          onPasswordAdded={handlePasswordAdded}
        />
      )}
    </div>
  );
};

export default PasswordListPage;
