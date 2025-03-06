import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Lottie from 'lottie-react-native'

import animation from '../../lottie/loading.json'
import { BlurView } from '@react-native-community/blur';


const {width} = Dimensions.get('window')




export default function AppLoader() {
  return (
    <View style={[styles.lottieView]}>
      <BlurView blurAmount={10} overlayColor='' blurType='extraDark' style={StyleSheet.absoluteFill} />
      <Lottie style={styles.lottieAnimationView} autoPlay speed={1.5} source={animation} />
    </View>
  );
}

const styles = StyleSheet.create({
  lottieView: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    ...StyleSheet.absoluteFill,
  },
  lottieAnimationView: {
    width: width*0.9,
    height: width,
    alignSelf: 'center'
  },
});
