import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveUserSettings, getUserSettings, startRealtimeScanning, stopRealtimeScanning } from '../services/settingsService';
import { getSecurityScore } from '../services/securityService';

const UserSettings = () => {
  const { user } = useAuth();
  const [thresholdValue, setThresholdValue] = useState(50);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderInterval, setReminderInterval] = useState('1week');
  const [realtimeScanning, setRealtimeScanning] = useState(false);
  const [showThresholdAlert, setShowThresholdAlert] = useState(false);
  const [showReminderAlert, setShowReminderAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanningStatus, setScanningStatus] = useState('idle');
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [showSecurityNotification, setShowSecurityNotification] = useState(false);
  const [securityNotificationData, setSecurityNotificationData] = useState(null);

  // Load user settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Password reminder popup timer
  useEffect(() => {
    if (!reminderEnabled) return;

    const getIntervalMs = (interval) => {
      switch (interval) {
        case '1s': return 1000;
        case '1week': return 7 * 24 * 60 * 60 * 1000;
        case '1month': return 30 * 24 * 60 * 60 * 1000;
        case '3months': return 90 * 24 * 60 * 60 * 1000;
        case '6months': return 180 * 24 * 60 * 60 * 1000;
        default: return 30 * 24 * 60 * 60 * 1000;
      }
    };

    const intervalMs = getIntervalMs(reminderInterval);
    console.log(`Setting reminder interval to ${intervalMs}ms (${reminderInterval})`);

    // Show immediately for testing if 1s
    if (reminderInterval === '1s') {
      setTimeout(() => {
        console.log('Showing password change reminder!');
        setShowReminderPopup(true);
      }, 1000);
    }

    const timer = setInterval(() => {
      console.log('Showing password change reminder!');
      setShowReminderPopup(true);
    }, intervalMs);

    return () => {
      console.log('Cleaning up reminder timer');
      clearInterval(timer);
    };
  }, [reminderEnabled, reminderInterval]);

  // Security threshold monitoring
  useEffect(() => {
    if (!thresholdValue) return;

    const checkSecurityThreshold = async () => {
      try {
        const scoreData = await getSecurityScore();
        
        if (scoreData && scoreData.score < thresholdValue) {
          const severity = 100 - scoreData.score;
          
          if (severity >= thresholdValue) {
            setSecurityNotificationData({
              severity,
              score: scoreData.score,
              weakPasswords: scoreData.weakPasswords,
              recommendations: scoreData.recommendations
            });
            setShowSecurityNotification(true);
          }
        }
      } catch (error) {
        console.error('Failed to check security threshold:', error);
      }
    };

    // Check immediately
    checkSecurityThreshold();

    // Check every 2 minutes
    const interval = setInterval(checkSecurityThreshold, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [thresholdValue]);

  const loadSettings = async () => {
    try {
      const settings = await getUserSettings();
      if (settings) {
        setThresholdValue(settings.alertThreshold || 50);
        setReminderEnabled(settings.reminderEnabled || false);
        setReminderInterval(settings.reminderInterval || '1week');
        setRealtimeScanning(settings.realtimeScanning || false);
        
        if (settings.realtimeScanning) {
          setScanningStatus('active');
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      setLoading(true);
      await saveUserSettings(newSettings);
      console.log('Settings saved successfully:', newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThresholdChange = (e) => {
    const value = parseInt(e.target.value);
    setThresholdValue(value);
    setShowThresholdAlert(true);
    setTimeout(() => setShowThresholdAlert(false), 3000);
    
    // Save settings immediately
    saveSettings({
      alertThreshold: value,
      reminderEnabled,
      reminderInterval,
      realtimeScanning
    });
  };

  const handleReminderToggle = (e) => {
    const enabled = e.target.checked;
    setReminderEnabled(enabled);
    
    if (enabled) {
      setShowReminderAlert(true);
      setTimeout(() => setShowReminderAlert(false), 3000);
    }
    
    // Save settings
    saveSettings({
      alertThreshold: thresholdValue,
      reminderEnabled: enabled,
      reminderInterval,
      realtimeScanning
    });
  };

  const handleIntervalChange = (e) => {
    const interval = e.target.value;
    setReminderInterval(interval);
    
    // Save settings
    saveSettings({
      alertThreshold: thresholdValue,
      reminderEnabled,
      reminderInterval: interval,
      realtimeScanning
    });
  };

  const handleRealtimeScanningToggle = async () => {
    const newValue = !realtimeScanning;
    setRealtimeScanning(newValue);
    
    try {
      setScanningStatus('starting');
      
      if (newValue) {
        await startRealtimeScanning();
        setScanningStatus('active');
      } else {
        await stopRealtimeScanning();
        setScanningStatus('idle');
      }
      
      // Save settings
      await saveSettings({
        alertThreshold: thresholdValue,
        reminderEnabled,
        reminderInterval,
        realtimeScanning: newValue
      });
    } catch (error) {
      console.error('Failed to toggle scanning:', error);
      setScanningStatus('error');
      setRealtimeScanning(!newValue); // Revert on error
      
      // Auto-hide error after 5 seconds
      setTimeout(() => {
        if (scanningStatus === 'error') {
          setScanningStatus('idle');
        }
      }, 5000);
    }
  };

  const dismissReminderPopup = () => {
    setShowReminderPopup(false);
  };

  const dismissSecurityNotification = () => {
    setShowSecurityNotification(false);
  };

  return (
    <div className="dashboard-container fade-in">
      {/* Security Alert Notification */}
      {showSecurityNotification && securityNotificationData && (
        <div className="modal-overlay">
          <div className="modal-content security-notification">
            <div className="notification-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚨</div>
              <h2 style={{ color: '#dc3545', margin: 0 }}>Security Alert</h2>
            </div>
            <div className="notification-body">
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                Your security score has fallen below your threshold!
              </p>
              <div style={{ background: 'rgba(220, 53, 69, 0.1)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>Current Score:</strong>
                  <span style={{ color: '#dc3545', fontWeight: 'bold' }}>{securityNotificationData.score}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>Your Threshold:</strong>
                  <span>{thresholdValue}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Weak Passwords:</strong>
                  <span style={{ color: '#dc3545', fontWeight: 'bold' }}>{securityNotificationData.weakPasswords}</span>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <strong>Recommendations:</strong>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
                  {securityNotificationData.recommendations?.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={dismissSecurityNotification}
                style={{ flex: 1 }}
              >
                Dismiss
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  dismissSecurityNotification();
                  window.location.href = '/security-analysis';
                }}
                style={{ flex: 1 }}
              >
                View Security Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reminder Popup */}
      {showReminderPopup && (
        <div className="modal-overlay">
          <div className="modal-content reminder-popup">
            <div className="reminder-header">
              <h2>🔔 Password Change Reminder</h2>
            </div>
            <div className="reminder-body">
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                It's time to update your passwords for better security!
              </p>
              <p style={{ color: '#666' }}>
                Regular password changes help protect your accounts from unauthorized access.
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
                <li>Review your password list in the dashboard</li>
                <li>Update weak or old passwords</li>
                <li>Use unique passwords for each service</li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={dismissReminderPopup}
                style={{ flex: 1 }}
              >
                Remind Me Later
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  dismissReminderPopup();
                  window.location.href = '/dashboard';
                }}
                style={{ flex: 1 }}
              >
                Update Passwords Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="password-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2>⚙️ Settings</h2>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              Manage your security preferences and notifications
            </p>
          </div>
          {user && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Logged in as</div>
              <div style={{ fontWeight: '600' }}>{user.username}</div>
            </div>
          )}
        </div>

        {/* Threshold Setting */}
        <div className="setting-section">
          <div className="setting-header">
            <h3>🎯 Security Alert Threshold</h3>
            <span className="setting-badge">{thresholdValue}%</span>
          </div>
          <p className="setting-description">
            Set the severity score threshold for receiving security alerts. You'll be notified with a popup when your password security score falls below this level.
          </p>
          
          <div className="threshold-container">
            <input
              type="range"
              min="0"
              max="100"
              value={thresholdValue}
              onChange={handleThresholdChange}
              className="threshold-slider"
            />
            
            <div className="threshold-labels">
              <span style={{ color: '#28a745' }}>0% Low</span>
              <span style={{ color: '#ffc107' }}>50% Medium</span>
              <span style={{ color: '#dc3545' }}>100% Critical</span>
            </div>
          </div>

          {showThresholdAlert && (
            <div className="alert alert-success" style={{ marginTop: '1rem' }}>
              ✅ Threshold updated to {thresholdValue}%! You will receive a popup alert when your security score falls below this level.
            </div>
          )}
        </div>

        {/* Password Change Reminder */}
        <div className="setting-section">
          <div className="setting-header">
            <h3>🔔 Password Change Reminder</h3>
            <label className="switch">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={handleReminderToggle}
              />
              <span className="slider-switch"></span>
            </label>
          </div>
          <p className="setting-description">
            Enable periodic reminders to change your passwords for better security hygiene. A popup will appear on your screen at the selected interval.
          </p>
          
          {reminderEnabled && (
            <div className="reminder-interval" style={{ marginTop: '1rem' }}>
              <label htmlFor="interval-select" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Reminder Interval:
              </label>
              <select
                id="interval-select"
                value={reminderInterval}
                onChange={handleIntervalChange}
                className="interval-dropdown"
              >
                <option value="1s">1 Second (Testing)</option>
                <option value="1week">1 Week</option>
                <option value="1month">1 Month</option>
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
              </select>
            </div>
          )}

          {showReminderAlert && reminderEnabled && (
            <div className="alert alert-info" style={{ marginTop: '1rem' }}>
              ⏰ Password change reminder activated! You will receive a popup notification every{' '}
              {reminderInterval === '1s' ? '1 second (for testing)' :
               reminderInterval === '1week' ? '1 week' :
               reminderInterval === '1month' ? '1 month' :
               reminderInterval === '3months' ? '3 months' : '6 months'}
            </div>
          )}
        </div>

        {/* Real-time Scanning */}
        <div className="setting-section">
          <div className="setting-header">
            <h3>🔍 Real-time Security Scanning</h3>
            <label className="switch">
              <input
                type="checkbox"
                checked={realtimeScanning}
                onChange={handleRealtimeScanningToggle}
                disabled={loading || scanningStatus === 'starting' || scanningStatus === 'stopping'}
              />
              <span className="slider-switch"></span>
            </label>
          </div>
          <p className="setting-description">
            Enable continuous monitoring of your passwords for security threats and data breaches
          </p>

          {scanningStatus === 'starting' && (
            <div className="alert alert-info" style={{ marginTop: '1rem' }}>
              <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '0.5rem', display: 'inline-block' }}></div>
              Starting real-time scanner...
            </div>
          )}

          {scanningStatus === 'stopping' && (
            <div className="alert alert-info" style={{ marginTop: '1rem' }}>
              Stopping real-time scanner...
            </div>
          )}

          {scanningStatus === 'error' && (
            <div className="alert alert-error" style={{ marginTop: '1rem' }}>
              ❌ Scanner temporarily unavailable. Feature will be available in production mode.
            </div>
          )}

          {!realtimeScanning && scanningStatus === 'idle' && (
            <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
              ⚠️ Real-time scanning is disabled. Enable it for continuous protection against emerging threats.
            </div>
          )}

          {realtimeScanning && scanningStatus === 'active' && (
            <div className="alert alert-success" style={{ marginTop: '1rem' }}>
              ✅ Real-time scanning is active! Your passwords are being monitored continuously for security threats.
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                • Checking for data breaches<br/>
                • Monitoring weak passwords<br/>
                • Scanning for compromised credentials
              </div>
            </div>
          )}
        </div>

        {/* Additional Settings Info */}
        <div className="setting-section" style={{ background: 'rgba(102, 126, 234, 0.05)', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
          <h3>ℹ️ About Security Settings</h3>
          <ul style={{ paddingLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
            <li><strong>Alert Threshold:</strong> Get popup notifications when your security score drops below this value</li>
            <li><strong>Password Reminders:</strong> Popup reminders appear at your chosen interval to encourage regular password updates</li>
            <li><strong>Real-time Scanning:</strong> Uses worker threads to continuously analyze passwords without impacting performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
