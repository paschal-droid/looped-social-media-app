import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../../context/ThemeContext'
import { globalStyles } from '../../../../themes'
import { scaling } from '../../../../themes/themes'
import { FriendProfileCardLayout } from '../../../../components'


const {horizontalScale, verticalScale, fontScale} = scaling


const Requests = ({navigation}) => {
    const {theme} = useTheme()

  return (
    <View style={[globalStyles.appScreen, globalStyles.spacePadding, {backgroundColor: theme.background}]}>
      <Text>Requests</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default Requests
