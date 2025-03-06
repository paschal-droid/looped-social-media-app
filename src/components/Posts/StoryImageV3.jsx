import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BackBtn, IconGradientBtn, KeyboardView, MiniProfile, StoryTimer, ViewStats } from '..';
import { formatStoryTime } from '../../data/dataConstants';
import { color, getFontFamily, scaling } from '../../themes/themes';

const { horizontalScale, verticalScale, fontScale } = scaling;

const StoryImageV3 = ({ singleUserStoriesList, goToNextUser, goToPrevUser, isActive, userProfile }) => {
  const navigation = useNavigation()
  const [storyIndex, setStoryIndex] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const currentStoryIndexRef = useRef(storyIndex);  

  // Reset state when story changes
  useEffect(() => {
    if(isActive){
      currentStoryIndexRef.current = storyIndex;
      setMediaLoaded(false);
      setStoryDurationCount(5);
      setStoryProgressCount(5000);
    }
  }, [storyIndex, isActive]);

  const [storyProgressCount, setStoryProgressCount] = useState(5000);
  const [storyDurationCount, setStoryDurationCount] = useState(5);
  const [paused, setPaused] = useState(false);
  const progress = useSharedValue(0);
  const pausedShared = useSharedValue(paused);

  // Start progress animation when media is loaded
  useEffect(() => {
    if (isActive && !paused && mediaLoaded) {
      progress.value = 0;
      progress.value = withTiming(
        1,
        { duration: storyProgressCount, easing: Easing.linear },
        (finished) => {
          if (finished) runOnJS(handleNextStory)();
        }
      );
    }
  }, [storyIndex, paused, isActive, mediaLoaded, storyProgressCount]);

  // Handle timer countdown
  useEffect(() => {
    if (storyDurationCount > 0 && !paused && mediaLoaded) {
      const timer = setTimeout(() => {
        setStoryDurationCount((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [storyDurationCount, paused, mediaLoaded]);

  
  // When the carousel item is no longer active, reset storyIndex to 0
  useEffect(() => {
    if (isActive) {
      setStoryIndex(0);
    }
  }, [isActive]);

// To control whether progress should be running
  useEffect(() => {
    pausedShared.value = paused;
  }, [paused]);


  // Other states and refs
  const replyText = useRef('');
  const inputRef = useRef(null);
  const currentStory = singleUserStoriesList[storyIndex];

  
  const handleNextStory = useCallback(() => {
    setStoryIndex(prevIndex => {
      if (prevIndex === singleUserStoriesList.length - 1) {
        goToNextUser();
        return 0;
      } else {
        return prevIndex + 1;
      }
    });
  }, [singleUserStoriesList, goToNextUser]);

  const goToPrevStory = () => {
    setStoryIndex(prevIndex => {
      if (prevIndex === 0) {
        goToPrevUser();
        return 0;
      }
      return prevIndex - 1;
    });
  };

  const goToNextStoryManual = () => {
    setStoryIndex(prevIndex => {
      if (prevIndex === singleUserStoriesList.length - 1) {
        goToNextUser();
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));


  return (
    <KeyboardView>
      <View style={styles.storiesContainer}>
        <Animated.View style={styles.storyIndicatorContainer}>
          <BackBtn onPress={() => navigation.goBack()} />
          {/* Story indicators */}
          <View style={styles.indicatorRow}>
            {singleUserStoriesList.map((_, index) => (
              <View key={index} style={styles.indicatorBG}>
                <Animated.View
                  style={[
                    styles.indicator,
                    index === storyIndex && indicatorAnimatedStyle,
                    index > storyIndex && { width: 0 },
                    index < storyIndex && { width: '100%' },
                  ]}
                />
              </View>
            ))}
          </View>
          <StoryTimer timer={formatStoryTime(storyDurationCount)} />
          <MiniProfile profileUri={userProfile} profileSize={40} showHighlight={true} />
        </Animated.View>

        <Pressable style={styles.storyImageContainer}>
            <FastImage
              source={{ uri: currentStory?.url }}
              onLoad={() => {
                if (currentStoryIndexRef.current === storyIndex) {
                  setMediaLoaded(true);
                }
              }}
              style={styles.storyImage}
            />
          <View style={styles.storyCountContainer}>
            <ViewStats viewCount="8.3k" />
          </View>
        </Pressable>

        <View style={styles.storyActionContainer}>
          <View style={styles.storyActionButtonContainer}>
            <IconGradientBtn icon="heart-filled" iconSize={30} onPress={() => {}} />
          </View>
        </View>

        <Pressable onPress={goToPrevStory} style={styles.navPressable} />
        <Pressable onPress={goToNextStoryManual} style={[styles.navPressable, { right: 0 }]} />
      </View>
    </KeyboardView>
  );
};

StoryImageV3.propTypes = {
  singleUserStoriesList: PropTypes.array.isRequired,
  goToNextUser: PropTypes.func,
  goToPrevUser: PropTypes.func,
  singleUserIndex: PropTypes.number, // You might not need this if using isActive only
  isActive: PropTypes.bool.isRequired,
  userProfile: PropTypes.string.isRequired
};

export default StoryImageV3;

const styles = StyleSheet.create({
  storiesContainer: {
    paddingBottom: verticalScale(12),
    backgroundColor: color.black,
    flex: 1,
    gap: 20,
    paddingHorizontal: horizontalScale(10),
    paddingTop: verticalScale(20),
  },
  storyIndicatorContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  storyImageContainer: {
    zIndex: -2,
    flex: 1,
    borderRadius: horizontalScale(20),
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyCountContainer: {
    position: 'absolute',
    left: horizontalScale(-4),
    top: verticalScale(0),
  },
  storyActionContainer: {
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    height: horizontalScale(52),
  },
  storyGradient: {
    borderRadius: horizontalScale(25),
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    fontSize: fontScale(14),
    fontFamily: getFontFamily('PlusJakartaSans', '400'),
    lineHeight: fontScale(26),
    letterSpacing: 0.28,
    flex: 1,
    marginLeft: horizontalScale(15),
  },
  storyActionButtonContainer: {
    gap: 5,
    flexDirection: 'row',
  },
  navPressable: {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: '20%',
    height: '100%',
    zIndex: -1,
  },
  indicator: {
    height: '100%',
    backgroundColor: color.white,
  },
  indicatorRow: {
    flexDirection: 'row',
    flex: 1,
    bottom: 0,
    gap: 10,
  },
  indicatorBG: {
    flex: 1,
    height: verticalScale(3),
    overflow: 'hidden',
    borderRadius: horizontalScale(10),
    backgroundColor: color.indicator,
  },
});


