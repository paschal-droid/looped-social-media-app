import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { scaling, color } from '../../themes/themes'
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import Icon from '../Icon/Icon'


const {horizontalScale, verticalScale, fontScale} = scaling

const NextButton = (props) => {

    return (
      <TouchableOpacity {...props} style={[styles.actionButton]}>
        <View style={[styles.actionContainer, {backgroundColor: color.smoke}]} >
            <AnimatedCircularProgress
                size={horizontalScale(70)}
                width={2}
                fill={props.progress}
                tintColor={color.smoke}
                backgroundColor={color.white}
                style={styles.progressBar}
            />
            <Icon name='arrow-right' size={fontScale(24)} color={color.white} />
          </View>
      </TouchableOpacity>
    )
}



export default NextButton

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