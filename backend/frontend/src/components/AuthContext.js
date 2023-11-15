import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check authentication status and update the context
    fetch('users/is_authenticated/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setAuthenticated(data.authenticated);
      })
      .catch(error => {
        console.error('Error checking authentication status: ', error);
      });
  }, []);

  //logout 
  const logout = () => {
    setAuthenticated(false);
  };

  //login
  const login = () => {
    setAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ authenticated, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);