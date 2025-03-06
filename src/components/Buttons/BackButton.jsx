import PropTypes from 'prop-types'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { color, scaling } from '../../themes/themes'
import Icon from '../Icon/Icon'


const { horizontalScale, fontScale } = scaling

const BackButton = ({ onPress = () => { } }) => {

    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient
                colors={[color.blackRGBA50, '#1a1a1a']} // Gradient shades from black to screen background color
                useAngle={true}
                angle={-225}
                locations={[-0.84, 1.42]}
                style={styles.gradientButton}>
                <Icon name={'close2'} color={color.white} size={fontScale(25)} />
            </LinearGradient>
        </TouchableOpacity>
    )
}

BackButton.propTypes = {
    onPress: PropTypes.func.isRequired,
}

export default BackButton

const styles = StyleSheet.create({
    gradientButton: {
        borderRadius: horizontalScale(15),
        width: horizontalScale(40),
        height: horizontalScale(40),
        alignItems: 'center',
        justifyContent: 'center'

    },
})