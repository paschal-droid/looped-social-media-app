import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'

import FastImage from 'react-native-fast-image'
import { globalStyles } from '../../themes'
import { color, getFontFamily, scaling } from '../../themes/themes'

const {fontScale, horizontalScale, verticalScale} = scaling

import { ActionBtn } from '../../components'
import { Routes } from '../../navigation/Routes'

import { SafeAreaView } from 'react-native-safe-area-context'
import bg3 from '../../assets/images/welcome/backdrop-2-image.png'
import bg4 from '../../assets/images/welcome/backdrop-3-image.png'
import bg2 from '../../assets/images/welcome/backdrop-image.png'
import bg1 from '../../assets/images/welcome/welcome-hero-image.jpg'


const backgrounds = [bg1, bg2, bg3, bg4]

const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)] 

const Welcome = ({navigation}) => {

  return (
    <SafeAreaView style={[globalStyles.appScreen]}>
      <StatusBar barStyle={'light-content'} backgroundColor={color.black} />
      <FastImage source={randomBackground} style={styles.welcomeImage} priority={FastImage.priority.high} />
      <View
        style={[
          styles.welcomeImage,
          {backgroundColor: color.blackRGBA45},
        ]}
      />
      <View style={[styles.welcomeContentContainer, globalStyles.spacePadding]}>
        <View style={styles.welcomeContent}>
          <Text style={[styles.welcomeTitleText, {color: color.white}]}>Connect, Share, and Discover!</Text>
          <Text style={[styles.welcomeSubtitleText, {color: color.white}]}>Explore, connect and share moments with friends and communities that matter to you</Text>
        </View>
        <View style={styles.bottom}>
          <ActionBtn isIcon={true} icon='arrow-forward' onPress={() => navigation.push(Routes.Prompt)} actionText='Get Started' />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  welcomeImage: {
    position: 'absolute',
    top: 0,
    bottom: 0, 
    right: 0,
    left: 0
  },
  welcomeContentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  welcomeContent: {
    alignItems: 'center',
   justifyContent: 'flex-end',
    flex: 0.8,
    gap: 15
  },
  welcomeTitleText: {
    fontSize: fontScale(36),
    fontFamily: getFontFamily('PlusJakartaSans', '800'),
    textAlign: 'center',
    lineHeight: fontScale(50)
  },
  welcomeSubtitleText: {
    fontSize: fontScale(14),
    fontFamily: getFontFamily('Poppins', '300'),
  },
})

export default Welcome