import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set default headers for all axios requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user profile
          const response = await axios.get('/api/profile');
          
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, userId } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user profile
      const profileResponse = await axios.get('/api/profile');
      
      setUser(profileResponse.data);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { 
        username, 
        email, 
        password 
      });
      
      const { token, userId } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setIsAuthenticated(true);
      
      return { success: true, userId };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
