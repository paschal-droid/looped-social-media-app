import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'


import { color, scaling, getFontFamily } from '../../themes/themes';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../Icon/Icon';

const {horizontalScale, verticalScale, fontScale} = scaling


const Setting = ({icon, title, extraIcon='', onPress, toggleSwitch, isSwitched}) => {
    const {theme} = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
        <View style={styles.settingContainer}>
            <View style={[styles.settingGroupA]}>
                <Icon name={icon} color={theme.icon} size={fontScale(25)}  />
                <Text style={[styles.settingTitle, {color: theme.header}]}>{title}</Text>
            </View>
            <View style={[styles.settingGroupB]}>
                {extraIcon != '' ? (
                    <Icon name={extraIcon} color={theme.icon} size={fontScale(22)} />
                ) : (
                    <View style={{transform: [{ scale: 1.2 }] }}>
                        <Switch
                            trackColor={{ false: theme.input, true: color.primary }}
                            thumbColor={theme.oppositeBackground}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isSwitched}
                        />
                    </View>
                )}
            </View>
        </View>
    </TouchableOpacity>
  )
}

Setting.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    extraIcon: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    isSwitched: PropTypes.bool,
    toggleSwitch: PropTypes.func

}

export default Setting

const styles = StyleSheet.create({
    settingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    settingGroupA: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'flex-end'
    },
    settingTitle: {
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        fontSize: fontScale(16),
        lineHeight: fontScale(24),
        textTransform: 'capitalize',
    },
    settingGroupB: {},
})