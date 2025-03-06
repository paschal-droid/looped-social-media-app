import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { scaling, getFontFamily, color } from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'
import PropTypes from 'prop-types'
import { Routes } from '../../navigation/Routes'
import { useNavigation } from '@react-navigation/native'

const {verticalScale, horizontalScale, fontScale} = scaling

const ActiveCallBanner = ({callId}) => {
    const {theme} = useTheme()
    const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => navigation.navigate(Routes.Chat, {screen: Routes.ActiveCall})}>
        <View style={[styles.bannerContainer, {backgroundColor: theme.success}]}>
            <Text style={[styles.bannerText]}>Click to return to call: {callId?.slice(0, 17)}</Text>
        </View>
    </TouchableOpacity>
  )
}

ActiveCallBanner.propTypes = {
    callId: PropTypes.string.isRequired
}

export default ActiveCallBanner

const styles = StyleSheet.create({
    bannerContainer: {
        alignItems: 'center',
        paddingVertical: verticalScale(2.5)
    },
    bannerText: {
        color: color.white,
        fontFamily: getFontFamily('FuturaPT', '600'),
        fontSize: fontScale(16)
    },
})