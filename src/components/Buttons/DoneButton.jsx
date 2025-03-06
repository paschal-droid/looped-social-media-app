import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { scaling, color, getFontFamily } from '../../themes/themes'
import Icon from '../Icon/Icon'
import { AnimatedCircularProgress } from 'react-native-circular-progress'


const {horizontalScale, verticalScale, fontScale} = scaling

const DoneButton = (props) => {

    return (
        <TouchableOpacity {...props} style={[styles.actionButton]}>
        <View style={[styles.actionContainer, {backgroundColor: color.smoke}]} >
            <AnimatedCircularProgress
                size={horizontalScale(70)}
                width={2}
                fill={100}
                tintColor={color.smoke}
                backgroundColor={color.white}
                style={styles.progressBar}
            />
            <Icon name='check' size={fontScale(20)} color={color.white} />
          </View>
      </TouchableOpacity>
    )
}

export default DoneButton

const styles = StyleSheet.create({
    actionButton: {
        width: horizontalScale(55),
        height: horizontalScale(55),
        borderRadius: horizontalScale(1000),
        marginBottom: verticalScale(30),
        marginRight: horizontalScale(30)
    },
    actionContainer: {
        width: '100%',
        height: '100%',
        borderRadius: verticalScale(1000),
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressBar: {
        position: 'absolute',
    }
})