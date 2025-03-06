import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon'

import { color, scaling } from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'
import LinearGradient from 'react-native-linear-gradient'

const {fontScale, horizontalScale, verticalScale} = scaling



const TabIcon = (props) => {
    const colorScheme = useColorScheme() === 'dark'
    const {theme} = useTheme()
  return (
    <View style={[ props.isFocused && styles.tabisFocused]}>
      <Icon color={props.isFocused ? theme.primaryColor : theme.icon} name={props.isFocused ? props.name.slice(0, props.name.lastIndexOf('-')) : props.name} size={fontScale(props.size)}  />
      {props.isFocused && 
        <LinearGradient 
          useAngle={true}
          angle={274}
          locations={[-0.84, 1.42]}
          colors={[theme.gradientClr1, theme.primaryColor]}
          style={[styles.dot]}
        />
      }
    </View>
  )
}

TabIcon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    isFocused: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
  tabisFocused: {
    alignItems: 'center',
    gap: 8
  },
  dot: {
    width: verticalScale(4),
    height: verticalScale(4),
    borderRadius: verticalScale(4),
    
  },
  
})

export default TabIcon
