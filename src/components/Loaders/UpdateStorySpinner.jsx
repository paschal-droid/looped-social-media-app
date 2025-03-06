import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { color, scaling } from '../../themes/themes';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';

const {horizontalScale, verticalScale, fontScale} = scaling


const UpdateStorySpinner = ({hasBeenViewed, width}) => {
  return (
    <LinearGradient style={[styles.staticGradient, {width: horizontalScale(width), height: horizontalScale(width)}]} 
        colors={hasBeenViewed ? ['#D3D3D3', '#C7C7C7'] : ['#C150F6', '#FF7F4E', '#EEA4CE']}
    />
  );
}

UpdateStorySpinner.propTypes = {
    hasBeenViewed: PropTypes.bool.isRequired,
    width: PropTypes.number.isRequired
}

const styles = StyleSheet.create({
    staticGradient: {
        position: 'absolute',
        width: horizontalScale(80),
        height: horizontalScale(80),
        borderRadius: horizontalScale(100),
    },
})

export default UpdateStorySpinner
