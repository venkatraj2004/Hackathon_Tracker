import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { apiCall } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
  }, []);

  useEffect(() => {
    if (token) {
      const storedExpiry = localStorage.getItem('tokenExpiry');
      let timeRemaining = null;
      
      if (storedExpiry) {
        timeRemaining = parseInt(storedExpiry, 10) - Date.now();
      }

      // If token is already expired based on 20 min tracker, clean up and logout
      if (timeRemaining !== null && timeRemaining <= 0) {
        logout();
      } else {
        setUser({ token });
        
        // Setup timeout to auto-logout exactly 20 mins from login
        const timeoutMs = timeRemaining > 0 ? timeRemaining : 20 * 60 * 1000;
        const timeoutId = setTimeout(() => {
          logout();
          // Optional: we can alert or simply let the app silently route them to login
          window.location.reload(); // Quick UX reset to flush state and navigate to login
        }, timeoutMs);
        
        setLoading(false);
        return () => clearTimeout(timeoutId);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token, logout]);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const jwtToken = data.token;

      // Expire exactly 20 mins from login
      const expiryTime = Date.now() + 20 * 60 * 1000;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      setToken(jwtToken);
      setUser({ token: jwtToken });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
