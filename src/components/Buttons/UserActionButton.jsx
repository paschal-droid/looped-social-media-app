import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { getFontFamily, scaling } from '../../themes/themes'
import Icon from '../Icon/Icon'

const {fontScale, verticalScale, horizontalScale} = scaling

const UserActionButton = (props) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const textRef = useRef(null)
  const tabWidth = {width: horizontalScale(props.width + width), height: verticalScale(props.height + height)}
  const buttonWidth = (e) => {
    setWidth(e.nativeEvent.lines[0].width)
    setHeight(e.nativeEvent.lines[0].height)
  }
  return (
    <TouchableOpacity
      onPress={props.onAction}
      style={[styles.userFollowingAction, tabWidth, {
        backgroundColor: props.backgroundColor,
        borderWidth: props.borderWidth,
        borderColor: props.borderColor
        }]}>
      {props.useIcon && <Icon name={props.icon} size={fontScale(props.iconSize)} color={props.iconColor} />}
      <Text ref={textRef} onTextLayout={(e) => buttonWidth(e)} style={[styles.actionText, {color: props.textColor, fontSize: fontScale(props.fontSize)}]}>
        {props.actionText}
      </Text>
    </TouchableOpacity>
    
  );
}

UserActionButton.propTypes =  {
    onAction: PropTypes.func.isRequired,
    actionText: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    fontSize: PropTypes.number.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    borderColor: PropTypes.string,
    borderWidth: PropTypes.number,
    useIcon: PropTypes.bool.isRequired,
    icon: PropTypes.string,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string
}

UserActionButton.default = {
  borderWidth: 0,
  borderColor: '',
}

export default UserActionButton

const styles = StyleSheet.create({
    userFollowingAction: {
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      },
      actionText: {
        fontFamily: getFontFamily('Poppins', '600'),
        textAlign: 'center'
      }
})