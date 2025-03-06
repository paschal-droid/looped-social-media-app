import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'
import { getFontFamily, scaling } from '../../themes/themes'
import LinearGradient from 'react-native-linear-gradient'

const { fontScale, horizontalScale, verticalScale } = scaling

const TopTabTitle = (props) => {
    const {theme} = useTheme()
  return ( 
    <View style={styles.topTabContainer}>
        <Text numberOfLines={1} style={[styles.tabTitle, {color: theme.textColor}, !props.isFocused && styles.tabTitleNotFocused]}>{props.tabText}</Text>
        {props.isFocused &&  <LinearGradient  
            style={[styles.topTabFocusedIndicator, {backgroundColor: theme.textColor}]}
              useAngle={true}
              angle={274}
              locations={[-0.84, 1.42]}
              colors={[theme.gradientClr1, theme.primaryColor]}
        />}
    </View>
  )
}

TopTabTitle.propTypes = {
    tabText: PropTypes.string.isRequired,
    isFocused: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
    tabTitle: {
        fontFamily: getFontFamily('FuturaPT', '600'),
        fontSize: fontScale(16),
    },
    topTabFocusedIndicator: {
        width: horizontalScale(20),
        height: verticalScale(2),
        alignSelf: 'center',
        marginTop: verticalScale(5)
    },
    topTabContainer: {
        width: '100%',
        marginHorizontal: horizontalScale(5),
        alignItems: 'center'
    }

})

export default TopTabTitle
