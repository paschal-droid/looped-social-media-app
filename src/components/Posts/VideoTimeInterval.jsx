import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { color, getFontFamily, scaling } from '../../themes/themes';

const {verticalScale, horizontalScale, fontScale} = scaling

const VideoTimeInterval = ({setSelectedRecordingTime}) => {
    const [selectedIndex, setSelectedIndex] = useState(2)
    const options = [
        {time: 180000, text: '3m'},
        {time: 60000, text: '60s'},
        {time: 15000, text: '15s'},
    ]

    const handleRecordTime = (index) => {
        setSelectedIndex(index)
        setSelectedRecordingTime(options[index].time)
    }
  return (
    <View style={[styles.segmentedControlContainer,]}>
        {options.map((time, index) => (
            <TouchableOpacity key={index} onPress={() => handleRecordTime(index)}>
                <View style={[styles.option, selectedIndex === index && {borderColor: color.white}]}>
                    <Text style={[
                        styles.optionText,
                        selectedIndex === index && {color: color.white}
                    ]}>{time.text}</Text>
                </View>
            </TouchableOpacity>
        ))}
    </View>
  )
}

VideoTimeInterval.propTypes = {
    setSelectedRecordingTime: PropTypes.func
}

export default VideoTimeInterval

const styles = StyleSheet.create({
    segmentedControlContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        gap: 15,
        
    },
    option: {
        backgroundColor: color.segmentedControl,
        paddingHorizontal: horizontalScale(15),
        paddingVertical: horizontalScale(5),
        borderRadius: 100,
        borderWidth: 1,
        borderColor: color.segmentedControl
    },
    optionText: {
        fontFamily: getFontFamily('FuturaPT', '700'),
        fontSize: fontScale(15),
        color: '#ADA4A5',
        letterSpacing: 0.4
    },

})