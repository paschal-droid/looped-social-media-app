import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import PropTypes from 'prop-types'
import { getFontFamily, scaling } from '../../themes/themes'
import GradientText from './GradientText'

const {horizontalScale, verticalScale, fontScale} = scaling


const ProfileTabLabel = ({text, isFocused}) => {
    const {theme} = useTheme()

  return (
    <View>
        {isFocused ? (
            <GradientText text={`${text.split(' ')[0]}  ${text.split(' ')[1]}`} outsideStyles={styles.focusedTabText} gradientColors={['#FF7F4E', '#C150F6']} />
        ) : (
            <Text numberOfLines={1} style={[styles.tabText, {color: theme.header}]}><Text>{text.split(' ')[0]}</Text> {text.split(' ')[1]}</Text>
        )}
    </View>
  )
}

ProfileTabLabel.propTypes = {
    text: PropTypes.string.isRequired,
    isFocused: PropTypes.bool.isRequired
    
}

export default ProfileTabLabel

const styles = StyleSheet.create({
    focusedTabText: {
        fontFamily: getFontFamily('PlusJakartaSans', '700'),
        fontSize: fontScale(13),
    },
    tabText: {
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        fontSize: fontScale(16),
       
    },
})