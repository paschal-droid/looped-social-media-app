import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'

import PropTypes from 'prop-types'
import Icon from './Icon'

import { color, scaling } from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'
import LinearGradient from 'react-native-linear-gradient'

const {fontScale, horizontalScale, verticalScale} = scaling



const CreateTabIcon = (props) => {
    const colorScheme = useColorScheme() === 'light'
    const {theme} = useTheme()
  return (
    <View style={[styles.tab, {backgroundColor: colorScheme ? color.smoke : theme.oppositeBackground}]}>
      <Icon color={theme.background} name={props.name} size={fontScale(props.size)}  />
    </View>
  )
}

CreateTabIcon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    isFocused: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
  tab: {
    width: horizontalScale(65),
    height: horizontalScale(65),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default CreateTabIcon
