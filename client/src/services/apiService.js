import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API_URL configured as:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = async (email, password) => {
  console.log('Login attempt:', email);
  const response = await api.post('/auth/login', { email, password });
  console.log('Login response:', response.data);
  
  // Backend returns: { success: true, data: { id, username, email, walletAddress, token } }
  return {
    token: response.data.data.token,
    user: {
      id: response.data.data.id,
      username: response.data.data.username,
      email: response.data.data.email,
      walletAddress: response.data.data.walletAddress
    }
  };
};

export const register = async (userData) => {
  console.log('Register attempt:', userData.email);
  const response = await api.post('/auth/register', userData);
  console.log('Register response:', response.data);
  
  // Backend returns: { success: true, data: { id, username, email, walletAddress, token } }
  return {
    token: response.data.data.token,
    user: {
      id: response.data.data.id,
      username: response.data.data.username,
      email: response.data.data.email,
      walletAddress: response.data.data.walletAddress
    }
  };
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

// Password Management APIs
export const addPassword = async (service, encryptedPassword) => {
  const response = await api.post('/passwords', { service, encryptedPassword });
  return response.data;
};

export const getAllPasswords = async () => {
  const response = await api.get('/passwords');
  return response.data.data;
};

export const getPasswordCount = async () => {
  const response = await api.get('/passwords/count');
  return response.data.data.count;
};

export const getPassword = async (index) => {
  const response = await api.get(`/passwords/${index}`);
  return response.data.data;
};

export const deletePassword = async (index) => {
  const response = await api.delete(`/passwords/${index}`);
  return response.data;
};

export default api;
