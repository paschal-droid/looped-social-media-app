import React, { createContext, useState } from 'react';

const PushNotificationContext = createContext();

export const PushNotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  return (
    <PushNotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export default PushNotificationContext;