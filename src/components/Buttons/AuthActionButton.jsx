import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { getFontFamily, scaling } from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'

const {fontScale, verticalScale} = scaling

const AuthActionButton = (props) => {
  const {theme} = useTheme()
  return (
    <TouchableOpacity disabled={props.isDisabled} onPress={props.handleAction} style={[styles.actionButton, {backgroundColor: theme.oppositeBackground}, props.isDisabled && {opacity: 0.5}]}>
      <Text style={[styles.actionText, {color: theme.background}]}>{props.actionText}</Text>
    </TouchableOpacity>
  )
}

AuthActionButton.propTypes = {
    actionText: PropTypes.string.isRequired,
    handleAction: PropTypes.func,
    isDisabled: PropTypes.bool
}

const styles = StyleSheet.create({
    actionButton: {
      width: '100%',
      borderRadius: 1000,
      height: verticalScale(55),
      alignItems: 'center',
      justifyContent: 'center'
    },
    actionText: {
      fontFamily: getFontFamily('Poppins', '700'),
      fontSize: fontScale(18),
      textAlign: 'center',
      letterSpacing: 0.4
    }
})

export default AuthActionButton
