import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { color, getFontFamily, scaling } from '../../themes/themes'
import PropTypes from 'prop-types'
import LinearGradient from 'react-native-linear-gradient'

const {verticalScale, horizontalScale, fontScale} = scaling


const GradientButton = ({text, onPress, changeGradient=false}) => {
  return (
      <TouchableOpacity onPress={onPress}>
          <LinearGradient
              useAngle={true}
              locations={[-0.84, 1.42]}
              colors={changeGradient ? ['#C150F6', '#FF7F4E',] : ['#40c9ff', '#e81cff']}
              style={[styles.userActionButtonContainer]}
          >
              <Text style={[styles.userActionText]}>{text}</Text>
          </LinearGradient>
      </TouchableOpacity>
  )
}

GradientButton.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    changeGradient: PropTypes.bool
}

export default GradientButton

const styles = StyleSheet.create({
    userActionButtonContainer: {
        height: horizontalScale(45),
        borderRadius: horizontalScale(25),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        width: '100%',
      },
      userActionText: {
        fontFamily: getFontFamily('PlusJakartaSans', '700'),
        fontSize: fontScale(18),
        textTransform: 'capitalize',
        color: color.whiteRGBA90
      },
})