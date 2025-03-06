import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'
import { scaling, color, getFontFamily } from '../../themes/themes'
import Icon from '../Icon/Icon'


const {horizontalScale, verticalScale, fontScale} = scaling

const ActionButton = ({isDisabled=false, onPress= () => {}, actionText='', isIcon=false, icon='',}) => {
    const {theme} = useTheme()

  return (
    <TouchableOpacity disabled={isDisabled} onPress={onPress} style={[styles.actionButton]}>
        <LinearGradient
            useAngle={true}
            angle={274}
            locations={[-0.84, 1.42]}
            colors={[color.buttonBGClr, color.gradClr1]}
            style={[styles.actionContainer, isDisabled && {opacity: 0.25} ]}
        >
            <Text style={styles.actionText}>{actionText}</Text>
            {isIcon && <Icon style={styles.arrowIcon} name={icon} size={fontScale(40)} color={color.white} />}
        </LinearGradient>
    </TouchableOpacity>
  )
}

ActionButton.propTypes = {
    actionText: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    changeGradient: PropTypes.bool
}

export default ActionButton

const styles = StyleSheet.create({
    actionButton: {
    },
    actionContainer: {
        width: '80%',
        flexDirection: 'row',
        gap: 10,
        height: verticalScale(60),
        borderRadius: verticalScale(1000),
        alignItems: 'center',
        alignSelf: 'center',
    },
    actionText: {
        fontFamily: getFontFamily('PlusJakartaSans', '800'),
        fontSize: fontScale(20),
        color: color.buttonBGClr2,
        letterSpacing: 0.4,
        marginLeft: horizontalScale(45),
    },
    arrowIcon: {
        width: horizontalScale(55),
        height: horizontalScale(55),
        borderRadius: verticalScale(60),
        textAlignVertical: 'center',
        textAlign: 'center',
        backgroundColor: color.buttonBGClr2,
        position: 'absolute',
        right: horizontalScale(5)
    },
})