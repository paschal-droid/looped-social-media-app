import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { EmptyPostList, Icon, LazyLoader } from '..'
import { groupedStoriesByUserId } from '../../data/dataConstants'
import { Routes } from '../../navigation/Routes'
import { getFontFamily, scaling } from '../../themes/themes'
import StoryProfile from '../Patterns/StoryProfile'
import StoryProfileHeader from './StoryProfileHeader'
import { useTheme } from '../../context/ThemeContext'

const {horizontalScale, verticalScale, fontScale} = scaling


const StoriesUpdateList = ({}) => {
  const navigation = useNavigation()
  const {theme} = useTheme()
 
  const {following} = useSelector(state => state.user)
  const { storiesFeed} = useSelector(state => state.users)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
      if(following.length !== 0){     
        const sortedStories = [...storiesFeed].sort((x, y) => y.createdAt - x.createdAt); 
        setStories(groupedStoriesByUserId(sortedStories))
        setLoading(false)
      }

  }, [storiesFeed, following])

  
  const NoStoryToShow = () => {
    return (
      <View style={styles.emptyPostContainer}>
        <Icon name={'loader-2'} size={fontScale(50)} color={theme.background}  />
        <Text style={[styles.emptyPostContainerText, {color: theme.background}]}>No Stories To Show</Text>
      </View>
    )
  }

  return (
    <View style={styles.storiesContainer}>
        <FlatList
          horizontal
          viewabilityConfig={{itemVisiblePercentThreshold: 50}}
          ListHeaderComponent={<StoryProfileHeader />}
          data={loading ? Array(2).fill(null) : Object.keys(stories)}
          ListEmptyComponent={<NoStoryToShow />}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          decelerationRate={'normal'}
          contentContainerStyle={{flexGrow: 1, gap: 12, paddingLeft: horizontalScale(5)}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            if(!item) {
              return <StoryProfile addUsername={true} imageUri={''} noStory={true} loading={loading} imageWidth={65} username=''  />
            }
            return (
              // <Text>sorit</Text>
              <StoryProfile addUsername={true} loading={loading} noStory={false} hasBeenViewed={stories[item].at(-1).hasBeenViewed} imageWidth={65} imageUri={stories[item][0].profileImages[0]} username={stories[item][0].username} viewStory={() => navigation.push(Routes.Stories, {followerId: Object.keys(stories)[index]})} />
            )
          }}
        />
    </View>
  )
}

const styles = StyleSheet.create({ 
    storiesContainer: {
        paddingBottom: verticalScale(8),
    },
    emptyPostContainer: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        flex: 0.7,
        gap: 5,
      },
      emptyPostContainerText: {
        fontSize: fontScale(20),
        fontFamily: getFontFamily('PlusJakartaSans', '700'),
      },
 })

export default StoriesUpdateList
