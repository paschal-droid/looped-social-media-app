import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'

import Icon from '../Icon/Icon'
import { useTheme } from '../../context/ThemeContext'
import { color, scaling } from '../../themes/themes'
import FastImage from 'react-native-fast-image'

const {verticalScale, horizontalScale, fontScale} = scaling

const {width, height} = Dimensions.get('window')


const ProfileUI = ({uri, onImagePress, circular=false}) => {
    const {theme} = useTheme()

  return (
    <Pressable style={[styles.gridView, circular ? {width: width/3.8, height: width/3.8, borderRadius: horizontalScale(100)} : {width: width/3.8,
        height: height/4.5, borderRadius: horizontalScale(20),}]} onPress={onImagePress}>
        {uri && <FastImage source={{uri: uri}} style={styles.profileImage} resizeMode='cover'  priority={FastImage.priority.high} />}
        <Icon color={theme.subText} name='plus-circle' size={fontScale(45)} />
    </Pressable>
  )
}

ProfileUI.propTypes = {
    uri: PropTypes.any,
    onImagePress: PropTypes.func,
    circular: PropTypes.bool
}

const styles = StyleSheet.create({
    gridView: {
        
        alignItems: 'center',
        justifyContent: 'center',
        
        overflow: 'hidden',
        backgroundColor: color.gray2
    },
    profileImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 100,
    }
})

export default ProfileUI