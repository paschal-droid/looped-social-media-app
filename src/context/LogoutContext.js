import React, { createContext, useContext } from 'react';

const LogoutContext = createContext();

export const useLogout = () => useContext(LogoutContext);

export const LogoutProvider = ({ children, handleLogout }) => {
  return (
    <LogoutContext.Provider value={handleLogout}>
      {children}
    </LogoutContext.Provider>
  );
};