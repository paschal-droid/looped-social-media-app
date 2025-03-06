/**
 * @format
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry, LogBox, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import App from './App';
import { name as appName } from './app.json';




// Ignore log notification by message:
LogBox.ignoreLogs(['Warning: ...']);

// Ignore all log notifications:
LogBox.ignoreAllLogs();

messaging().setBackgroundMessageHandler(async remoteMessage => {
    const {notification, data} = remoteMessage 
    
    if(Platform.OS === 'android'){
      if(notification) {
        PushNotification.localNotification({
          channelId: '1',
          title: notification.android.title,
          message: notification.android.body,
          bigPictureUrl: notification.android.imageUrl, // For big picture style notification
          largeIconUrl: notification.android.imageUrl, // For large icon
          smallIcon: notification.android?.smallIcon || '/src/assets/image/app-logo-light.png', // For small icon
          soundName: notification.android.sound || 'default',
        });
      }
      
      switch (data?.type) {
        case 'call.ring': 
          PushNotification.localNotification({
            channelId: '1',
            title: `Incoming call from ${data.created_by_display_name}`,
            message: `${data.created_by_display_name} is trying to call you`,
          })
          break;
        case 'call.missed':
          PushNotification.localNotification({
            channelId: '1',
            title: `Missed call from ${data.created_by_display_name}`,
            message: `${data.created_by_display_name} tried calling you`,
          })
          break
      }

    } else if (Platform.OS === 'ios'){
      PushNotificationIOS.addNotificationRequest({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        id: remoteMessage.threadId || '1',
        sound: remoteMessage.notification.ios.sound || 'default'
      })
    }
  });
  
  // Configure Push Notification
  PushNotification.configure({
    onRegister: async function (token) {
      console.log('TOKEN:', token.token);
      await AsyncStorage.setItem('deviceToken', `${token.token}`);
    },
    onNotification: function (notification) {
      const {data} = notification

      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    channel: '1',
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });

AppRegistry.registerComponent(appName, () => App);
