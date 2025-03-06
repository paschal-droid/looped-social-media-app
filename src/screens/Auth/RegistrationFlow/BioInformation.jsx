import {Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../../context/ThemeContext'
import { globalStyles } from '../../../themes'
import DatePicker from 'react-native-date-picker';
import { useDispatch, useSelector } from 'react-redux'


import { getFontFamily, scaling } from '../../../themes/themes'
import { AppLogoHeader, AuthActionButton, BioInput, DatePickerInput, HeaderText, HeaderTypeA, Icon } from '../../../components'
import { Routes } from '../../../navigation/Routes'
import { updateUserInfo } from '../../../redux/reducers/BioInfo';


const {verticalScale, horizontalScale, fontScale} = scaling

const BioInformation = ({navigation}) => {
  const {theme} = useTheme()
  const dispatch = useDispatch()

  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState('Male')
  const [occupation, setOccupation] = useState('')
  const [username, setUsername] = useState('')
  const [profileBio, setProfileBio] = useState('')
  const [birthDate, setBirthDate] = useState(new Date())

  const [open, setOpen] = useState(false)
  const [selectedGenderIndex, setSelectedGenderIndex] = useState(0)  

  const genders = [{name: 'Man', icon: 'male-gender', gender: 'Male'}, {name: 'Woman', icon: 'female-gender', gender: 'Female'}, {name: 'custom', icon: 'custom-gender', gender: 'Custom'}]
 
  //? BIO SUBMISSION

  const handleSaveBioInfo = () => {    
    dispatch(updateUserInfo({
      lastName: fullName.split(' ')[1].trim().toLowerCase(), 
      firstName: fullName.split(' ')[0].trim().toLowerCase(),
      gender: gender,
      dateOfBirth: birthDate,
      profileBio,
      occupation,
      username: username.toLowerCase()
    }))
    navigation.navigate(Routes.SignupFlow4)    
  }  

  return (
    <SafeAreaView style={[{ backgroundColor: theme.background}, globalStyles.spacePadding, globalStyles.appScreen, styles.verificationContainer]}>
      <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.bioInfoContainer}>
          <HeaderTypeA title='Fill in your bio' subTitle="You won't be able to change this later" />

          <View style={styles.bioInfoInnerContainer}>
            {/* Name container */}
            <View style={styles.userNameContainer}>
              <Text style={[styles.bioTextLabel, {color: theme.header}]}>Full Name</Text>
              <BioInput placeholder={'Type your Name'} value={fullName} handleTextChange={(val) => setFullName(val)} />
            </View>

            {/* username container */}
            <View style={styles.userNameContainer}>
              <Text style={[styles.bioTextLabel, {color: theme.header}]}>Choose your Username</Text>
              <BioInput placeholder={"Choose a unique name"} value={username} handleTextChange={(val) => setUsername(val)} />
            </View>

            {/* Gender */}
            <View style={styles.genderContainer}>
              <Text style={[styles.bioTextLabel, {color: theme.header}]}>Gender</Text>
              <View style={styles.genderPickerContainer}>
                {genders.map((item, i) => (
                  <Pressable key={i} onPress={() => {setGender(item.gender); setSelectedGenderIndex(i)}} style={[styles.genderPicker, {borderColor: i === selectedGenderIndex ? theme.oppositeBackground : theme.icon}, i != selectedGenderIndex && {opacity: 0.3}]}>
                    <Icon name={item.icon} color={theme.header} size={fontScale(20)} />
                    <Text style={[styles.genderPickerText, {color: theme.header}]}>{item.name}</Text> 
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Date of Birth */}
            <View style={styles.genderContainer}>
              <Text style={[styles.bioTextLabel, {color: theme.header}]}>Day of Birth</Text>
              <View style={styles.birthdayPickerContainer}>
                <DatePickerInput date={birthDate} onPress={() => setOpen(true)} />
                <DatePicker mode='date' modal open={open} onConfirm={(date) => {setBirthDate(date); setOpen(false)}}  date={birthDate} onCancel={() => { setOpen(false)}} />
              </View>
            </View>

            <View style={styles.userNameContainer}>
              <Text style={[styles.bioTextLabel, {color: theme.header}]}>Occupation</Text>
              <BioInput placeholder={"What's your occupation"} value={occupation} handleTextChange={(val) => setOccupation(val)} />
            </View>

            <View style={styles.userNameContainer}>
              <Text style={[styles.bioTextLabel, {color: theme.header}]}>Your Bio</Text>
              <BioInput useExtraFeatures={true} autoCapitalize={'none'} keyboardType={'ascii-capable'} placeholder={"Tell us a bit about yourself"} value={profileBio} handleTextChange={(val) => setProfileBio(val)} />
            </View>
          </View>



          {/* Continue to Next Screen */}
          <AuthActionButton actionText='Next' isDisabled={gender.length <= 1 || birthDate.getFullYear() > new Date().getFullYear()-10 || fullName.length <= 5} handleAction={handleSaveBioInfo} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BioInformation

const styles = StyleSheet.create({
  bioInfoContainer: {
    gap: 50,
  },
  bioInfoInnerContainer: {
    gap: 35
  },
  userNameContainer: {
    gap: 12
  },
  bioTextLabel: {
    fontFamily: getFontFamily('PlusJakartaSans', '800'),
    fontSize: fontScale(16),
  },
  genderContainer: {
    gap: 12
  },
  genderPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genderPicker: {
    flexDirection: 'row',
    flex: 0.3,
    gap: 5,
    borderWidth: 2,
    borderRadius: horizontalScale(1000),
    height: horizontalScale(48),
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderPickerText: {
    fontFamily: getFontFamily('PlusJakartaSans', '800'),
    fontSize: fontScale(13),
    lineHeight: horizontalScale(20),
    textTransform: 'capitalize'

  },
  
})