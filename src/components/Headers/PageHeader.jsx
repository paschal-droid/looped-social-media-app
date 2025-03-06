import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavPressable } from '..'
import { useNavigation } from '@react-navigation/native'
import { getFontFamily, scaling } from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'
import PropTypes from 'prop-types'

const {horizontalScale, verticalScale, fontScale} = scaling


const PageHeader = ({headerText}) => {
  const navigation = useNavigation()
  const {theme} = useTheme()
  return (
    <View style={[styles.header]}>
      <NavPressable icon={'arrow-left'} adjustSize={true} adjustedSize={30} onPress={() => navigation.goBack()} />
      <Text style={[styles.headerText, {color: theme.header}]}>{headerText}</Text>
      <View style={{flex: 0.2}} />
  </View>
  )
}

PageHeader.propTypes = {
  headerText: PropTypes.string,
 
}

export default PageHeader

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    fontFamily: getFontFamily('PlusJakartaSans', '700'),
    fontSize: fontScale(24),
  }
})