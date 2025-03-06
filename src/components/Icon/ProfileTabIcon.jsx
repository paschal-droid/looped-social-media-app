import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon'

import { color, scaling } from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'
import { useSelector } from 'react-redux'
import FastImage from 'react-native-fast-image'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

const {fontScale, horizontalScale, verticalScale} = scaling



const ProfileTabIcon = (props) => {
    const colorScheme = useColorScheme() === 'dark'
    const {theme} = useTheme()
    const {currentUser} = useSelector(state => state.user)
    
  return (
    <View style={styles.profile}>
      {props.isFocused && (
        <AnimatedCircularProgress
          size={horizontalScale(42)}
          width={2}
          fill={100}
          tintColor={theme.primaryColor}
          backgroundColor={color.white}
          style={styles.progressBar}
        />
      )}
      {currentUser ? (
        <FastImage priority={FastImage.priority.high} source={{uri: currentUser?.profileImages[0]}}  style={styles.profileImage} />
      ) : ( 
        <Icon color={props.isFocused ? theme.primaryColor : theme.icon} name={'user'} size={fontScale(30)} />
      )}
    </View>
  )
}

ProfileTabIcon.propTypes = {
  isFocused: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
  profile: {
    width: horizontalScale(42),
    height: horizontalScale(42),
    alignItems: 'center',
    borderRadius: horizontalScale(16),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  profileImage: {
    aspectRatio: 1/1,
    width: '75%',
    borderRadius: horizontalScale(16),
  },
  progressBar: {
    position: 'absolute',
    // borderRadius: horizontalScale(16)
  }
})

export default ProfileTabIcon
