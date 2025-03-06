import { Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { memo, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { getFontFamily, scaling } from '../../../../themes/themes'
import { useTheme } from '../../../../context/ThemeContext'
import Icon from '../../../Icon/Icon'
import FastImage from 'react-native-fast-image'
import { formatLikesCount, formatPostTime } from '../../../../data/dataConstants'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostRepliesToComments, fetchHighlightRepliesToComments } from '../../../../redux/reducers/Users'
import SingleSubComment from './SubComments'

const { verticalScale, horizontalScale, fontScale } = scaling


const SingleComment = (props) => {
    const {theme} = useTheme()
    const [visibleReplies, setVisibleReplies] = useState({});
    const [replies, setReplies] = useState([])
    const dispatch = useDispatch()

    const { feedHighlights, feedPosts} = useSelector(state => state.users)

    const post = useMemo(() => {
      return props.isVideo 
          ? feedHighlights.find(el => el.id === props.postId)
          : feedPosts.find(el => el.id === props.postId)
    }, [feedPosts, feedHighlights, props.isVideo, props.postId])

    const comment = useMemo(() => {
      return props.isVideo 
          ? post?.highlightsComment.find(el => el.id === props.item.id)
          : post?.postsComment.find(el => el.id === props.item.id)

    }, [post, props.item.id])

    useEffect(() => {
      if(props.isVideo){
        if (props.authorId && props.postId && props.item.id) {
          dispatch(fetchHighlightRepliesToComments(props.authorId, props.postId, props.item.id))
        }
      }else {
        if (props.authorId && props.postId && props.item.id) {
            dispatch(fetchPostRepliesToComments(props.authorId, props.postId, props.item.id))
        }
      }
    }, [dispatch, props.authorId, props.postId, props.item.id])

    useEffect(() => {
        if (comment) {
            setReplies(comment.replies)
        }
    }, [comment])

    const handleShowMoreReplies = (commentIndex) => {
        // Update the visible replies state to show all replies for the given comment index
        setVisibleReplies({ ...visibleReplies, [commentIndex]: !visibleReplies[commentIndex]});
      };
      
      
  return (
    <View style={styles.mainCommentContainer}>
        <Pressable>
            <FastImage source={{uri: props.item?.profileUrl}} style={styles.mainCommentContainerProfile} />
        </Pressable>
        <View style={styles.mainCommentContainerChild2}>
            <View style={styles.mainCommentContainerUserName}>
                <Text style={[styles.mainCommentContainerUserNameText, { color: theme.header }]}>{props.item.username}</Text>
                <Text style={[styles.mainCommentContainerUserNameTime, { color: theme.paragraph }]}>{props.item.createdAt ? formatPostTime(props.item.createdAt.seconds) : ''}</Text>
            </View>
            <View style={styles.mainCommentContainerContent}>
                <Text style={[styles.mainCommentContainerContentText, { color: theme.textColor }]}>{props.item.text}</Text>
            </View>
            <View style={styles.mainCommentContainerInteractions}>
                <View style={styles.mainCommentContainerLikeCount}>
                    <Pressable onPress={() => { }}><Icon color={theme.textColor} name='heart' size={fontScale(18)} /></Pressable>
                    <Text style={styles.mainCommentContainerInteractionsText}>{formatLikesCount(props.item.likes)}</Text>
                </View>
                <Pressable onPress={() => props.handleReply(props.item.firstName)}>
                    <Text style={styles.mainCommentContainerInteractionsText}>Reply</Text>
                </Pressable>
            </View>


            {replies && replies.length > 0 && (
                <View style={styles.subCommentContainer}>

                    <TouchableOpacity style={styles.subCommentContainerAction} onPress={() => handleShowMoreReplies(props.index)}>
                        <View style={[styles.line, {backgroundColor: theme.textColor}]} />
                        <Text style={[styles.subCommentContainerActionText, {color: theme.textColor}]}>{visibleReplies[props.index] ? 'Hide Replies' : `View ${props.item.replies.length} more replies`}</Text>
                    </TouchableOpacity>

                    {/* show the replies then when the show more button has been clicked */}
                    {visibleReplies[props.index] && replies.slice(0, 5).map((reply, replyIndex) => (
                        <SingleSubComment key={replyIndex.toString()} item={reply} handleReply={props.handleReply} />
                    ))}
                </View>
            )}
        </View>
    </View>
  )
}

SingleComment.propTypes = {
    item: PropTypes.object.isRequired,
    handleReply: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired
}

export default memo(SingleComment) 

const styles = StyleSheet.create({
    mainCommentContainer: {
        flexDirection: 'row',
        gap: 15,
        paddingTop: verticalScale(30),
        alignItems: 'flex-start',
    
        // marginBottom: verticalScale(24)
      },
      mainCommentContainerProfile: {
        width: horizontalScale(45),
        height: horizontalScale(45),
        borderRadius: horizontalScale(45),
      },
      mainCommentContainerChild2: {
        flex: 1,
        gap: 7,
      },
      mainCommentContainerUserName: {
        gap: 10,
        flexDirection: 'row'
      },
      mainCommentContainerUserNameText: {
        fontSize: fontScale(18),
        lineHeight: fontScale(21),
        fontFamily: getFontFamily('PlusJakartaSans', '700')
      },
      mainCommentContainerUserNameTime: {
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        fontSize: fontScale(13),
      },
      mainCommentContainerContent: {},
      mainCommentContainerContentText: {
        fontFamily: getFontFamily('PlusJakartaSans', '400'),
        fontSize: fontScale(15),
      },
      mainCommentContainerInteractions: {
        flexDirection: 'row',
        gap: 20,
      },
      mainCommentContainerInteractionsText: {
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        fontSize: fontScale(13),
        textAlign: 'center'
      },
      mainCommentContainerLikeCount: {
        flexDirection: 'row',
        gap: 5
      },
      subCommentContainer: {
        marginTop: verticalScale(5)
      },
      subCommentContainerAction: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        height: horizontalScale(20),
      },
      subCommentContainerActionText: {
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        fontSize: fontScale(13),
        textAlign: 'center'
      },
      line: {
        height: 1,
        width: horizontalScale(46)
      }
})