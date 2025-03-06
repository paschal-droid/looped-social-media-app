import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon/Icon'
import { useTheme } from '../../context/ThemeContext'
import { scaling, getFontFamily, color } from '../../themes/themes'

const {horizontalScale, verticalScale, fontScale} = scaling


const Impressions = (props) => {
    const {theme} = useTheme()

  return (
    <View style={[styles.impressions]}>
        <Icon name={props.impressionIcon} size={fontScale(18)} color={theme.chatBubbleText} />
        <Text style={[styles.impressionCount, {color: theme.chatBubbleText}]}>{props.impressionCount}</Text>
    </View>
  )
}

Impressions.propTypes = {
    impressionIcon: PropTypes.string.isRequired,
    impressionCount: PropTypes.number.isRequired
}

const styles = StyleSheet.create({
    impressions: {
        width: horizontalScale(70),
        height: horizontalScale(30),
        borderRadius: 1000,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'absolute',
        gap: 5,
        bottom: horizontalScale(12)
    },
    impressionCount: {
        fontFamily: getFontFamily('FuturaPT', '500'),
        fontSize: fontScale(14),
        color: color.black
    }
})

export default Impressions
