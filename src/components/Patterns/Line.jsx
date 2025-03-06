import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import { getFontFamily, scaling } from '../../themes/themes'

const {horizontalScale, verticalScale, fontScale} = scaling

const {width} = Dimensions.get('window')


const Line = ({useSpace=true}) => {
    const {theme} = useTheme()
  return (
    <View style={styles.optionContainer}>
        <View style={[styles.line, {backgroundColor: theme.line}]} />
        {useSpace && <View style={styles.space} />}
        <View style={[styles.line, {backgroundColor: theme.line}]} />
    </View>
  )
}

export default Line

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
  line: {
    width: width / 2.5,
    height: 1,
  },
  space: {
    width: horizontalScale(25)
  },
});