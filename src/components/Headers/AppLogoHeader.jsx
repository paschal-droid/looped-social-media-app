import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'

import appLogoDark from '../../assets/images/app_logo_in_app_design_dark.png'
import appLogo from '../../assets/images/app_logo_in_app_design_light.png'
import { scaling } from '../../themes/themes'


const {verticalScale, horizontalScale, fontScale} = scaling


const AppLogoHeader = () => {
  const appTheme = useColorScheme() === 'dark'
  return (
    <View style={styles.appHeader}>
        <FastImage resizeMode={FastImage.resizeMode.contain} priority={FastImage.priority.high} source={ appTheme ? appLogoDark : appLogo} style={styles.appLogoHeader} />
    </View>
  )
}

export default AppLogoHeader

const styles = StyleSheet.create({
    appHeader: {
        alignItems: 'center',
        justifyContent: 'flex-start'
      },
      appLogoHeader: {
        width: horizontalScale(100),
        height: horizontalScale(55),
        // borderWidth: 10,
      },
})