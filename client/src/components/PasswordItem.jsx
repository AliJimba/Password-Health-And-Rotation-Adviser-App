import React, { useState, memo } from 'react';

const PasswordItem = memo(({ password, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="password-item">
      <div className="password-info">
        <h4 className="password-service">{password.service}</h4>
        <p className="password-date">Added: {formatDate(password.timestamp)}</p>
        {showPassword && (
          <p style={{ marginTop: '0.5rem', wordBreak: 'break-all', fontSize: '0.9rem', color: '#666' }}>
            <strong>Encrypted:</strong> {password.encryptedPassword.substring(0, 50)}...
          </p>
        )}
      </div>
      <div className="password-actions">
        <button
          className="btn btn-secondary"
          onClick={() => setShowPassword(!showPassword)}
          style={{ padding: '0.5rem 1rem' }}
        >
          {showPassword ? '👁️ Hide' : '👁️ View'}
        </button>
        <button 
          className="btn btn-danger" 
          onClick={onDelete}
          style={{ padding: '0.5rem 1rem' }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
});

PasswordItem.displayName = 'PasswordItem';

export default PasswordItem;
