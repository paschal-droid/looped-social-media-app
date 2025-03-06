import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { color, getFontFamily, scaling } from '../../themes/themes';



const {verticalScale, horizontalScale, fontScale} = scaling


const StoryType = ({setStoryType}) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
  const options = [
    {icon: 'image', name: 'photo', index: 0},
    {icon: 'video-filled-white', name: 'video', index: 1},
  ]

  const handleStoryTypeSelection = (index) => {
    setSelectedIndex(index)
    setStoryType(options[index].name)
}

  return (
    <View style={[styles.segmentedControlContainer,]}>
          {/* Segmented Control Area */}
          {options.map((item, index) => (
            <TouchableOpacity 
              style={[styles.segment, 
                item.index === selectedIndex && {backgroundColor: color.white, borderRadius: horizontalScale(15)},
               
              ]} 
              key={index} onPress={() => handleStoryTypeSelection(item.index)}>
              <Text style={[styles.segmentText, {color: item.index === selectedIndex ? color.black: '#ADA4A5'}]}>{item.name}</Text>
            </TouchableOpacity>
          ))}
    </View>
  )
}

StoryType.propTypes = {
  setStoryType: PropTypes.func.isRequired
}

export default StoryType

const styles = StyleSheet.create({
    segmentedControlContainer: {
        flexDirection: 'row',
        gap: 10,
        width: '70%',
        height: horizontalScale(35),
        borderRadius: horizontalScale(15),
        backgroundColor: '#00000026',
      },
      segment: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: horizontalScale(10)
      },
      segmentText: {
        fontFamily: getFontFamily('PlusJakartaSans', '800'),
        fontSize: fontScale(15),
        textTransform: 'capitalize'
      },
      selectedSegment: {
        borderRadius: horizontalScale(15),
      },
})