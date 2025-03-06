import { StyleSheet, Text, View} from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'
import { getFontFamily, scaling } from '../../themes/themes'


const {verticalScale, horizontalScale, fontScale} = scaling

const HeaderText = (props) => {
  const {theme} = useTheme()

  return (
    <View style={styles.header}>
      <Text style={[styles.headerText, {color: theme.header}]}>{props.first}{'\n'}{props.second}</Text>
      <Text style={[styles.subText, {color: theme.header}]}>{props.subTextfirst}{'\n'}{props.subTextsecond}</Text>
    </View>

  )
}

HeaderText.propTypes = {
    first: PropTypes.string.isRequired,
    subTextfirst: PropTypes.string,
    second: PropTypes.string.isRequired,
    subTextsecond: PropTypes.string,
}

const styles = StyleSheet.create({
  header: {
    marginTop: verticalScale(30),
    gap: 8
  },
  headerText: {
    fontFamily: getFontFamily('Poppins', '700'),
    fontSize: fontScale(28),
    lineHeight: fontScale(37),
    textTransform: 'capitalize'
  },
  subText: {
    fontFamily: getFontFamily('PlusJakartaSans', '500'),
    fontSize: fontScale(16),
  },
})

export default HeaderText
