import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, StatusBar, StyleSheet, View } from 'react-native'
import { useTheme } from '../../../context/ThemeContext'
import { globalStyles } from '../../../themes'

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useIsFocused } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { VideoReel } from '../../../components'

const {height, width} = Dimensions.get('window')


const Reels = ({navigation}) => {
  const tabBarHeight = useBottomTabBarHeight()
  const {theme} = useTheme()
  const isFocused = useIsFocused()
  const [loading, setLoading] = useState(true)
  const [currentIndex , setCurrentIndex] = useState(0)
  const {usersLoaded, feedHighlights} = useSelector(state => state.users)
  const {following} = useSelector(state => state.user)
  const videoRef = useRef(null)

  const [highlightsFeed, setHighlightsFeed] = useState([])

  useEffect(() => {
    if(usersLoaded === following.length && following.length !== 0){      
      const sortedVideos = [...feedHighlights].sort((x, y) => y.createdAt - x.createdAt);
      setHighlightsFeed(sortedVideos);
      setLoading(false)
    }

  }, [usersLoaded, feedHighlights])

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0)
    }
  })

  useEffect(() => {
    if (currentIndex < highlightsFeed.length - 1) {
      const nextIndex = currentIndex + 1
      if (videoRef.current[nextIndex]) {
        videoRef.current[nextIndex].current.seek(0)
      }
    }
  }, [currentIndex])

 
   
  return (
    <SafeAreaView style={[{ backgroundColor: theme.background}, globalStyles.appScreen]}>
      <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />
      <View style={{marginBottom: tabBarHeight}}>
        <FlatList
            vertical
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            showsVerticalScrollIndicator={false}
            data={loading ? Array(1).fill(null) : highlightsFeed}
            bounces={false}
            decelerationRate={0}
            snapToInterval={height - tabBarHeight}
            contentContainerStyle={{flexGrow: 1, }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              if(!item) {
                <VideoReel videoItem={null} loading={loading} />
              }
              return (
                <VideoReel videoItem={item} isFocused={isFocused} videoRef={videoRef}  paused={!isFocused || index !== currentIndex} loading={loading} />
              );
            }}
          />

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})

export default Reels