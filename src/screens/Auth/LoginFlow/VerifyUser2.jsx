import messaging from '@react-native-firebase/messaging';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OtpInput } from "react-native-otp-entry";


import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { createOTPRequest, loginWithOTP } from '../../../api/authRequests';
import { updateDeviceToken } from '../../../api/cloudStorageRequests';
import { AppLoader, AppLogoHeader, AuthActionButton, HeaderText, InAppNotification, NavPressable } from '../../../components';
import PushNotificationContext from '../../../context/PushNotificationContext';
import { useTheme } from '../../../context/ThemeContext';
import { Routes } from '../../../navigation/Routes';
import { globalStyles } from '../../../themes';
import { color, getFontFamily, scaling } from '../../../themes/themes';

const {verticalScale, horizontalScale, fontScale} = scaling


const VerifyUser2 = ({navigation, route}) => {
  // ! HOOKS
  const {theme} = useTheme()
  const otpRef = useRef(null)
  const {setNotification} = useContext(PushNotificationContext)

  // ! STATE MANAGEMENT
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [resendMessage, setResendMessage] = useState('')

  // ! ROUTE ITEMS
  const confirm = route.params?.confirm
  const readyNumber = route.params?.readyNumber

  
  //todo - this is responsible for decreasing the timer object from 60 to 0 every second
  useEffect(() => {
    let intervalId
    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    }
    return () => clearInterval(intervalId)
  }, [isTimerRunning])

  //todo - This checks the value of timer every second(60) till it hits zero inorder to then show the reset TImer text 
  useEffect(() => {
    if (timer === 0) {
      setIsTimerRunning(false)
    }
  }, [timer])

  //! << For Handling OTP verification code >>
  const handleFilledOTPChange = (otp) => {
    setOtp(otp)
  }

  const handleOTPVerification = async () => {
    setLoading(true)
    setResendMessage('')
    const user = await loginWithOTP(confirm, otp)

    if (user.isRegistered === true) {
      // Request permission to receive notifications
      messaging().requestPermission()
        .then(authStatus => {
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          if (enabled) {
            if(__DEV__) {
              console.log('Authorization status:', authStatus);
            
            }
          }
        });
      // Get the device token
      messaging().getToken().then(token => {
        AsyncStorage.setItem('deviceToken', `${token}`)
      });
      await AsyncStorage.setItem('registrationCompleted', 'true')

      updateDeviceToken()
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: Routes.MainNavigation,
              state: {
                routes: [{ name: Routes.Tab }],
              },
            },
          ],
        })
      );

    }
    if (!user.isRegistered) {
        navigation.navigate(Routes.RegistrationFlow, { screen: Routes.SignupFlow3 })
    }
    if (user.error) {
      setNotification({
        title: user.title,
        message: user.error,
        url: '',
        timing: 10000
      })
      setLoading(false)
    }

  }

  //! << For Handling OTP resending code >>
  const resendOTP = async () => {
    setResendMessage('')
    setLoading(true)
    const confirmation = await createOTPRequest(readyNumber)
    if (confirmation.confirm && confirmation.verificationId) {
      otpRef.current.clear()
      setResendMessage('Your OTP code has been resent, Please check and try again')
      setLoading(false)
      setTimer(60)
      setIsTimerRunning(true)
    }
    if(confirmation.error){
      setLoading(false)
      setNotification({
        title: confirmation.title,
        message: confirmation.error,
        url: '',
        timing: 4000
      })
    }    
  }


  return (
    <>
      <InAppNotification />
      <SafeAreaView
        style={[
          {backgroundColor: theme.background},
          globalStyles.spacePadding,
          globalStyles.appScreen,
          styles.verificationContainer,
        ]}>
        {loading && <AppLoader />}
        <View style={styles.appheader}>
          <NavPressable
            icon={'arrow-left'}
            onPress={() => navigation.goBack()}
          />
          <AppLogoHeader />
          <View style={styles.extraChild} />
        </View>

        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.otpVerificationContainer}>
            <HeaderText
              first="Enter the"
              second="confirmation code"
              subTextfirst={'You will soon receive the 6-digit otp'}
              subTextsecond={'code to the number provided'}
            />

            {/* OTP ENTRY CONTAINER */}
            <View style={styles.otpContainer}>
              <OtpInput
                ref={otpRef}
                numberOfDigits={6}
                focusColor={theme.primaryColor}
                onFilled={(text) => handleFilledOTPChange(text)}
                theme={{
                  containerStyle: styles.container,
                  pinCodeContainerStyle: styles.pinCodeContainer,
                  pinCodeTextStyle: styles.pinCodeText,
                  focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                }}
              />
            </View>

            {/* RESEND CONTAINER SECTION */}
            <View style={styles.OTPResendCodeContainer}>
              <TouchableOpacity disabled={timer !== 0} onPress={resendOTP}>
                <Text style={[styles.resendCodeText, { color: isTimerRunning ? theme.oppositeBackground : theme.primaryColor }]}>{isTimerRunning ? `Resend in ${timer}` : 'Didn’t received code? Resend code'}</Text>
              </TouchableOpacity>
              <AuthActionButton isDisabled={otp.length < 6} actionText='Continue' handleAction={handleOTPVerification} />
              {resendMessage.length !== 0 && <Text style={[styles.resendCodeText, { color: theme.oppositeBackground }]}>{resendMessage}</Text>}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

export default VerifyUser2

const styles = StyleSheet.create({
  verificationContainer: {},
  appheader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  extraChild: {
    flex: 0.25
  },
  otpVerificationContainer: {
    gap: 50
  },
  pinCodeText: {
    fontFamily: getFontFamily('Poppins', "700"),
    color: color.primary
  },
  pinCodeContainer: {
    width: horizontalScale(45),
    height: horizontalScale(45),
    borderColor: color.gray2,
    borderWidth: 1.2,
  },
  activePinCodeContainer: {
    borderColor: color.primary,
    borderWidth: 2
  },
  OTPResendCodeContainer: {
    gap: 25,
    alignItems: 'center',
    marginTop: verticalScale(20)
  },
  resendCodeText: {
    fontFamily: getFontFamily('Poppins', "600"),
    textAlign: 'center',
    fontSize: fontScale(16)
  },

})