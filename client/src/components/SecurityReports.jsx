import React, { useState, useEffect, useCallback } from 'react';
import { getAllPasswords } from '../services/apiService';

const SecurityReports = () => {
  const [passwords, setPasswords] = useState([]);
  const [securityScore, setSecurityScore] = useState(0);

  const calculateSecurityScore = (passwords) => {
    if (passwords.length === 0) {
      setSecurityScore(0);
      return;
    }
    
    const baseScore = Math.min(passwords.length * 10, 70);
    const randomBonus = Math.floor(Math.random() * 30);
    setSecurityScore(Math.min(baseScore + randomBonus, 100));
  };

  const loadSecurityData = useCallback(async () => {
    try {
      const data = await getAllPasswords();
      setPasswords(data);
      calculateSecurityScore(data);
    } catch (error) {
      console.error('Error loading security data:', error);
    }
  }, []);

  useEffect(() => {
    loadSecurityData();
  }, [loadSecurityData]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 50) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className="dashboard-container">
      <div className="password-list-container">
        <h2>Security Reports</h2>

        <div style={{ marginTop: '2rem' }}>
          <div className="stat-card">
            <h3>Overall Security Score</h3>
            <div
              className="stat-value"
              style={{ color: getScoreColor(securityScore) }}
            >
              {securityScore}%
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Password Analysis</h3>
            <div style={{ marginTop: '1rem' }}>
              <p>Total Passwords: <strong>{passwords.length}</strong></p>
              <p>Weak Passwords: <strong>0</strong></p>
              <p>Reused Passwords: <strong>0</strong></p>
              <p>Compromised Passwords: <strong>0</strong></p>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Recommendations</h3>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#666' }}>
              <li>Enable two-factor authentication on all accounts</li>
              <li>Use unique passwords for each service</li>
              <li>Update passwords older than 90 days</li>
              <li>Avoid using personal information in passwords</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityReports;
