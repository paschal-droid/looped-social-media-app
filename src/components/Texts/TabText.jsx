import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'
import { getFontFamily, scaling } from '../../themes/themes'

const { fontScale } = scaling

const TabTitle = (props) => {
    const {theme} = useTheme()
  return (  
      <Text style={[styles.tabTitle, {color: theme.textColor}, !props.isFocused && styles.tabTitleNotFocused]}>{props.tabText}</Text>
  )
}

TabTitle.propTypes = {
    tabText: PropTypes.string.isRequired,
    isFocused: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
    tabTitle: {
        fontFamily: getFontFamily('PlusJakartaSans', '800'),
        fontSize: fontScale(12),
        textAlign: 'center',
    },
    tabTitleNotFocused: {
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        fontSize: fontScale(12),
        textAlign: 'center'
    }
})

export default TabTitle
