import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import DatePicker from 'react-native-date-picker'
import ImagePicker from 'react-native-image-crop-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { AuthActionButton, BioInput, DatePickerInput, Icon, NavPressable, ProfileUI } from '../../../../components'
import { useTheme } from '../../../../context/ThemeContext'
import { convertSecondsToDate } from '../../../../data/dataConstants'
import { globalStyles } from '../../../../themes'
import { getFontFamily, scaling } from '../../../../themes/themes'
// import { convertSecondsToDate } from '../../../data/dataConstants'


const {fontScale, horizontalScale, verticalScale} = scaling

const ProfileEditScreen = ({navigation}) => {
  const {theme} = useTheme()
  const appTheme = useColorScheme() === 'dark'
  const {currentUser} = useSelector(state => state.user)
  const [profileImage, setProfileImage] = useState(currentUser?.profileImages[0])
  const [fullName, setFullName] = useState(currentUser?.firstName + ' ' + currentUser?.lastName)
  const [bio, setBio] = useState(currentUser?.bio)
  const [occupation, setOccupation] = useState(currentUser?.occupation)
  const [username, setUsername] = useState(currentUser?.username)
  const [birthDate, setBirthDate] = useState(currentUser?.dateOfBirth.seconds)
  const [open, setOpen] = useState(false)


  useEffect(() => {
    const dateOfBirth = convertSecondsToDate(birthDate)
    setBirthDate(dateOfBirth)
  }, [])

  const selectImage = async () => {
    await ImagePicker.openPicker({
      cropping: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.7,
      freeStyleCropEnabled: true,
    }).then((image) => {
      setProfileImage(image.path)
    }).catch(() => {
      setProfileImage(currentUser.profileImages[0])
    })
  }

  const handleSaveBioInfo = () => {

  }
  

  return (
    <SafeAreaView style={[globalStyles.appScreen, { backgroundColor: theme.background, paddingBottom: verticalScale(20)}]}>
      <View style={styles.profileHeader}>
        <View style={styles.profileUserNameContainer}>
          <NavPressable icon={'arrow-backward'} onPress={() => navigation.goBack()} />
          <Text style={[styles.profileUsername, {color: theme.header}]}>{currentUser.username}</Text>
        </View>
        <TouchableOpacity style={styles.profileExtraActionButton}>
          <Icon name='check' size={fontScale(22)} color={theme.header} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, gap: 25 }}>
        {/* Change Profile Image */}
        <TouchableOpacity onPress={selectImage} style={styles.profileImageChange}>
          <ProfileUI circular={true} positionB={4} positionR={-4} height={100} isUri={true} uri={profileImage} />
          <Text style={[styles.profileImageChangeText, {color: theme.header}]}>Change Profile</Text>
        </TouchableOpacity>

        {/* Change User info */}
        <View style={styles.bioInfoContainer}>

          <View style={styles.bioInfoInnerContainer}>
            {/* Name container */}
            <View style={styles.userNameContainer}>
              <Text style={[styles.bioTextLabel, {color: theme.header}]}>Full Name</Text>
              <BioInput placeholder={'Type your Name'} value={fullName} handleTextChange={(val) => setFullName(val)} />
            </View>

            {/* username container */}
            <View style={styles.userNameContainer}>
              <Text style={[styles.bioTextLabel, {color: theme.header}]}>Username</Text>
              <BioInput isEditable={false} placeholder={"Choose a unique name"} value={username} handleTextChange={(val) => setUsername(val)} />
            </View>

            {/* Date of Birth */}
            <View style={styles.userNameContainer}>
              <Text style={[styles.bioTextLabel, {color: theme.header}]}>Date of Birth</Text>
              <View style={styles.birthdayPickerContainer}>
                <DatePickerInput date={new Date((currentUser.dateOfBirth.seconds * 1000))} onPress={() => setOpen(true)} />
                <DatePicker mode='date' modal open={open} onConfirm={(date) => {setBirthDate(date); setOpen(false)}}  date={new Date((currentUser.dateOfBirth.seconds * 1000))} onCancel={() => { setOpen(false)}} />
              </View>
            </View>

            <View style={styles.userNameContainer}>
              <Text style={[styles.bioTextLabel, {color: theme.header}]}>Occupation</Text>
              <BioInput placeholder={"What's your occupation"} value={occupation} handleTextChange={(val) => setOccupation(val)} />
            </View>

            <View style={styles.userNameContainer}>
              <Text style={[styles.bioTextLabel, {color: theme.header}]}>Your Bio</Text>
              <BioInput useExtraFeatures={true} autoCapitalize={'none'} keyboardType={'ascii-capable'} placeholder={"Tell us a bit about yourself"} value={bio} handleTextChange={(val) => setBio(val)} />
            </View>
          </View>



          {/* Continue to Next Screen */}
          <AuthActionButton actionText='Save Changes' isDisabled={fullName.length < 6} handleAction={handleSaveBioInfo} />
          </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileEditScreen

const styles = StyleSheet.create({
  profileHeader: {
    padding: horizontalScale(18),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileUserNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  profileUsername: {
    fontFamily: getFontFamily('Poppins', '600'),
    fontSize: fontScale(20),
    textAlign: 'center',
    lineHeight: fontScale(28),
    textTransform: 'lowercase'
  },
  profileExtraActionButton: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileImageChange: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingTop: verticalScale(20)
  },
  profileImageChangeText: { 
    fontFamily: getFontFamily('PlusJakartaSans', '800'),
    fontSize: fontScale(16),
    textAlign: 'center',
    lineHeight: fontScale(28)
  },
   bioInfoContainer: {
      gap: 50,
      paddingHorizontal: horizontalScale(18)
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
})