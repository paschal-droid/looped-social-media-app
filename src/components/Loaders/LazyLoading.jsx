import { StyleSheet, View, ActivityIndicator } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { color } from '../../themes/themes'

const LazyLoading = (props) => {

  
  return (
    <View  style={[styles.loadingContainer]}>
      <ActivityIndicator style={styles.loader} size={"large"} color={color.primary} />
    </View>
  )
}

LazyLoading.propTypes = {
  defaultBg: PropTypes.bool
}

const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    loader: {
      zIndex: 1001,
    }
})


export default LazyLoading