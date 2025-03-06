import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { color, getFontFamily, scaling } from '../../themes/themes'
import Icon from '../Icon/Icon'

const {fontScale} = scaling

const ErrorText = (props) => {
  return (
    <View style={styles.error}>
      <Icon name='info-circle' color={props.color ? props.color : color.error} size={fontScale(24)} />
      <Text style={[styles.errorText, {color: props.color ? props.color : color.error}]}>{props.error}</Text>
    </View>
  )
}

ErrorText.propTypes = {
    error: PropTypes.string.isRequired,
    color: PropTypes.string
}

const styles = StyleSheet.create({
  error: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },

  errorText: {
      fontFamily: getFontFamily('DMSans', "800"),
      textAlign: 'center',
      fontSize: fontScale(15),
  }
})

export default ErrorText
