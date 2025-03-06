import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'

import { scaling, color, getFontFamily } from '../../themes/themes'
import FastImage from 'react-native-fast-image'
import useUserPresence from '../../utils/useUserPresence'
import { useTheme } from '../../context/ThemeContext'
import LinearGradient from 'react-native-linear-gradient'


const {horizontalScale, fontScale} = scaling


const Avatar = ({onAvatarPress, url, enableName, name, userID}) => {

  
  const isOnline = useUserPresence(userID);
  const {theme} = useTheme()    
  
  return (
    <TouchableOpacity style={styles.container} onPress={onAvatarPress}>
      <LinearGradient useAngle={true} locations={[-0.84, 1.42]} colors={['#40c9ff', theme.success]} style={[styles.avatarContainer,]}>
        <FastImage
          priority={FastImage.priority.high}
          source={{ uri: url}}
          style={[styles.avatar, {width: isOnline ? '90%': '100%'}]}
        />
        {/* Online status indicator */}
      </LinearGradient>
      <View style={[styles.details]}>
        {isOnline && <View style={styles.onlineIndicatorContainer}>
          <View style={[styles.onlineIndicator]} />
          <Text style={[styles.onlineText, {color: theme.header}]}>online</Text>
        </View>}
        {enableName && <Text style={[styles.name, {color: theme.header}]}>{name}</Text>}

      </View>
    </TouchableOpacity>
  )
}

Avatar.propTypes = {
    onAvatarPress: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    enableName: PropTypes.bool.isRequired,
    name: PropTypes.string,
    userID: PropTypes.string.isRequired
}

export default Avatar

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8
  },
    avatarContainer: {
        borderRadius: horizontalScale(75),
        justifyContent: 'center',
        width: horizontalScale(72),
        height: horizontalScale(72),
        alignItems: 'center',
    
    },
    avatar: {
        aspectRatio: 1/1,
        borderRadius: horizontalScale(100)
    },
    details: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      
    },
    onlineIndicatorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4
    },
    onlineIndicator: {
        // position: 'absolute',
        // bottom: 4,
        // right: 4,
        width: horizontalScale(4),
        height: horizontalScale(4),
        borderRadius: horizontalScale(2),
        backgroundColor: color.success,
    },
    onlineText: {
      fontFamily: getFontFamily('PlusJakartaSans', '400'),
    fontSize: fontScale(12),
    letterSpacing: 0.2,
    },
    name: {
      fontFamily: getFontFamily('PlusJakartaSans', '600'),
      fontSize: fontScale(15),
      lineHeight: fontScale(20),
      textTransform: 'capitalize',
      letterSpacing: 0.3
    },
})