import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import FastImage from 'react-native-fast-image'
import { scaling } from '../../themes/themes'
import PropTypes from 'prop-types'
import Impressions from './Impressions'

const {horizontalScale, verticalScale, fontScale} = scaling
const {width} = Dimensions.get('window')


const GridItem = ({item, index, showMore, showImpression, impressionIcon, impressionCount, gridHeight=3}) => {
    const { theme } = useTheme()
    return (
        <Pressable onPress={showMore} underlayColor={theme.segmentedControl} style={[styles.postContainer, { height: width/gridHeight, marginBottom: horizontalScale(5), marginRight: (index + 1) % 3 === 0 ? 0 : horizontalScale(5) },]}>
            <FastImage source={{ uri: item.uploadedMedia[0].url }} style={StyleSheet.absoluteFill} priority={FastImage.priority.high} />
            {showImpression && <Impressions impressionCount={impressionCount} impressionIcon={impressionIcon}  />}
        </Pressable>
    );
}

GridItem.propTypes = {
    index: PropTypes.number.isRequired,
    gridHeight: PropTypes.number.isRequired,
    impressionCount: PropTypes.number,
    impressionIcon: PropTypes.string,
    item: PropTypes.object.isRequired,
    showImpression: PropTypes.bool.isRequired,
    showMore: PropTypes.func.isRequired
}

export default GridItem

const styles = StyleSheet.create({
    postContainer: {
        width: width/3,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      },
})