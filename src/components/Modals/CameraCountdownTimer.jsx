import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { scaling, getFontFamily, color } from '../../themes/themes';

const { fontScale } = scaling


const CameraCountdownTimer = ({ initialTime, onComplete }) => {
  const [count, setCount] = useState(initialTime);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (count > 0) {
      // Start the scale animation
      scale.value = withTiming(1.5, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      });

      // Start the opacity animation and reset it afterward
      opacity.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      }, () => {
        opacity.value = 1; // Reset opacity after the animation completes
      });

      const timer = setTimeout(() => {
        setCount((prev) => prev - 1); // Decrement the count
        scale.value = 1; // Reset scale for the next step
      }, 1000);

      return () => clearTimeout(timer);
    } else if (count === 0 && onComplete) {
      onComplete(); // Call the onComplete callback after countdown finishes
    }
  }, [count]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (count <= 0) return null; // Hide the timer when the countdown is done

  return (
    <View style={styles.overlay}>
      <Animated.Text style={[styles.timerText, animatedStyle]}>
        {count}
      </Animated.Text>
    </View>
  );
};

CameraCountdownTimer.propTypes = {
  initialTime: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  timerText: {
    fontSize: fontScale(80),
    fontFamily: getFontFamily('Poppins', '700'),
    color: color.white,
  },
});

export default CameraCountdownTimer;
