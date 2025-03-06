import React, { useCallback, useEffect, useState } from 'react'
import { BackHandler, FlatList, StatusBar, StyleSheet, ToastAndroid, View, useColorScheme } from 'react-native'
import { useTheme } from '../../../context/ThemeContext'
import { globalStyles } from '../../../themes'

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { FeedImage, HomeHeader, NotificationOption, StoriesUpdateList } from '../../../components'
import { color, scaling } from '../../../themes/themes'
import { CommonActions, useFocusEffect } from '@react-navigation/native'
import { Routes } from '../../../navigation/Routes'

const {verticalScale, horizontalScale, fontScale} = scaling

const Home = ({navigation}) => {
  const {theme} = useTheme()
  const colorScheme = useColorScheme() === 'light'
  const tabBarHeight = useBottomTabBarHeight()
  const [loading, setLoading] = useState(true)
  const [postsFeed, setPostsFeed] = useState([])
  const {following} = useSelector(state => state.user)
  const {usersLoaded, feedPosts} = useSelector(state => state.users)
  const [lastPress, setLastPress] = useState(0);



  useEffect(() => {
    if(usersLoaded === following.length && following.length !== 0){      
      const sortedPosts = [...feedPosts].sort((x, y) => y.createdAt - x.createdAt);
      setPostsFeed(sortedPosts);
      setLoading(false)
    }
    // dispatch(reset())
  }, [usersLoaded, following, feedPosts])  


  // todo  Double-Press to exit pattern code
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        const timeNow = Date.now();
        // If user pressed back less than 2 seconds ago, exit app
        if (timeNow - lastPress < 2000) {
          BackHandler.exitApp();
          return true; // Prevent default behavior
        } else {
          // Otherwise, show a toast and update the lastPress timestamp
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
          setLastPress(timeNow);
          return true; // Prevent default behavior
        }
      };
      // Add the event listener when the screen is focused
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Remove the event listener when the screen is unfocused
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [lastPress])
  );



  return (
    <SafeAreaView style={[{ backgroundColor: theme.background}, globalStyles.appScreen]}>
      <StatusBar barStyle={colorScheme ? 'light-content' : 'dark-content'} backgroundColor={colorScheme ? color.smoke : theme.oppositeBackground} />
      
      {/* Push Notification Controls and Stories Section */}
      <HomeHeader>
        {/* Notification Type pick */}
        <NotificationOption
          icons={['notification-bing', 'sms-notification']}
          onSelect={() => {}}
        />
        {/* list of friends/followers List */}
        <StoriesUpdateList />
      </HomeHeader>

      {/* All things posts starts here */}
      <View style={[styles.homeContainer, {marginBottom: tabBarHeight}]}>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            data={loading ? Array(1).fill(null) : postsFeed}
            decelerationRate={'normal'}
            bounces={0}
            contentContainerStyle={{flexGrow: 1, gap: 10}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              if(!item) {
                <FeedImage item={null} loading={loading} />
              }
              return (
                <FeedImage item={item} loading={loading} />
              );
            }}
          />          
       </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  homeContainer: {
    paddingHorizontal: horizontalScale(10),
    paddingBottom: verticalScale(10),
    flex: 1
  },
})

export default Home
