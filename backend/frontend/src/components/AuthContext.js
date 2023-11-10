import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getCookie from '../csrftoken';

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

  const csrftoken = getCookie('csrftoken');

  //logout 
  const logout = () => {
    fetch('users/logout/', {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
    })
    .then(response => {
        if (response.ok) {
            setAuthenticated(false);
            alert('You have logged out')
        } else {
            console.error('Logout failed');
        }
    })
    .catch(error => {
        console.error('Error during logout: ', error);
    });
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