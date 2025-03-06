import { StyleSheet, Text, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import PropTypes from 'prop-types'
import { color, getFontFamily, scaling } from '../../themes/themes'

const {horizontalScale, verticalScale, fontScale} = scaling


const DynamicTextDetails = ({text, useDefaultTheme}) => {
    const [viewMore, setViewMore] = useState(false)
    const {theme} = useTheme()
    const colorScheme = useColorScheme() == 'dark'

  return (
    <>
        {viewMore ? (
            <TouchableWithoutFeedback onPress={() => setViewMore(prev => !prev)}>
                <View style={styles.dynamicTextContainer}>
                    <Text style={[styles.descriptionText,{ color: useDefaultTheme ? colorScheme ? color.whiteRGBA75 : color.blackRGBA60 : color.white}]}>{text}</Text>
                </View>
            </TouchableWithoutFeedback>
        ) : (
            <TouchableWithoutFeedback onPress={() => setViewMore(prev => !prev)}>
                <View style={styles.dynamicTextContainer}>
                    <Text numberOfLines={1} style={[styles.descriptionText, { color: useDefaultTheme ? colorScheme ? color.whiteRGBA75 : color.blackRGBA60 : color.white}]}>{text}</Text>
                </View>
            </TouchableWithoutFeedback>
        )}
    </>
  )
}

DynamicTextDetails.propTypes = {
    text: PropTypes.string.isRequired,
    useDefaultTheme: PropTypes.bool.isRequired
}

export default DynamicTextDetails

const styles = StyleSheet.create({
    descriptionText: {
        fontFamily: getFontFamily('FuturaPT', '500'),
        fontSize: fontScale(19),
        lineHeight: fontScale(26),
        
    },
    dynamicTextContainer: {
        paddingVertical: verticalScale(5),
    },
})