import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

const GradientSpinner = ({ size = 100, strokeWidth = 10, colors = ['#C150F6', '#FF7F4E'] }) => {
  // Shared value for rotation
  const rotation = useSharedValue(0);

  // Start the spin animation
  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1 // Infinite loop
    );
  }, []);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const radius = (size - strokeWidth) / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={colors[0]} />
              <Stop offset="100%" stopColor={colors[1]} />
            </LinearGradient>
          </Defs>
          {/* Partial Circle Arc */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * radius * 0.8} ${Math.PI * radius * 0.2}`} // Arc + gap
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GradientSpinner;
