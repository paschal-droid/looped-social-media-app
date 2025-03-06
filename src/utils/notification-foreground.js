import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

import appLogo from '../assets/images/app_logo_in_app_design.png'
import { navigationRef } from "./navigationService";
import { Routes } from "../navigation/Routes";



// Handle foreground notifications
export const unsubscribeOnMessage  = (setNotification) => {
  messaging().onMessage(remoteMessage => {

    if(remoteMessage.notification) {
      // * SEND THE NOTIFICATION MESSAGE TO OUR CONTEXT INORDER FOR OUR IN-APP NOTIFICATION COMPONENT TO SHOW
      setNotification({
        title: remoteMessage.notification?.title || 'unset notification title here',
        message: remoteMessage.notification?.body || 'unset notification message here',
        url: remoteMessage.data?.image || ""
      });
    }

  })
}

//* Handle notifications when the app is in background and tapped
export const unsubscribeOnOpened = () => {
  
  messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage) {
      const {data} = remoteMessage;
      switch (data?.type) {
        case 'message.new':
          navigationRef.current.navigate(Routes.Chat, {
            screen: Routes.ChatRoom,
            params: {channelID: data.channel_id},
          });
          break;
        case 'reaction.new':
          // Optionally, show a reaction notification.
          break;
        case 'member.added':
          // Handle a new member added event.
          break;
        case 'call.ring':
          // Navigate to your incoming call screen.
          navigationRef.current.navigate(Routes.Chat, {
            screen: Routes.ActiveCall,
          });
          break;
        case 'call.missed':
          // Navigate to your incoming call screen.
          navigationRef.current.navigate(Routes.Chat, {
            screen: Routes.ChatRoom,
          });
          break;
        // Add other cases as needed...
        default:
          break;
      }
    }
  });
}

//* Handle notifications that opened the app from a terminated state(app closed)

export const backgroundMessageHandler = () => {
  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      const {data} = remoteMessage
      switch (data.type) {
        case 'message.new':
          navigationRef.current.navigate(Routes.Chat, {
            screen: Routes.ChatRoom,
            params: {channelID: data.channel_id},
          });
          break;
        case 'reaction.new':
          // Optionally, show a reaction notification.
          break;
        case 'member.added':
          // Handle a new member added event.
          break;
        case 'call.incoming':
          // Navigate to your incoming call screen.
          break;
        // Add other cases as needed...
        default:
          break;
      }
    }
  });
}

