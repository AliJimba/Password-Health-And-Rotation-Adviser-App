import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const loadUser = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      // Don't call logout here to avoid infinite loop
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token, loadUser]);

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      console.log('Auth context received:', response);
      
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      
      return response;
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      console.log('Auth context received:', response);
      
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      
      return response;
    } catch (error) {
      console.error('Register error in context:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
