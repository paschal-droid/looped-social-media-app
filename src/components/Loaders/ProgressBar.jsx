import { Dimensions, StyleSheet, View } from 'react-native'
import React from 'react'
import { Svg, Rect } from 'react-native-svg'
import PropTypes from 'prop-types'
import { scaling } from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'

const {horizontalScale, verticalScale} = scaling

const ProgressBar = (props) => {
    const {theme} = useTheme()
    const progressWidth = `${(props.progress / 100) * 100}%`
  return (
    <View>
      <Svg width={'100%'} height={horizontalScale(5)}>
        <Rect width={'100%'} height={'100%'} fill={theme.segmentedControl} rx={3.5} ry={3.5} />
        <Rect width={progressWidth} height={'100%'} fill={theme.primaryColor} rx={3.5} ry={3.5} />
      </Svg>
    </View>
  )
}

ProgressBar.propTypes = {
    progress: PropTypes.number.isRequired
}

export default ProgressBar

const styles = StyleSheet.create({

})