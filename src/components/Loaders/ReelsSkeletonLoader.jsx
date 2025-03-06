import { Dimensions, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { SkeletonCommonProps, SkeletonCommonPropsDark } from '../../data/dataConstants'
import { Skeleton } from 'moti/skeleton'
import { scaling } from '../../themes/themes'
import PropTypes from 'prop-types'

const { height, width } = Dimensions.get('window')
const { verticalScale, horizontalScale, fontScale } = scaling


const ReelsSkeletonLoader = ({loading, tabBarHeight}) => {
    const colorScheme = useColorScheme() === 'dark'
    const hashTags = ['music', 'sound', 'trending']
    
    const skeletonProps = colorScheme ? SkeletonCommonProps : SkeletonCommonPropsDark

  return (
    <View style={[{ flex: 1, marginBottom: tabBarHeight }]}>
        <Skeleton {...skeletonProps} width={width} height={height * 0.73} radius={20} show={loading} />
        <View style={[styles.followerInfoContainer, { backgroundColor: 'transparent' }]}>
            <View style={[styles.followerProfileContainer, { paddingVertical: horizontalScale(10) }]}>
                <View style={styles.hashTags}>
                    {hashTags.map((item, index) => (
                        <Skeleton {...skeletonProps} key={index} show={loading} width={horizontalScale(55)} height={horizontalScale(15)} radius={20} />
                    ))}
                </View>
                <View style={styles.profileRowA}>
                    <View style={[styles.profileStats]}>
                        <Skeleton {...skeletonProps} width={horizontalScale(35)} height={horizontalScale(35)} radius={'round'} />
                        <View style={{ gap: 5 }}>
                            <Skeleton {...skeletonProps} width={horizontalScale(60)} height={horizontalScale(15)} radius={10} />
                            <Skeleton {...skeletonProps} width={horizontalScale(30)} height={horizontalScale(15)} radius={10} />
                            <Skeleton {...skeletonProps} width={horizontalScale(100)} height={horizontalScale(15)} radius={10} />
                        </View>

                    </View>
                    <View style={[styles.extraAction]}>
                        <Skeleton {...skeletonProps} width={horizontalScale(50)} height={horizontalScale(16)} radius={10} />
                        <Skeleton {...skeletonProps} width={horizontalScale(8)} height={horizontalScale(20)} radius={10} />
                    </View>
                </View>

                <View style={styles.profileRowB}>
                    <Skeleton {...skeletonProps} width={width * 0.8} height={horizontalScale(15)} radius={10} />
                </View>

            </View>
        </View>
    </View>
  )
}

ReelsSkeletonLoader.propTypes = {
    loading: PropTypes.bool.isRequired,
    tabBarHeight: PropTypes.number.isRequired
}

export default ReelsSkeletonLoader

const styles = StyleSheet.create({
    followerInfoContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0, 0.2)',
        justifyContent: 'flex-end',
      },
      followerProfileContainer: {
        gap: 10,
        backgroundColor: 'rgba(0,0,0, 0.15)',
        paddingTop: verticalScale(10),
        borderTopRightRadius: horizontalScale(5),
        borderTopLeftRadius: horizontalScale(5)
      },
      profileRowA: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: horizontalScale(width*0.05),
      },
      profileRowB: {
        width: '95%',
        paddingHorizontal: horizontalScale(width*0.05),
      },
      extraAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
      },
      hashTags: {
        gap: 8,
        flexDirection: 'row',
        paddingHorizontal: horizontalScale(width*0.05),
      },
      profileStats: {
        flexDirection: 'row',
        flex: 0.9,
        overflow: 'hidden',
        gap: 15,
        alignItems: 'center',
      },
})