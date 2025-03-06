import React, { useCallback, useEffect, useState } from 'react'
import { ThemeProvider} from './src/context/ThemeContext'
import { PushNotificationProvider } from './src/context/PushNotificationContext'
import AuthNavigation from './src/navigation/authNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import store from './src/redux/store';
import { Provider } from 'react-redux';
import MainNavigation from './src/navigation/mainNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {STREAM_API_KEY} from '@env'
import { LogoutProvider } from './src/context/LogoutContext';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-native-sdk';
import { Chat, OverlayProvider } from "stream-chat-react-native";
import { StreamChat } from 'stream-chat';
import { mapToStreamTheme } from './src/utils/streamThemes';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from './src/themes/appTheme';
import { CallProvider } from './src/context/CallContext';
import messaging from '@react-native-firebase/messaging';
import { ScreenProvider } from './src/context/ScreenContext';
import NavigationTracker from './src/context/NavigationTracker';


const App = () => {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [registrationCompleted, setRegistrationCompleted] = useState(false)
  const [streamClient, setStreamClient] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [chatClientInitialized, setChatClientInitialized] = useState(false);
  const appearanceTheme = useColorScheme() === 'dark'

  const streamTheme = mapToStreamTheme(appearanceTheme ? darkTheme : lightTheme);
  

  useEffect(() => {
    const initializeStreamClient = async (user) => {
      try {
        const {streamToken, deviceToken} = (await firestore().collection('users').doc(user.uid).get()).data()
        const chatClient = StreamChat.getInstance(STREAM_API_KEY);
        
        
        if (!streamToken) {
          throw new Error('Stream token not found');
        }
        // Create Stream client
        const client = StreamVideoClient.getOrCreateInstance({
          apiKey: STREAM_API_KEY,
          user: {id: user.uid},
          token: streamToken,
        });

        // Initialize Stream Chat Client (only if not already initialized)
        if (!chatClient.user) {
          await chatClient.connectUser({ id: user.uid }, streamToken, { presence: true });
          setChatClient(chatClient);
          const {devices} = await chatClient.getDevices();
          const isDeviceRegistered = devices.some(device => device.id === deviceToken);
          if (!isDeviceRegistered) {
            chatClient.addDevice(deviceToken, 'firebase', auth().currentUser.uid, 'firebase-notification')
            .then(() => {})
            .catch((error) => {if (__DEV__) { console.log('Error from Registering Device to Stream', error)}});
          } 
          
        }

        setStreamClient(client);

      } catch (error) {
        if (__DEV__) {
          console.error('Stream client initialization failed:', error);
        }
      }
    };
    if (user && registrationCompleted) {
      initializeStreamClient(user);
    }
  }, [user, registrationCompleted]);
  
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false)
    }
  }

  async function loadRegistrationStatus() {
    const value = await AsyncStorage.getItem('registrationCompleted');
    const registrationCompleted = value === 'true';
    setRegistrationCompleted(registrationCompleted);
    setLoading(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    loadRegistrationStatus()
    
    return () => {
      subscriber()
    };
    //unsubscribe after app has been loaded, we no longer need to check for the state of the user
  }, [])

   // Logout function
   const handleLogout = useCallback(async () => {
    try {
      // Disconnect Stream client if it exists
      if (streamClient) {
        await streamClient?.disconnectUser();
        setStreamClient(null); // Clear the client from state
      }
      if (chatClient) {
        const fcmToken = messaging().getToken()
        await chatClient.disconnectUser();
        await chatClient.removeDevice(fcmToken)
        setChatClient(null);
      }

      // Firebase logout
      await auth().signOut();

      // Clear registration status from AsyncStorage
      await AsyncStorage.removeItem('registrationCompleted');

      // Reset state
      setUser(null);
      setRegistrationCompleted(false);
      setChatClientInitialized(false);
    } catch (error) {
      if (__DEV__) {
        console.error('Logout failed:', error);
      }
    }
  }, []
)
  

const client = streamClient || StreamVideoClient.getOrCreateInstance({
  apiKey: STREAM_API_KEY,
  user: { id: 'guest', name: 'guest' },
  token: 'guest_user_token',
  options: { logLevel: 'warn' }, // Optional: Set log level to avoid unnecessary logs
});

const chat = chatClient || StreamChat.getInstance(STREAM_API_KEY);

  if (initializing || loading) return null

  

  return (
    <Provider store={store}>
      <ScreenProvider>
        <NavigationTracker>
          <ThemeProvider>
          <LogoutProvider handleLogout={handleLogout}>
            <PushNotificationProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                {user && registrationCompleted ? (
                  <StreamVideo client={client}>
                    <OverlayProvider value={{style: streamTheme}}>
                      <Chat client={chat}>
                        <CallProvider>
                          <MainNavigation />
                        </CallProvider>
                      </Chat>
                    </OverlayProvider>
                  </StreamVideo>
                ) : (
                  <AuthNavigation />   
                )
              }
              </GestureHandlerRootView>
            </PushNotificationProvider>
          </LogoutProvider>
          </ThemeProvider>
        </NavigationTracker>
      </ScreenProvider>
    </Provider>
  )
}


export default App

