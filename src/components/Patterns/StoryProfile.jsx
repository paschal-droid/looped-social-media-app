import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { color, getFontFamily, scaling } from '../../themes/themes'
import FastImage from 'react-native-fast-image'
import PropTypes from 'prop-types'
import GradientSpinner from '../Loaders/StorySpinner'
import UpdateStorySpinner from '../Loaders/UpdateStorySpinner'


const {horizontalScale, verticalScale, fontScale} = scaling

import { Skeleton } from 'moti/skeleton'
import { SkeletonCommonProps } from '../../data/dataConstants'

const StoryProfile = ({hasBeenViewed, imageUri, viewStory, username='', imageWidth, transparentBG=false, loading=false, addUsername, viewProfile, noStory}) => {
  const {theme} = useTheme()
  const colorScheme = useColorScheme() === 'light'
  const [isPressed, setIsPressed] = useState(false);

  const appTheme = useColorScheme() === 'dark'

  



//   TODO  ADD ROLL ANIMATION WHEN THE USER CLICKS TO VIEW A STORY JUST LIKE INSTAGRAM


  const handlePress = () => {
    setIsPressed(true); // Trigger the spinning effect
    setTimeout(() => {
      setIsPressed(false); // Stop spinning after navigation
      viewStory() // Navigate to the story screen
    }, 800); // Keep spinning for 1.5 seconds before navigating
  };

  const handleLongPress = () => {
    setIsPressed(true); // Trigger the spinning effect
    setTimeout(() => {
      setIsPressed(false); // Stop spinning after navigation
      viewProfile() // Navigate to the story screen
    }, 400); // Keep spinning for 1.5 seconds before navigating
  };
 

  return (
    <TouchableOpacity
      style={styles.storyProfileContainer}
      onPress={handlePress} onLongPress={handleLongPress}>
      
      {imageUri.length > 0 ? (
        <View style={styles.gradientWrapper}>
          {/* Spinning Gradient */}
            {!noStory && (
              <>
                {isPressed ? (
                  <GradientSpinner
                    colors={
                      hasBeenViewed
                        ? ['#C7C7C7', '#D3D3D3']
                        : ['#C150F6', '#FF7F4E', '#EEA4CE']
                    }
                    size={imageWidth+10}
                    strokeWidth={4}
                  />
                ) : (
                  <UpdateStorySpinner width={imageWidth+3} hasBeenViewed={hasBeenViewed} />
                )}
              
              </>
            )}

          {/* User's Story Profile */}
          <View
            style={[
              styles.imageContainer,
              {backgroundColor: transparentBG ? theme.backgroundShade : colorScheme ? color.smoke : theme.oppositeBackground, width: horizontalScale(imageWidth), height: horizontalScale(imageWidth)},
            ]}>
              <FastImage
                priority={FastImage.priority.high}
                source={imageUri ? {uri: imageUri} : thumbnail}
                style={styles.userStoryImage}
                />
          </View>
        </View>

      ) : (
        <Skeleton {...SkeletonCommonProps} width={imageWidth+13} height={imageWidth+13} radius={'round'} show={true} />
      )}
      {/* Story User's Name */}
      
      {addUsername && <>
        {username.length > 0 ? (
          <Text numberOfLines={1} style={[styles.viewersText, {color: theme.background}]}>
          {username}
        </Text>
        ) : (
          <Skeleton {...SkeletonCommonProps} width={60} height={18} radius={8} show={loading}/>
        )}    
      </>
    }
    </TouchableOpacity>
  );
}

StoryProfile.propTypes = {
  hasBeenViewed: PropTypes.bool,
  viewStory: PropTypes.func,
  viewProfile: PropTypes.func,
  imageUri: PropTypes.string,
  username: PropTypes.string,
  imageWidth: PropTypes.number.isRequired,
  transparentBG: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  addUsername: PropTypes.bool.isRequired,
  noStory: PropTypes.bool.isRequired
}


const styles = StyleSheet.create({
  storyProfileContainer: {
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewersText: {
      fontFamily: getFontFamily('PlusJakartaSans', '600'),
      fontSize: fontScale(14),
      textTransform: 'lowercase',
    },
  gradientWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: horizontalScale(4),
    zIndex: -1
  },
  imageContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: horizontalScale(100),
    justifyContent: 'center',
    zIndex: 1,
  },
  userStoryImage: {
    aspectRatio: 1/1,
    width: '90%',
    borderRadius: horizontalScale(100)
  },
})


export default StoryProfile