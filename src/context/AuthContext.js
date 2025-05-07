// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = {
    user,
    setUser,
    login: async (credentials) => {
      // Implement login logic here
    },
    logout: () => {
      setUser(null);
      localStorage.removeItem('token');
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}