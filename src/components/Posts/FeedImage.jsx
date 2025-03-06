import { Dimensions, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon/Icon'
import { useTheme } from '../../context/ThemeContext'
import { color, scaling, getFontFamily } from '../../themes/themes'
import { useDispatch, useSelector } from 'react-redux'
import FastImage from 'react-native-fast-image'
import Swiper from 'react-native-swiper'

import StoryProfile from '../Patterns/StoryProfile'
import { useNavigation } from '@react-navigation/native'
import { Routes } from '../../navigation/Routes'
import { CustomModal, DynamicText } from '..'
import { Skeleton } from 'moti/skeleton'
import { formatLikesCount, formatPostTime, groupedStoriesByUserId, SkeletonCommonProps } from '../../data/dataConstants'
import { fetchPostComments } from '../../redux/reducers/Users'
import { dislikePost, likePost } from '../../api/user-functions'
import { BlurView } from '@react-native-community/blur'

const {verticalScale, horizontalScale, fontScale} = scaling
const {width} = Dimensions.get('window')


const FeedImage = ({item, loading}) => {
  const {currentUser, following} = useSelector(state => state.user)
  const {theme} = useTheme()
  const colorScheme = useColorScheme() === 'dark'
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const {storiesFeed} = useSelector(state => state.users)
  const [isStoryActive, setIsStoryActive] = useState(false)
  const [noStory, setNoStory] = useState(true)



  const [openCommentModal, setOpenCommentModal] = useState(false)
  const [openShareModal, setOpenShareModal] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  

  useEffect(() => {
    if(!loading) {
        if(following.indexOf(item.uid) > -1){
            setIsFollowing(true)
        } else {
            setIsFollowing(false)
        }
        dispatch(fetchPostComments(item.id, item.authorId))
    }

  }, [following, loading])

    useEffect(() => {
        if(following.length !== 0 && !loading) {
        if(storiesFeed.length > 0) {
            const groupedStories = groupedStoriesByUserId(storiesFeed)
            setIsStoryActive(
            groupedStories[item.authorId]?.at(-1).hasBeenViewed
            )
        }
        setIsStoryActive(true)
        setNoStory(true)
        }
    }, [storiesFeed])
  

  const openComments = () => {
    navigation.push(Routes.Comment, {item, type: 'post'})
  }

  const openShare = () => {
    setOpenShareModal(true)
  }

  const likeAction = async (userId, postId) => {
    if(item.didUserLike){
      dislikePost(userId, postId)
    } else {
      likePost(userId, postId)
    } 
    }
  
  return (
    <View style={styles.feedContainer}>
        {item != null ? (
            <View style={[styles.feedImageContainer]}>
            <View style={[styles.imageSwiper]}>
    
                <Swiper showsButtons={false} pagingEnabled showsPagination paginationStyle={styles.imageCarouselControlContainer} dotStyle={styles.stroke} activeDotColor={color.white} dotColor={color.whiteRGBA50} activeDotStyle={styles.selectedStroke}>
                    {item.uploadedMedia.map((item, index) => (
                        <FastImage
                            priority={FastImage.priority.high}
                            key={index.toString()}
                            style={[styles.background]}
                            // resizeMode={FastImage.resizeMode.cover}
                            source={{uri: item.url}}
                        />
                    ))}
                </Swiper>
            </View>
            {/* Post user profile Info */}
            <View style={[styles.followerInfoContainer]}>
                <View style={[styles.followerInfoImageContainer]}>
                    <View style={styles.followerInfoImage}>
                            <StoryProfile noStory={noStory} viewProfile={() => navigation.navigate(Routes.Profile, {uid: item.authorId})} addUsername={false} loading={false} transparentBG={true} hasBeenViewed={isStoryActive} viewStory={() => {}} imageUri={item.profileImages[0]} imageWidth={50} />
                            <View style={styles.followerImageName}>
                            <Text style={[styles.followerName, {color: color.white}]}>{item.firstName} {item.lastName}</Text>
                            <Text style={[styles.followerPostDate, {color: color.whiteRGBA90}]}>{formatPostTime(item.createdAt.seconds)}</Text>
                        </View>
                    </View>
                    <View style={styles.followerInfoImageAction}>
                        {isFollowing ? (
                            <Icon name='ellipsis' style={[styles.followingAction]} color={color.white} size={fontScale(28)} />
                        ) : (
                            <View style={styles.followActionContainer}>
                                <TouchableOpacity style={[styles.followAction]} onPress={() => { }}>
                                    <Text style={[styles.followActionText]}>Follow</Text>
                                </TouchableOpacity>
                                <Icon name='ellipsis' style={[styles.followingAction]} color={color.white} size={fontScale(30)} />
                            </View>
                        )}
                    </View>
    
    
                </View>
                {/* Share, Comment and Like Section */}
                <View style={styles.followerActionsContainer}>
                    <TouchableOpacity onPress={openShare} style={[styles.shareInteractionContainer]}>
                        <Icon name='share-new' size={fontScale(20)} color={color.white} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openComments} style={[styles.commentInteractionContainer]}>
                        <Icon name='comment-sec' size={fontScale(20)} color={color.white} />
                        <Text style={styles.interactionCountText}>{formatLikesCount(item.commentCount)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => likeAction(item.uid, item.id)} style={[styles.likeInteractionContainer, {backgroundColor: item.didUserLike ? color.primary : 'rgba(255, 255, 255, 0.10)'}]}>
                        {!item.didUserLike && <BlurView blurAmount={10} overlayColor="" blurType="thinMaterialDark" style={StyleSheet.absoluteFill} />}
                        <Icon name='heart-filled' size={fontScale(20)} color={color.white} />
                        <Text style={styles.interactionCountText}>{formatLikesCount(item.likes)}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        ) : (
            <View style={{alignSelf: 'center'}}>
                <Skeleton show={loading} {...SkeletonCommonProps} width={width*0.9} radius={horizontalScale(40)} height={horizontalScale(400)} />
            </View>
        )}
    
        <View style={[styles.feedContent]}>
            {item !== null ? (
                <DynamicText text={item.caption} useDefaultTheme={true} />

            ) : (
                <Skeleton show={loading} {...SkeletonCommonProps} width={width*0.7} radius={horizontalScale(40)} height={horizontalScale(20)} />

            )}
        </View> 

    {/* Writing A Comment Section */}
    {!openCommentModal && (
        <View style={[styles.commentSection, ]}>
            {item != null ? (
                <TouchableOpacity onPress={openComments} style={[styles.commentProfile]}>
                    <FastImage
                        priority={FastImage.priority.high}
                        style={[styles.commentProfileImage]}
                        source={{uri:  currentUser?.profileImages[0]}}
                    />
                    <Text style={[styles.inputText, {color: colorScheme ? color.whiteRGBA50 : color.blackRGBA50}]}>Add a comment...</Text>
                </TouchableOpacity>

            ) : (
                <View style={styles.commentProfile}>
                    <Skeleton {...SkeletonCommonProps} show={loading} radius={'round'} width={horizontalScale(27)} height={horizontalScale(27)}  />
                    <Skeleton {...SkeletonCommonProps} show={loading} radius={horizontalScale(15)} width={width*0.3} height={horizontalScale(15)}  />

                </View>
            )}
            {item != null ? (
                <Text style={[styles.commentCountText, {color: theme.header}]}>{`(${item.commentCount} comments)`}</Text>

            ) : (
                <Skeleton {...SkeletonCommonProps} show={loading} radius={horizontalScale(15)} width={width*0.25} height={horizontalScale(15)}  />
            )}
     </View>
    )}
          
          {openShareModal && 
            <CustomModal openModal={setOpenShareModal}>
                <Text>Share</Text>
            </CustomModal>
          }
             

    </View>
  )
}

