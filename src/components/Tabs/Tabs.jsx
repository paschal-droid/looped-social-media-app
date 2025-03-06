import React, {useRef, useState} from 'react'
import { Pressable, StyleSheet, Text} from 'react-native'
import PropTypes from 'prop-types'

import { getFontFamily, scaling } from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'

const {horizontalScale, verticalScale, fontScale} = scaling

const Tabs = (props) => {
    const [width, setWidth] = useState(0);
    const textRef = useRef(null)
    const paddingY = 32
    const {theme} = useTheme()
    const tabWidth = {width: horizontalScale(paddingY * 2 + width)}
    const buttonWidth = (e) => {
        setWidth(e.nativeEvent.lines[0].width)
    }
  return (
    <Pressable onPress={props.onPress} style={[styles.tab, {backgroundColor: theme.oppositeBackground}, props.isInactive && {backgroundColor: theme.background, borderColor: theme.oppositeBackground}, tabWidth]}>
        <Text ref={textRef} onTextLayout={(e) => buttonWidth(e)} style={[styles.text, { color: theme.background}, props.isInactive && {color: theme.header}]}>{props.name}</Text>
    </Pressable>
  )
}

Tabs.propTypes = {
    name: PropTypes.string.isRequired,
    isInactive: PropTypes.bool,
    onPress: PropTypes.func,
    tabId: PropTypes.number.isRequired,
}

Tabs.default = {
    isInactive: false,
    onPress: () => {},
}

const styles = StyleSheet.create({
    tab: {
        borderRadius: 1000,
        height: horizontalScale(50),
        justifyContent: 'center',
        maxWidth: '50%',
        borderWidth: 1
    },
    text: {
        fontFamily: getFontFamily('Poppins', "600"),
        fontSize: fontScale(15),
        textAlign: 'center',
    },
})


export default Tabs