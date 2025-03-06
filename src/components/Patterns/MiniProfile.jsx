import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import FastImage from 'react-native-fast-image'

import profile from '../../assets/images/welcome/welcome-hero-image.jpg'
import { color, scaling } from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'

const {horizontalScale, verticalScale, fontScale} = scaling



const MiniProfile = ({profileUri, showHighlight, profileSize}) => {
    const {theme} = useTheme()
    return (
        <View style={[styles.profile, {width: horizontalScale(profileSize), height: horizontalScale(profileSize), borderRadius: horizontalScale(profileSize - 25)}]}>

            {showHighlight && (
                <AnimatedCircularProgress
                    size={horizontalScale(profileSize)}
                    width={2}
                    fill={100}
                    tintColor={theme.primaryColor}
                    backgroundColor={color.white}
                    style={styles.progressBar}
                />
            )}
            <FastImage 
                priority={FastImage.priority.high} 
                source={profileUri ? {uri: profileUri} : profile} 
                style={[styles.profileImage, {borderRadius: horizontalScale(profileSize-25)}]}
            />

        </View>
    )
}

MiniProfile.propTypes = {
    profileUri: PropTypes.string,
    showHighlight: PropTypes.bool.isRequired,
    profileSize: PropTypes.number.isRequired
}

const styles = StyleSheet.create({
    profile: {
        alignItems: 'center',
        borderRadius: horizontalScale(15),
        overflow: 'hidden',
        justifyContent: 'center',
    },
    profileImage: {
        aspectRatio: 1 / 1,
        width: '75%',
        borderRadius: horizontalScale(16),
    },
    progressBar: {
        position: 'absolute',
    }
})

export default MiniProfile
