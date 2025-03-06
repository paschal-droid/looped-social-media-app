import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { color, getFontFamily, scaling } from '../../themes/themes';

const { fontScale } = scaling;

const AutoScrollingText = ({ text, duration = 10000, fontSize = 18 }) => {
  const scrollX = useSharedValue(0); // Shared value to control scrolling animation
  const windowWidth = Dimensions.get('window').width;

  const fullTextWidth = text.length * fontSize; // Approximate width of the text
  const contentWidth = fullTextWidth * 2; // Double the width for seamless looping

   // Animation control for infinite looping
   const startScrolling = () => {
    scrollX.value = 0; // Reset the position
    scrollX.value = withTiming(fullTextWidth, {
      duration,
      easing: Easing.linear, // Smooth scrolling
    }, () => {
      // After each cycle, restart the animation
      runOnJS(startScrolling)()
    });
  };

  // Start the animation on mount
  useEffect(() => {
    startScrolling();
  }, []);

  // Animated style for translation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: -(scrollX.value % fullTextWidth), // Use modulo to reset position seamlessly
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        {/* Render text twice for seamless looping */}
        <Text style={[styles.text]}>{text}      </Text>
        <Text style={[styles.text]}>{text}      </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: '100%', // Fixed width for clipping
    overflow: 'hidden', // Hide overflowing content
  },
  animatedContainer: {
    flexDirection: 'row',
  },
  text: {
    color: color.whiteRGBA90,
    fontFamily: getFontFamily('Poppins', '400'),
    fontSize: fontScale(12),
  },
});

export default AutoScrollingText;
