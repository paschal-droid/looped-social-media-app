import React, { useEffect, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'

import Video from 'react-native-video'
import { useTheme } from '../../context/ThemeContext'
import { color, getFontFamily, scaling } from '../../themes/themes'

import { BlurView } from '@react-native-community/blur'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { AutoScrollingText, CustomModal, DynamicText, Icon, ReelsSkeletonLoader, StoryProfile } from '..'
import { dislikeVideo, likeVideo } from '../../api/user-functions'
import { formatLikesCount, formatPostTime, groupedStoriesByUserId } from '../../data/dataConstants'
import { Routes } from '../../navigation/Routes'
import { fetchHighlightComments } from '../../redux/reducers/Users'


const { verticalScale, horizontalScale, fontScale } = scaling
const {width, height} = Dimensions.get('window')


const VideoReel = ({ paused, videoItem, loading, videoRef, isFocused }) => {
  const { following } = useSelector(state => state.user)
  const { theme } = useTheme()
  const navigation = useNavigation()
  const [isMuted, setIsMuted] = useState(false)
  const [showVideoAction, setShowVideoAction] = useState(false)
  
  const tabBarHeight = useBottomTabBarHeight()
  const {storiesFeed} = useSelector(state => state.users)
  const [isStoryActive, setIsStoryActive] = useState(false)
  const [noStory, setNoStory] = useState(true)

  const [isBuffering, setIsBuffering] = useState(false);

  const handleBuffer = (meta) => {
    setIsBuffering(meta.isBuffering); // Show loader when buffering
  };

  //interactions
  const [openShareOption, setOpenShareOption] = useState(false)
  const [openExtraOption, setOpenExtraOption] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)

  // ! Animated video duration progress
  const videoDurationProgress = useSharedValue(0)

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: `${videoDurationProgress.value * 100}%`
  }))

  //! This is to control the rate at which the progress bar should get to 100% when each story is shown
  const autoVideoProgress = () => {
    videoDurationProgress.value = 0;
    videoDurationProgress.value = withTiming(1, { duration: videoDuration, easing: Easing.linear });
  };

  useEffect(() => {
    if(!loading) {
      if (!paused) {
        videoRef.current.seek(0)
        autoVideoProgress()
      }
    }
  }, [videoDuration, paused, loading])

  // ! ENDS HERE

  const toggleMute = () => {
    setShowVideoAction(true)
    setIsMuted((prev) => !prev)
    setTimeout(() => {
      setShowVideoAction(false)
    }, 3000)
  }

  const dispatch = useDispatch()
  const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {
      if(!loading) {
        if(following.indexOf(videoItem.authorId) > -1){
          setIsFollowing(true)
        } else {
          setIsFollowing(false)
        }
        dispatch(fetchHighlightComments(videoItem.id, videoItem.authorId))
      }

    }, [following, loading])
 

  const openComments = () => {
    navigation.push(Routes.Comment, {item: videoItem, type: 'highlight'})
  }

  const openShare = () => {
    setOpenShareOption(true)
  }

  const likeAction = (userId, videoId) => {
    if(videoItem.didUserLike){
      dislikeVideo(userId, videoId)
    } else {
      likeVideo(userId, videoId)
    }
  }

  useEffect(() => {
    if(following.length !== 0 && !loading) {
      if(storiesFeed.length > 0) {
        const groupedStories = groupedStoriesByUserId(storiesFeed)
        setIsStoryActive(
          groupedStories[videoItem.authorId]?.at(-1).hasBeenViewed
        )
      }
      setIsStoryActive(true)
      setNoStory(true)
    }
  }, [storiesFeed])

  return (
    <>
      {videoItem !== null ? (
        <View style={[styles.videoContainer, { height: height - tabBarHeight }]}>
          <Video
            source={{uri: videoItem.uploadedMedia[0].url}}
            style={[StyleSheet.absoluteFill]}
            muted={isMuted}
            ref={videoRef}
            repeat
            
            onBuffer={handleBuffer}
            onError={(error) => {if(__DEV__) console.error('Video Error ', error.error.errorCode)}}
            resizeMode={'cover'}
            paused={paused || isBuffering}
            onLoad={(meta) => {
              setVideoDuration(meta.duration * 1000);
              setIsBuffering(false)
            }}
            onEnd={autoVideoProgress}
          />

          {/* Video Mute and Unmute Modal */}
          {showVideoAction && <View style={styles.videoActionModal}>
            <Icon size={fontScale(30)} name={!isMuted ? 'volume-high' : 'volume-mute'} color={theme.textColor} />
          </View>}

          {/* Navigation to create a Video Reel Post */}
          <TouchableOpacity onPress={() => navigation.navigate(Routes.Create, {params: {screenIndex: 2}, screen: Routes.QuickPost})} style={styles.createReelContainer}>
            <Icon name='camera' size={fontScale(28)} color={color.white} />
          </TouchableOpacity>


          {/* Video Details and profile, actions here */}
          <View style={[styles.followerInfoContainer]}>

            <Pressable style={styles.videoPlayAction} onPress={toggleMute} />
            {/* Share, Comment and Like Section */}
            <View style={styles.followerActionsContainer}>
              <TouchableOpacity onPress={openShare} style={[styles.shareInteractionContainer]}>
                <Icon name='share-new' size={fontScale(20)} color={color.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={openComments} style={[styles.commentInteractionContainer]}>
                <Icon name='comment-sec' size={fontScale(20)} color={color.white} />
                <Text style={styles.interactionCountText}>{formatLikesCount(videoItem.commentCount)}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => likeAction(videoItem.uid, videoItem.id)} style={[styles.likeInteractionContainer, { backgroundColor: videoItem.didUserLike ? color.primary : 'rgba(255, 255, 255, 0.10)' }]}>
                {!videoItem.didUserLike && <BlurView blurAmount={5} overlayColor="" blurType="thinMaterialDark" style={StyleSheet.absoluteFill} />}
                <Icon name='heart-filled' size={fontScale(20)} color={color.white} />
                <Text style={styles.interactionCountText}>{formatLikesCount(videoItem.likes)}</Text>
              </TouchableOpacity>
            </View>

            {/* Video Profile Details */}
            <View style={[styles.followerProfileContainer]}>
              <View style={[styles.hashTags]}>
                {videoItem.hashtags.length > 0 && (
                  <>
                    {videoItem.hashtags.map((tag, i) => (
                      <LinearGradient colors={[color.whiteRGBA15, 'rgba(255, 255, 255, 0.15)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hashTag} key={i}>
                        <Text style={styles.hashTagText}>{tag}</Text>
                      </LinearGradient>
                    ))}
                  </>
                )}
              </View>
              <View style={styles.profileRowA}>
                <View style={[styles.profileStats]}>
                  <StoryProfile transparentBG={true} hasBeenViewed={isStoryActive} noStory={noStory} viewStory={()=> {}} viewProfile={() => navigation.navigate(Routes.Profile, {uid: videoItem.authorId})} imageUri={videoItem.profileImages[0]} imageWidth={35} />

                  <View style={styles.followerImageName}>
                    <Text style={[styles.followerName, { color: color.white }]}>{videoItem.firstName} {videoItem.lastName}</Text>
                    <Text style={styles.postDateText}>{formatPostTime(videoItem.createdAt.seconds)}</Text>
                    <AutoScrollingText text={'No sound was added to the video'} />
                  </View>

                </View>
                <View style={[styles.extraAction]}>
                  {isFollowing && (
                    <TouchableOpacity style={[styles.followAction]} onPress={() => { }}>
                      <Icon name='add-friend' color={color.white} size={fontScale(14)} />
                      <Text style={[styles.followActionText]}>Follow</Text>
                    </TouchableOpacity>
                  )}
                  <Icon onPress={() => setOpenExtraOption(true)} name='ellipsis' style={[styles.followingAction]} color={color.white} size={fontScale(28)} />
                </View>
              </View>

              <View style={styles.profileRowB}>
                <DynamicText
                  useDefaultTheme={false}
                  text={videoItem.caption}
                />
              </View>

              {/* story indicators */}
              <View style={styles.indicatorBG}>
                <Animated.View style={[styles.indicator, indicatorAnimatedStyle]} />
              </View>
            </View>

          </View>
          
          {openShareOption && <CustomModal openModal={setOpenShareOption}>
            <Text>Share</Text>
          </CustomModal>}
          {openExtraOption && <CustomModal openModal={setOpenExtraOption}>
            <Text>Extras</Text>
          </CustomModal>}
        </View>
    
      ) : (
        <ReelsSkeletonLoader loading={loading} tabBarHeight={tabBarHeight} />
      )}
    </>



  )
}

VideoReel.propTypes = {
  videoItem: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  paused: PropTypes.bool,
  isFocused: PropTypes.bool
}

export default VideoReel

const styles = StyleSheet.create({
  videoContainer: {},
  video: {
    width: '100%',
    height: '100%',
  },
  createReelContainer: {
    position: 'absolute',
    top: '2%',
    right: '3%',
    width: horizontalScale(55),
    height: horizontalScale(55),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  videoActionModal: {
    borderRadius: 1000,
    width: horizontalScale(60),
    height: horizontalScale(60),
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: color.whiteRGBA32,
    position: 'absolute',
    marginTop: horizontalScale(-30),
    marginLeft: horizontalScale(-30),
    top: '45%',
    left: '50%'
  },
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
  profileStats: {
    flexDirection: 'row',
    flex: 0.9,
    overflow: 'hidden',
    gap: 15,
    alignItems: 'center',
  },
  followerImageName: {},
  followerName: {
    fontFamily: getFontFamily('FuturaPT', '600'),
    fontSize: fontScale(20),
    textTransform: 'capitalize',
  },
  postDateText: {
    fontFamily: getFontFamily('FuturaPT', '500'),
    fontSize: fontScale(14),
    color: color.whiteRGBA75
  },
  followerInfoImageAction: {},
  followingAction: {
    width: horizontalScale(20),
    height: horizontalScale(40),
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  followActionContainer: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  followAction: {
    borderWidth: 1,
    borderColor: color.white,
    flexDirection: 'row',
    gap: 2,
    borderRadius: horizontalScale(10),
    paddingHorizontal: horizontalScale(6),
    paddingVertical: horizontalScale(4),
    alignItems: 'center',
    justifyContent: 'center'
  },
  followActionText: {
    color: color.white,
    fontFamily: getFontFamily('FuturaPT', '500'),
    fontSize: fontScale(16),
  },
  extraAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  followerActionsContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '40%',
    right: '3%',
    paddingVertical: verticalScale(5),
  },
  shareInteractionContainer: {
    width: horizontalScale(55),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: horizontalScale(35)
  },
  commentInteractionContainer: {
    gap: 4,
    width: horizontalScale(55),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: horizontalScale(24)
  },
  likeInteractionContainer: {
    gap: 4,
    alignItems: 'center',
    backgroundColor: color.primary,
    height: horizontalScale(80),
    width: horizontalScale(55),
    justifyContent: 'center',
    borderRadius: horizontalScale(28)
  },
  interactionCountText: {
    fontFamily: getFontFamily('PlusJakartaSans', '500'),
    fontSize: fontScale(14),
    color: color.white
  },
  indicator: {
    height: '100%',
    backgroundColor: color.white
},
indicatorBG: {
    height: verticalScale(2.5),
    overflow: 'hidden',
    borderRadius: horizontalScale(10),
    backgroundColor: color.indicator,
    marginTop: verticalScale(4)
    
},
  videoPlayAction: {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    // zIndex: -1
  },

  hashTags: {
    gap: 8,
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(width*0.05),
  },
  hashTag: {
    paddingHorizontal: horizontalScale(8),
    paddingVertical: horizontalScale(5),
    borderRadius: horizontalScale(20),
  },
  hashTagText: {
    fontFamily: getFontFamily('FuturaPT', '500'),
    fontSize: fontScale(14),
    color: color.white
  },

})