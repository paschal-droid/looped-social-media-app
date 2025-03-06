import PropTypes from 'prop-types'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useTheme } from '../../context/ThemeContext'
import { color, scaling } from '../../themes/themes'
import Icon from '../Icon/Icon'


const { horizontalScale, verticalScale, fontScale } = scaling

const IconGradientButton = ({ onPress = () => {}, icon, iconSize }) => {
    const { theme } = useTheme()

    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient
                colors={[color.blackRGBA50, '#1a1a1a']} // Gradient shades from black to screen background color
                useAngle={true}
                angle={-225}
                locations={[-0.84, 1.42]}
                style={styles.gradientButton}>
                <Icon name={icon} color={color.white} size={fontScale(iconSize)} />
            </LinearGradient>
        </TouchableOpacity>
    )
}

IconGradientButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    iconSize: PropTypes.number.isRequired,
}

export default IconGradientButton

const styles = StyleSheet.create({
    gradientButton: {
        borderRadius: horizontalScale(20),
        width: horizontalScale(52),
        height: horizontalScale(40),
        alignItems: 'center',
        justifyContent: 'center'
    },
})