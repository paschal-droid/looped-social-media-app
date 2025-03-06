import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import PropTypes from 'prop-types'
import { getFontFamily, scaling } from '../../themes/themes'

const {horizontalScale, verticalScale, fontScale} = scaling


const ProfileStats = ({mainText, countText, drawLine=false, viewMore}) => {
    const {theme} = useTheme()

  return (
    <TouchableOpacity onPress={viewMore}>
        <View style={[styles.statsContainer]}>
            <Text style={[styles.statAText, { color: theme.header }]}>{countText}</Text>
            <Text style={[styles.statBText, { color: theme.subText }]}>{mainText}</Text>
            {drawLine && <View style={[styles.line, {backgroundColor: theme.header}]} />}
        </View>
    </TouchableOpacity>
  )
}

ProfileStats.propTypes = {
    mainText: PropTypes.string.isRequired,
    countText: PropTypes.string.isRequired,
    drawLine: PropTypes.bool,
    viewMore: PropTypes.func.isRequired
}

export default ProfileStats

const styles = StyleSheet.create({
    statsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statAText: {
        fontFamily: getFontFamily('PlusJakartaSans', '700'),
        fontSize: fontScale(20),
    },
    statBText: {
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        fontSize: fontScale(16),
        textTransform: 'capitalize',
    },
    line: {
        height: horizontalScale(35),
        width: horizontalScale(0.5),
        position: 'absolute',
        right: '-50%'
    },
})