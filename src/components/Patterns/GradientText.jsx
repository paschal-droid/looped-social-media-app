import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import PropTypes from 'prop-types';
import { scaling } from '../../themes/themes';

const {horizontalScale, verticalScale, fontScale} = scaling


const GradientText = ({ text, outsideStyles, gradientColors }) => {
    const { fontSize = 16 } = StyleSheet.flatten(outsideStyles);
  return (
    <View style={styles.container}>
      <Svg style={styles.svgContainer}>
        <Defs>
          <LinearGradient id="textGradient" x1="0" y1="0" x2="1" y2="0">
            {gradientColors.map((color, index) => (
                <Stop key={index} offset={`${(index / (gradientColors.length - 1)) * 100}%`} stopColor={color} />
                ))}
          </LinearGradient>
        </Defs>
        <SvgText
          fill="url(#textGradient)" // Apply gradient
          fontSize={fontScale(fontSize)}
          fontWeight="bold"
          {...outsideStyles}
          x="52%"
          y="50%"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {text}
        </SvgText>
      </Svg>
    </View>
  );
};

GradientText.propTypes = {
    text: PropTypes.string.isRequired,
    gradientColors: PropTypes.array.isRequired,
    outsideStyles: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    borderWidth: 0
  },
  svgContainer: {
    padding: 0,
    margin: 0,
    borderWidth: 0
    // alignSelf: 'center',
    // justifyContent: 'center',
    // alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'white'
  },
});

export default GradientText;
