import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import { getFontFamily, scaling } from '../../themes/themes';
import { useTheme } from '../../context/ThemeContext';

const { fontScale } = scaling


const HeaderTypeA = ({title, subTitle}) => {
    const {theme} = useTheme()
  return (
    <View style={styles.headerTypeA}>
      <Text style={[styles.headerTypeATitle, {color: theme.header}]}>
        {title}
      </Text>
      <Text style={[styles.headerTypeAsubTitle, {color: theme.paragraph}]}>
        {subTitle}
      </Text>
    </View>
  );
};

HeaderTypeA.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
}

export default HeaderTypeA;

const styles = StyleSheet.create({
  headerTypeA: {
    gap: 10,
    alignItems: 'center',
  },
  headerTypeATitle: {
    fontFamily: getFontFamily('PlusJakartaSans', '700'),
    fontSize: fontScale(28),
    lineHeight: fontScale(37),
    textAlign: 'center'
  },
  headerTypeAsubTitle: {
    fontFamily: getFontFamily('PlusJakartaSans', '400'),
    fontSize: fontScale(16),
    textAlign: 'center'
  },
});
