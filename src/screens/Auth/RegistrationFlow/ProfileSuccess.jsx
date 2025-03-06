import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../../themes'
import { useTheme } from '../../../context/ThemeContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Animated, { FadeInDown, FadeInRight, Easing } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'

// images
import successImage from '../../../assets/images/welcome/profile-completed.png'

import { scaling, color} from '../../../themes/themes';
import { resetUserInfo } from '../../../redux/reducers/BioInfo'
import { Routes } from '../../../navigation/Routes'
import { AuthActionButton, HeaderTypeA } from '../../../components'
import FastImage from 'react-native-fast-image'
import { CommonActions } from '@react-navigation/native'

const {horizontalScale, verticalScale} = scaling




const ProfileSuccess = ({navigation}) => {
    const {theme} = useTheme();
    // const appTheme = useColorScheme() === 'dark'
    const {firstName} = useSelector(state => state.bioInfo);
    const dispatch = useDispatch();

    const finishedUserSetup = async () => {
        await AsyncStorage.setItem('registrationCompleted', 'true');
        dispatch(resetUserInfo())
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

  return (
    <SafeAreaView style={[globalStyles.appScreen, {backgroundColor: theme.background}, globalStyles.spacePadding]}>
      <StatusBar backgroundColor={theme.background} barStyle={theme.statusBarTextColor}  />

      <View style={[styles.successContainer]}>
        <View style={[styles.contentSuccess]}>
          <FastImage priority={FastImage.priority.high} style={[styles.successImage]} source={successImage} />

          <Animated.View style={[styles.message, {width: '80%', alignSelf: 'center'}]} entering={FadeInRight.delay(200).springify().easing(Easing.ease)}>
            <HeaderTypeA title={ firstName ?  `Welcome, ${firstName}!` : 'Welcome !'} subTitle='Your profile setup is complete, Start exploring and connecting with others!' />
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(300).springify().easing(Easing.bounce)} style={styles.bottom}>
          <AuthActionButton actionText='Go To Home' handleAction={finishedUserSetup} />
        </Animated.View>


      </View>

    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    successContainer: {
      justifyContent: 'space-between',
      flex: 1,
      paddingTop: verticalScale(30),
      gap: 20,
    },
    successImage: {
      width: '100%',
      aspectRatio: 1/1
    },
    contentSuccess: {
      gap: 48,
      flex: 1,
      alignItems: 'center',
    },
})

export default ProfileSuccess