FeedImage.propTypes = {
    item: PropTypes.object,
    loading: PropTypes.bool.isRequired
}
    

const styles = StyleSheet.create({
    feedContainer: {
        gap: 15
    },
    feedImageContainer: {
        width: '100%',
        flex: 1,
        height: horizontalScale(400),
        borderRadius: horizontalScale(40),
        overflow: 'hidden',
        // marginVertical: verticalScale(10)
    },
    imageSwiper: {
        ...StyleSheet.absoluteFill,
        zIndex: -10
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: horizontalScale(40),
      
    },
    followerInfoContainer: {
       paddingHorizontal: horizontalScale(14),
       paddingVertical: horizontalScale(18),
       flex: 1
    },
    followerInfoImageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    followerInfoImage: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center'

    },
    followerImageName: {},
    followerName: {
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        fontSize: fontScale(16),
        textTransform: 'capitalize'
    },
    followerPostDate: {
        fontFamily: getFontFamily('PlusJakartaSans', '400'),
        fontSize: fontScale(12),
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
        width: horizontalScale(55),
        borderRadius: horizontalScale(10),
        paddingVertical: verticalScale(4),
        alignItems: 'center',
        justifyContent: 'center'
    },
    followActionText: {
        color: color.white,
        fontFamily: getFontFamily('Poppins', '500'),
        fontSize: fontScale(14),
        letterSpacing: 0.4
    },
    followerActionsContainer: {
        // gap: 35,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        right: horizontalScale(12),
        top: verticalScale(140)
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
    imageCarouselControlContainer: {
       gap: 4,
       justifyContent: 'flex-start',
       marginLeft: horizontalScale(30),
       marginBottom: verticalScale(10)
    },
    stroke: {
        width: horizontalScale(8),
        height: horizontalScale(6),
        borderRadius: horizontalScale(10),
    },
    selectedStroke: {
        width: horizontalScale(34),
        height: horizontalScale(6),
        borderRadius: horizontalScale(10),
    },
    commentSection: {
        padding: horizontalScale(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: horizontalScale(20)
    },
    commentProfile: {
        gap: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentProfileImage: {
        width: horizontalScale(27),
        height: horizontalScale(27),
        borderRadius: horizontalScale(27)
    },
    inputText: {
      fontSize: fontScale(15),
      fontFamily: getFontFamily('PlusJakartaSans', '400'),
      lineHeight: fontScale(26)
    },
    commentCountText: {
        fontSize: fontScale(15),
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        lineHeight: fontScale(26)
    },
    feedContent: {
        paddingHorizontal: horizontalScale(18),
    },

})


export default FeedImage
