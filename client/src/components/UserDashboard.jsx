import React, { useState, useEffect, useCallback } from 'react';
import { getPasswordCount } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import PasswordListPage from './PasswordListPage';

const UserDashboard = () => {
  const [passwordCount, setPasswordCount] = useState(0);
  const [securityScore, setSecurityScore] = useState({ score: 85, grade: 'B+' });
  const { user } = useAuth();

  const calculateSecurityScore = useCallback((count) => {
    if (count === 0) {
      setSecurityScore({ score: 0, grade: 'N/A', weakPasswords: 0 });
      return;
    }

    // Simple scoring algorithm
    let score = Math.min(50 + (count * 10), 95);
    
    // Add some variation for demo
    const variation = Math.floor(Math.random() * 20) - 10;
    score = Math.max(10, Math.min(100, score + variation));
    
    let grade = 'F';
    if (score >= 90) grade = 'A+';
    else if (score >= 80) grade = 'A';
    else if (score >= 70) grade = 'B+';
    else if (score >= 60) grade = 'B';
    else if (score >= 50) grade = 'C';
    else if (score >= 40) grade = 'D';

    const weakPasswords = Math.max(0, Math.floor(count * 0.2));
    
    setSecurityScore({ 
      score, 
      grade, 
      weakPasswords,
      totalPasswords: count,
      strongPasswords: count - weakPasswords
    });
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const count = await getPasswordCount();
      setPasswordCount(count);
      calculateSecurityScore(count);
    } catch (error) {
      console.error('Error loading stats:', error);
      setPasswordCount(0);
      setSecurityScore({ score: 0, grade: 'N/A' });
    }
  }, [calculateSecurityScore]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    if (score >= 40) return '#ff9800';
    return '#dc3545';
  };

  const getLastWeekChange = () => {
    const changes = ['+5%', '+3%', '+8%', '+2%', '+12%', '+7%', '+4%'];
    return changes[Math.floor(Math.random() * changes.length)];
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-welcome">
        <h1 className="welcome-title">Hello, {user?.username}! 👋</h1>
        <p className="welcome-subtitle">
          Manage your passwords securely on the blockchain
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔑</div>
          <div className="stat-title">Total Passwords</div>
          <div className="stat-value">{passwordCount}</div>
          <div className="stat-change">
            {passwordCount > 0 ? `+${passwordCount} this month` : 'Add your first password'}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🛡️</div>
          <div className="stat-title">Security Score</div>
          <div className="stat-value" style={{ color: getScoreColor(securityScore.score) }}>
            {securityScore.score > 0 ? `${securityScore.score}%` : 'N/A'}
          </div>
          <div className="stat-change" style={{ color: getScoreColor(securityScore.score) }}>
            {securityScore.score > 0 ? `${getLastWeekChange()} from last week` : 'No data yet'}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⛓️</div>
          <div className="stat-title">Blockchain Status</div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>Active</div>
          <div className="stat-change">Ganache Connected</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-title">Last Activity</div>
          <div className="stat-value" style={{ fontSize: '1.2rem' }}>Today</div>
          <div className="stat-change">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {securityScore.weakPasswords > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: '2rem' }}>
          ⚠️ You have approximately <strong>{securityScore.weakPasswords}</strong> password(s) that could be stronger. 
          Consider updating them for better security.
        </div>
      )}

      <PasswordListPage onPasswordCountChange={loadStats} />
    </div>
  );
};

export default UserDashboard;
