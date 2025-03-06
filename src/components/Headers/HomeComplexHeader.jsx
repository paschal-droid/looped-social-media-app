import {StyleSheet, useColorScheme, View} from 'react-native';
import React from 'react';
import { color, scaling } from '../../themes/themes';
import { useTheme } from '../../context/ThemeContext';

const {verticalScale, horizontalScale, fontScale} = scaling


const HomeHeader = ({children}) => {
    const {theme} = useTheme()
    const colorScheme = useColorScheme() === 'light'
  return (
    <View style={[styles.homeHeader, {backgroundColor: colorScheme ? color.smoke : theme.oppositeBackground}]}>
      {children}
    </View>
  );
};

HomeHeader.propTypes = {
    
}

export default HomeHeader;

const styles = StyleSheet.create({
  homeHeader: {
    marginBottom: verticalScale(15),
    rowGap: 12,
    borderBottomLeftRadius: horizontalScale(40),
    borderBottomRightRadius: horizontalScale(40),
    paddingTop: horizontalScale(10),
    paddingBottom: horizontalScale(10),
    paddingHorizontal: horizontalScale(15)
  },
  progressContainer: { 
    // position: 'absolute',
    // top: 15,
    zIndex: 10
  },
});
