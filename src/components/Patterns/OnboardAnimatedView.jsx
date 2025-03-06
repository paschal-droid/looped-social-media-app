import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Lottie from 'lottie-react-native'
import PropTypes from 'prop-types'

import animation from '../../lottie/abstract-design.json'
import people from  '../../assets/images/people.png'
import { scaling, getFontFamily, color } from '../../themes/themes'
import FastImage from 'react-native-fast-image'

const {width, height} = Dimensions.get('window')

const {fontScale, horizontalScale, verticalScale} = scaling

const OnboardAnimatedView = (props) => {
  return (
    <View style={styles.lottieView}>
      <Lottie style={styles.lottieAnimationView} autoPlay loop source={animation} />
      <View style={styles.lottieTextView}>
        <Text style={[styles.lottieText]}>{props.vibeString}</Text>
      </View>
      <View style={{width: horizontalScale(170), height: horizontalScale(65),alignSelf: 'center',}}>
        <FastImage priority={FastImage.priority.high} resizeMode={FastImage.resizeMode.contain} source={people} style={styles.otherImage} />
      </View>
    </View>
  )
}

OnboardAnimatedView.propTypes = {
    vibeString: PropTypes.string.isRequired
}

export default OnboardAnimatedView

const styles = StyleSheet.create({
  lottieView: {
    width: width,
  },
  lottieAnimationView: {
    width: width*0.9,
    height: width*0.9,
    alignSelf: 'center'
  },
  lottieTextView: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: horizontalScale(50)
  },
  lottieText: {
    fontSize: fontScale(58),
    fontFamily: getFontFamily('PlusJakartaSans', '700'),
    textTransform: 'capitalize',
    color: color.white,
    letterSpacing: 0.4
  },
  otherImage: {
    // width: horizontalScale(170),
    // alignSelf: 'center',
    // height: verticalScale(65)
    aspectRatio: 1/1,
    
  },

})