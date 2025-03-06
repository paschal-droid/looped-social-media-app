// NotificationComponent.js
import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import PushNotificationContext from '../../context/PushNotificationContext';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import appLogoDark from '../../assets/images/app_logo_in_app_design_dark.png'
import appLogo from '../../assets/images/app_logo_in_app_design_light.png'

import FastImage from 'react-native-fast-image';
import { scaling, getFontFamily } from '../../themes/themes';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../Icon/Icon';

const {fontScale, horizontalScale, verticalScale} = scaling

const InAppNotification = () => {
  const { notification, setNotification } = useContext(PushNotificationContext);
  const {theme} = useTheme()
  const appTheme = useColorScheme() === 'dark'

  const translateY = useSharedValue(-100); // Start position off-screen

  useEffect(() => {
    if (notification) {
      translateY.value = withSpring(0); // Slide in animation

      // Fade out animation after 5 seconds
      const timer = setTimeout(() => {
        translateY.value = withTiming(-100, { duration: 500 }); // Slide out animation
        // Reset notification state after fade out
        setTimeout(() => {
          setNotification(null);
        }, 500);
      }, notification.timing ? notification.timing : 5000);

      // Cleanup function to clear timer
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!notification) return null;

  return (
    <Animated.View style={[styles.notificationContainer, {backgroundColor: theme.oppositeBackground}, animatedStyle]}>
      <View style={[styles.notificatonImage]}>
        {notification.url ? (<FastImage source={{uri: notification.url}} priority={FastImage.priority.high} style={styles.image} />)
        : <FastImage source={appTheme ? appLogo : appLogoDark} resizeMode='contain' priority={FastImage.priority.high} style={styles.image} />}
        
      </View>
      <View style={[styles.notificatonText]}>
        <Text numberOfLines={1} style={[styles.title, {color: theme.background}]}>{notification.title}</Text>
        <Text numberOfLines={1} style={[styles.message, {color: theme.background}]}>{notification.message}</Text>
      </View>
      <View style={[styles.notificatonAction]}>
        <TouchableOpacity style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}} onPress={() => setNotification(null)}>
          <Icon name='close' size={fontScale(20)} color={theme.background} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: horizontalScale(40),
    width: '90%',
    backgroundColor: 'white',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: horizontalScale(15),
    paddingHorizontal: horizontalScale(15),
    paddingVertical: horizontalScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    zIndex: 1000,
  },
  notificatonImage: {
    width: horizontalScale(40),
    height: horizontalScale(40),
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: horizontalScale(40)

  },
  notificatonText: {
    flex: 0.8,
    // gap: 5
  },
  notificatonAction: {
    // borderWidth: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.1
  },
  title: {
    fontFamily: getFontFamily('Poppins', '600'),
    fontSize: fontScale(16),
    textTransform: 'capitalize'
  },
  message: {
    fontFamily: getFontFamily('Poppins', '400'),
    fontSize: fontScale(13)
  },
  actionDismiss : {
    fontFamily: getFontFamily('Poppins', '700'),

  },
});

export default InAppNotification;
