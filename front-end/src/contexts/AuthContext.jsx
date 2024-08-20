import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('user_data');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData && parsedData.token && parsedData.userData) {
          setToken(parsedData.token);
          setUserData(parsedData.userData);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error reading or parsing localStorage data', error);
    }
  }, []);

  // Function to log in and store data in localStorage
  const login = (newToken, newUserData) => {
    setToken(newToken);
    setUserData(newUserData);
    setIsAuthenticated(true);
    localStorage.setItem(
      'user_data',
      JSON.stringify({ token: newToken, userData: newUserData })
    );
  };

  // Function to log out and remove data from localStorage
  const logout = () => {
    setToken(null);
    setUserData(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user_data');
    
  };

  // Provide values and functions for AuthContext
  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
