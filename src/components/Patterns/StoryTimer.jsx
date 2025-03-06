import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { color, getFontFamily, scaling } from '../../themes/themes'
import LinearGradient from 'react-native-linear-gradient'
import Icon from '../Icon/Icon'
import PropTypes from 'prop-types'

const {horizontalScale, verticalScale, fontScale} = scaling

const StoryTimer = ({timer}) => {
    return (
        <View style={styles.timerContainer}>
            <LinearGradient
                colors={[color.blackRGBA50, '#1a1a1a']} // Gradient shades from black to screen background color
                useAngle={true}
                angle={-225}
                locations={[-0.84, 1.42]}
                style={styles.timerGradient} />

            <Icon name={'clock'} color={color.white} size={fontScale(18)} />
            <Text style={styles.timerText}>{timer}</Text>
        </View>
    )
}

StoryTimer.propTypes = {
    timer: PropTypes.string.isRequired
}

export default StoryTimer

const styles = StyleSheet.create({
    timerContainer: {
        flexDirection: 'row',
        height: horizontalScale(32),
        width: horizontalScale(65),
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        borderRadius: horizontalScale(40),
        overflow: 'hidden',
    },
    timerText: {
        color: color.white,
        fontFamily: getFontFamily('FuturaPT', '500'),
        fontSize: fontScale(17)
    },
    timerGradient: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    },
})