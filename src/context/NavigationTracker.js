// NavigationTracker.js
import React from 'react';
import BootSplash from "react-native-bootsplash";
import { NavigationContainer } from '@react-navigation/native';
import { useScreen } from './ScreenContext';
import { navigationRef } from '../utils/navigationService';

const getCurrentRoute = (state) => {
  // Find the active route in the current state
  const route = state.routes[state.index];

  // If the active route has nested state, recursively traverse it
  if (route.state && route.state.routes && route.state.routes.length > 0) {
    return getCurrentRoute(route.state);
  }
  // Return the active route
  return route;
};

const NavigationTracker = ({ children }) => {
  const { setCurrentScreen } = useScreen(); // Access setCurrentScreen from context

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {BootSplash.hide()}}
      onStateChange={(state) => {
        const route = getCurrentRoute(state);
        setCurrentScreen(route?.name); // Update the current screen name
      }}
    >
      {children}
    </NavigationContainer>
  );
};

export default NavigationTracker;