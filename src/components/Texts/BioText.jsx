import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { color, getFontFamily, scaling } from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'

const {fontScale} = scaling

const BioText = ({text}) => {
    const atTagRegex = /@\w+/g
    const bioTextFilter = text.split(/(@\w+)/)
    const {theme} = useTheme()
  
  return (
    <Text style={[styles.bioText, { color: theme.paragraph }]}>{bioTextFilter.map((part, index) => {
        if (atTagRegex.test(part)) {
            return <Text style={styles.bold} key={index}>{part}</Text>
        }
        return part
    })}</Text>
  )
}

BioText.propTypes = {
    text: PropTypes.string.isRequired
}

export default BioText

const styles = StyleSheet.create({
    bioText: {
        fontFamily: getFontFamily('FuturaPT', '500'),
        fontSize: fontScale(19),
        lineHeight: fontScale(26),
    },
    bold: {
        fontFamily: getFontFamily('FuturaPT', '600'),
        color: color.primary
    },
})