import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import { useTheme } from '../../../context/ThemeContext'
import { globalStyles } from '../../../themes'


import { useDispatch } from 'react-redux'
import { uploadProfileImages } from '../../../api/cloudStorageRequests'
import { AppLoader, AuthActionButton, HeaderTypeA, InAppNotification, ProfileUI } from '../../../components'
import PushNotificationContext from '../../../context/PushNotificationContext'
import { Routes } from '../../../navigation/Routes'
import { updateUserInfo } from '../../../redux/reducers/BioInfo'



const ProfileSelection = ({navigation}) => {
  const {theme} = useTheme()
  const {setNotification} = useContext(PushNotificationContext)
  const dispatch = useDispatch()

  const [images, setImages] = useState(Array(9).fill(null))
  const [checkImagesUploadedLength, setCheckImagesUploadedLength] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCheckImagesUploadedLength(!(images.filter(item => item !== null).length >=3) )    
  }, [images])
  

  const selectImage = async (index) => {
    await ImagePicker.openPicker({
      cropping: true,
      compressImageQuality: 0.7,
      freeStyleCropEnabled: true,
    }).then((image) => {
      let updatedImages = [...images]
      updatedImages[index] = image.path
      setImages(updatedImages)
    }).catch(() => {
      setNotification({
        title: "You didn't select an Image",
        url: '',
        timing: 3000,
        message: 'Try selecting an image of your choice'

      })
    })
  }  


  const handleProfileImageUpload = async () => {
    setLoading(true)

    const profileImages = images.filter(item => item !== null)
    const profileUpload = await uploadProfileImages(profileImages)
    if(profileUpload){
      setLoading(false)
      dispatch(updateUserInfo({profileImageUrls: profileUpload.map(item => item.downloadURL)}))
      navigation.navigate(Routes.SignupFlow5)
    }
    setLoading(false)
    setNotification({
      message: profileUpload.error,
      title: profileUpload.title,
      url: '',
      timing: 6000
    });
  }


  return (
    <>
    <InAppNotification />
    <SafeAreaView style={[{ backgroundColor: theme.background}, globalStyles.spacePadding, globalStyles.appScreen, styles.verificationContainer]}>
      {loading && <AppLoader />}
      <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.ProfileSelectionContainer}>
          <HeaderTypeA title='Set your Profile picture' subTitle='You have to upload at least 3 photos' />
          <View style={styles.ProfileSelectionInnerContainer}>
            {images.map((imageUri, index) => (
              <ProfileUI circular={false} key={index} onImagePress={() => selectImage(index)} uri={imageUri} />
            ))}
          </View>

          {/* Action to Save images and move to the next screen */}
          <AuthActionButton isDisabled={checkImagesUploadedLength} actionText='Next' handleAction={handleProfileImageUpload} />
        </View>
      </ScrollView>
    </SafeAreaView>
  </>
  )
}

export default ProfileSelection

const styles = StyleSheet.create({
  ProfileSelectionContainer: {
    gap: 45,
  },
  ProfileSelectionInnerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    rowGap: 15,
    // borderWidth: 5,
    columnGap: 12,
    flexWrap: 'wrap'
  },
  // gridView: {
  //   width: width/3.8,
  //   height: height/4.5,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderRadius: horizontalScale(20),
  //   backgroundColor: color.gray2
  // }
})