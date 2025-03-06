// ScreenContext.js
import React, { createContext, useContext, useState } from 'react';

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState(null);

  return (
    <ScreenContext.Provider value={{ currentScreen, setCurrentScreen }}>
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreen = () => useContext(ScreenContext);