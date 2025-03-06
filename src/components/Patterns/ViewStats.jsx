import PropTypes from 'prop-types'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { color, getFontFamily, scaling } from '../../themes/themes'
import Icon from '../Icon/Icon'
import { BlurView } from '@react-native-community/blur'


const { horizontalScale, verticalScale, fontScale } = scaling

const ViewStats = ({viewCount}) => {

    return (
        <View style={styles.viewCountContainer}>
        <BlurView overlayColor="" blurAmount={20} blurType="thinMaterialDark" style={styles.blurViewStyles} />
            <Icon name='eye' size={fontScale(20)} color={color.white} />
            <Text style={[styles.viewCountText]}>{viewCount}</Text>
        </View>
    )
}

ViewStats.propTypes = {
    viewCount: PropTypes.string.isRequired,
}

export default ViewStats

const styles = StyleSheet.create({
    viewCountContainer: {
        borderRadius: horizontalScale(15),
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'center',
        overflow: 'hidden',
        paddingHorizontal: horizontalScale(12),
        paddingVertical: horizontalScale(8)
    },
    viewCountText: {
        color: color.white,
        fontSize: fontScale(14),
        fontFamily: getFontFamily('Poppins', '700'),
        textTransform: 'uppercase',
    },
    blurViewStyles: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        borderRadius: 1000
      }
})