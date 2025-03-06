import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from '../Icon/Icon';
import { scaling, color, getFontFamily } from '../../themes/themes';
import PropTypes from 'prop-types';



const {verticalScale, horizontalScale, fontScale} = scaling


const PostSegmentedControl = ({selectedIndex, setSelectedIndex}) => {
  const options = [
    {icon: 'image', name: 'Photo', index: 0},
    {icon: 'story', name: 'Stories', index: 1},
    {icon: 'video-filled-white', name: 'Video', index: 2},
  ]

  return (
    <View style={[styles.segmentedControlContainer,]}>
      {/* Segmented Control Area */}
      {options.map((item, index) => (
        <TouchableOpacity 
          style={[styles.segment, 
            item.index === selectedIndex && {backgroundColor: color.white, borderRadius: horizontalScale(20)},
            
          ]} 
          key={index} onPress={() => setSelectedIndex(item.index)}>
          <Icon name={item.icon} color={item.index === selectedIndex ? color.black : '#ADA4A5'} size={fontScale(25)} />
          <Text style={[styles.segmentText, {color: item.index === selectedIndex ? color.black: '#ADA4A5'}]}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

PostSegmentedControl.propTypes = {
  selectedIndex: PropTypes.number.isRequired,
  setSelectedIndex: PropTypes.func.isRequired
}

export default PostSegmentedControl

const styles = StyleSheet.create({
  segmentedControlContainer: {
    flexDirection: 'row',
    gap: 20,
    height: verticalScale(35),
    borderRadius: horizontalScale(28),
    backgroundColor: '#00000026',
    alignSelf: 'center',
  },
  segment: {
    flexDirection: 'row',
    gap: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontFamily: getFontFamily('PlusJakartaSans', '700'),
    fontSize: fontScale(14),
  },
  selectedSegment: {
    borderRadius: horizontalScale(15),
  },
})