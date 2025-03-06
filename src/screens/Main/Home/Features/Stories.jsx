import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, StatusBar, StyleSheet } from 'react-native'
import { useTheme } from '../../../../context/ThemeContext'
import { globalStyles } from '../../../../themes'

import { SafeAreaView } from 'react-native-safe-area-context'
import { StoryImageV3 } from '../../../../components'
import { color, scaling } from '../../../../themes/themes'

import { Extrapolation, interpolate } from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'
import { useDispatch, useSelector } from 'react-redux'
import { groupedStoriesByUserId } from '../../../../data/dataConstants'
import { updateStoryViewed } from '../../../../redux/reducers/Users'
import { withAnchorPoint } from '../../../../utils/anchor-point'


const {height, width} = Dimensions.get('window')

const Stories = ({navigation, route}) => {
  const {theme} = useTheme()
  const {following} = useSelector(state => state.user)
  const {storiesFeed, usersLoaded} = useSelector(state => state.users)
  const [stories, setStories] = useState([])
  const dispatch = useDispatch()


  // * Destructuring the Story data from database to match the logic here

  useEffect(() => {
      if(usersLoaded === following.length && following.length !== 0){      
        const sortedPosts = [...storiesFeed].sort((x, y) => y.createdAt - x.createdAt);
        setStories(groupedStoriesByUserId(sortedPosts));
      }
        // dispatch(reset())
  }, [usersLoaded, storiesFeed])  
  

  const [userIndex, setUserIndex] = useState(0)
  const carouselRef = useRef(null)
  
  const goToPrevUser = () => {
    carouselRef.current.prev()
  }
  const goToNextUser = () => {
    carouselRef.current?.next()
  }

  const handleUserStoryChange = (currentIndex) => {
    if (currentIndex !== undefined) {
      dispatch(updateStoryViewed({uid: Object.keys(stories)[userIndex]}))
      setUserIndex(currentIndex);
    }
  }

  // todo  THIS IS THE CUBE LIKE 3D STORY ANIMATION FOR THE TRANSITION BETWEEN USERS
  const animationStyle = useCallback(
    (value) => {
        "worklet";
        const zIndex = interpolate(value, [-1, 0, 1], [-1000, 0, -1000]);

        const translateX = interpolate(
            value,
            [-1, 0, 1],
            [-width, 0, width],
            Extrapolation.CLAMP
        );

        const scale = interpolate(
            value,
            [-1, 0, 1],
            [0.49, 1, 0.49],
            Extrapolation.CLAMP
        );

        const perspective = interpolate(
            value,
            [-1, 0, 1],
            [width * 0.89, width * 1.5, width * 0.89],
            Extrapolation.CLAMP
        );

        const rotateY = `${interpolate(
            value,
            [-1, 0, 1],
            [-90, 0, 90],
            Extrapolation.CLAMP
        )}deg`;

        const transform = {
            transform: [{ scale }, { translateX }, { perspective }, { rotateY }],
        };

        return {
            ...withAnchorPoint(
                transform,
                { x: 0.5, y: 0.5 },
                { width: width, height: height }
            ),
            zIndex,
        };
    },
    [height, width]
);

  return (
    <SafeAreaView style={[{ backgroundColor: color.darkbackground}, globalStyles.appScreen]}>
      <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />
      <Carousel
        width={width}
        height={height}
        data={Object.keys(stories)}
        pagingEnabled
        snapEnabled={false}
        customAnimation={animationStyle}
        ref={carouselRef}
        onScrollEnd={(currentIndex) => handleUserStoryChange(currentIndex)}
        renderItem={({item, index}) => {          
          return <StoryImageV3
            key={index.toString()}
            goToNextUser={goToNextUser} 
            goToPrevUser={goToPrevUser} 
            isActive={index === userIndex}
            userProfile={stories[item][0].profileImages[0]}
            userId={Object.keys(stories)[userIndex]}
            singleUserStoriesList={stories[item].flatMap(item => item.uploadedMedia)} />
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})

Stories.propTypes = {

}

export default Stories