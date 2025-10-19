import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Web3Provider } from './blockchain/Web3ContextProvider';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import NavigationBar from './components/NavigationBar';
import UserDashboard from './components/UserDashboard';
import UserSettings from './components/UserSettings';
import SecurityReports from './components/SecurityReports';
import SecurityAnalysis from './components/SecurityAnalysis';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="auth-container">
      {showLogin ? (
        <LoginForm onSwitchToRegister={() => setShowLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <NavigationBar />}
        
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <UserSettings />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/security"
            element={
              <ProtectedRoute>
                <SecurityReports />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/security-analysis"
            element={
              <ProtectedRoute>
                <SecurityAnalysis />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <AppContent />
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;
