import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getFontFamily, scaling } from '../../../../../themes/themes'
import { useTheme } from '../../../../../context/ThemeContext'

const {verticalScale, horizontalScale, fontScale} = scaling


const AddLocation = () => {
  const {theme} = useTheme()
  return (
    <View>
      <Text>AddLocation</Text>
    </View>
  )
}

export default AddLocation

const styles = StyleSheet.create({})