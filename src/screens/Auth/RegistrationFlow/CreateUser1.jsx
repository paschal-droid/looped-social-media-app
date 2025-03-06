import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import CountryPicker, {DARK_THEME} from 'react-native-country-picker-modal'
import { useTheme } from '../../../context/ThemeContext'
import { globalStyles } from '../../../themes'

import { getFontFamily, scaling } from '../../../themes/themes'
import { AppLoader, AppLogoHeader, AuthActionButton, HeaderText, InAppNotification } from '../../../components'
import { preferredCountries } from '../../../data/dataConstants'
import { Routes } from '../../../navigation/Routes'
import { createOTPRequest } from '../../../api/authRequests'
import PushNotificationContext from '../../../context/PushNotificationContext'


const {verticalScale, horizontalScale, fontScale} = scaling


const CreateUser1 = ({navigation}) => {
  const {theme} = useTheme()
  const appTheme = useColorScheme() === 'dark'
  const [country, setCountry] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {setNotification} = useContext(PushNotificationContext)


  //! Functions
  const onSelectCountry = (country) => {
    setCountry("+"+country.callingCode[0]);
    setIsVisible(false);
  }

  const handleTextChange = (value) => {
    // Remove any existing space
    newValue = value.replace(/\s/g, '');

    // Insert a space after every 4 characters
    let formattedValue = '';
    for (let i = 0; i < newValue.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += newValue[i];
    }
    setPhoneNumber(formattedValue)
  }

  const handleUserAuthentication = async () => {
    const unfilteredPhoneNumber = phoneNumber.replace(/\s/g, '')
    const readyNumber = country+unfilteredPhoneNumber
    setLoading(true)

    let confirmation = await createOTPRequest(readyNumber)
    if(confirmation.confirm && confirmation.verificationId){
      setError('')
      navigation.navigate(Routes.SignupFlow2, {confirm: confirmation, readyNumber: readyNumber})
    }
    if(confirmation.error){
      setError(confirmation.error)
      setNotification({
        title: confirmation.title,
        message: confirmation.error,
        url: '',
        timing: 10000
      })
    }
    setLoading(false)
  }

  return (
    <>
    <InAppNotification />
    <SafeAreaView style={[{ backgroundColor: theme.background}, globalStyles.spacePadding, globalStyles.appScreen, styles.verificationContainer]}>
      {loading && <AppLoader />}
      <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />
      <AppLogoHeader />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.countrySection}>

          <HeaderText first="What's your" second="phone Number?" subTextfirst={'Create an account and join in on the fun!'} />

          {/* The Country Code Selector Container */}

          <View style={[styles.countrySelectorContainer, {borderColor: theme.primaryColor}]}>
            <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.countryPicker}>
                <Text style={[styles.countryPickerText, { color: theme.primaryColor}]}>{country}</Text>
            </TouchableOpacity>

            <CountryPicker
                theme={appTheme && DARK_THEME}
                onSelect={onSelectCountry}
                withFlagButton={false}
                withCallingCodeButton={true}
                withCallingCode
                withFilter
                withEmoji={false}
                visible={isVisible}
                countryCodes={preferredCountries}
                preferredCountries={preferredCountries}
                containerButtonStyle={{ display: 'none' }}
            />

            <TextInput style={[styles.phoneNumberInput, { color: theme.header}]} placeholderTextColor={theme.header} value={phoneNumber} onChangeText={handleTextChange} maxLength={17 - country.length} keyboardType='numeric' />
          </View>

          <View style={styles.ToS}>
            <Text style={[styles.ToSText, {color: theme.oppositeBackground}]}>
            By tapping “Continue”, you agree to out{'\n'}
            <TouchableWithoutFeedback><Text style={[styles.highlightedToSText, {color: theme.primaryColor}]}>Privacy Policy</Text></TouchableWithoutFeedback> and <TouchableWithoutFeedback ><Text style={[styles.highlightedToSText, {color: theme.primaryColor}]}>Terms of Service.</Text></TouchableWithoutFeedback>
            </Text>
          </View>

          {/* Button to continue */}
          <View style={styles.authActions}>
            <AuthActionButton isDisabled={phoneNumber.length < 12} actionText='Continue' handleAction={handleUserAuthentication} />

            {/* <Pressable style={{alignItems: 'center'}} onPress={() => navigation.navigate(Routes.RegistrationFlow)}>
              <Text style={[styles.authSwitchText, {color: theme.primaryColor}]}>Already have an account? login</Text>
            </Pressable> */}
            
            {/* {error && <ErrorText error={error} />} */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </>
  )
}

export default CreateUser1

const styles = StyleSheet.create({
  verificationContainer: {},
  countrySection: {
    gap: 50
  },
  countrySelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: horizontalScale(20),
    gap: 5,
    zIndex: -1,
    paddingHorizontal: horizontalScale(10),
    height: verticalScale(55)
  },
  countryPicker: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.25,
    flexDirection: 'row'
  },
  countryPickerText: {
    fontSize: fontScale(22),
    fontFamily: getFontFamily("Poppins", "700"),
  },
  phoneNumberInput: {
    flex: 1,
    fontSize: fontScale(22),
    alignItems: 'center',
    fontFamily: getFontFamily("Poppins", "600"),
  },
  authActions: {
    gap: 25,
  },
  authSwitchText: {
    fontFamily: getFontFamily("Poppins", "600"),
    fontSize: fontScale(18)
  },
  ToS: {
    alignSelf: 'center'
},
  ToSText: {
      fontSize: fontScale(14),
      fontFamily: getFontFamily("Poppins", "500"),
      textAlign: 'center'
  },
  highlightedToSText: {
      fontFamily: getFontFamily("Poppins", "600"),
      fontSize: fontScale(14)
  },
  
})