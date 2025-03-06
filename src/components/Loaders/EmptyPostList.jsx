import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scaling, getFontFamily } from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'
import PropTypes from 'prop-types'
import Icon from '../Icon/Icon'


const {verticalScale, horizontalScale, fontScale} = scaling

const EmptyPostList = (props) => {
    const {theme} = useTheme();
  return (
    <View style={styles.emptyPostContainer}>
        <Icon name={props.icon} size={fontScale(100)} color={theme.header}  />
        <Text style={[styles.emptyPostContainerText, {color: theme.header}]}>No {props.type} Yet</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  emptyPostContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 5,
  },
  emptyPostContainerText: {
    fontSize: fontScale(20),
    fontFamily: getFontFamily('PlusJakartaSans', '700'),
  },
});

EmptyPostList.propTypes = {
    icon: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
}


export default EmptyPostList
