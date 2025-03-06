import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar, Text, TextInput, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../context/ThemeContext';
import { globalStyles } from '../../../themes';
import { color, getFontFamily } from '../../../themes/themes';
import NavPressable from '../../Patterns/NavPressable';

import styles from './commentStyles';
import { createNewHighlighReplyToComment, createNewHighlightComment, createNewPostComment, createNewPostReplyToComment } from '../../../api/cloudStorageRequests';
import { fetchHighlightComments, fetchHighlightRepliesToComments, fetchPostRepliesToComments } from '../../../redux/reducers/Users';
import SingleComment from './Comments/SingleComment';


const Comments = ({navigation, route}) => {
    const snapPoints = useMemo(() => ['98%'], []);
    const { currentUser } = useSelector(state => state.user)
    const {feedHighlights, feedPosts} = useSelector(state => state.users)
    const { theme } = useTheme()
    const commentModalRef = useRef(null);
    const {type, item} = route.params
    const dispatch = useDispatch()

     // ? States of the comment Modals
     const [comments, setComments] = useState([])
     const [commentToReply, setCommentToReply] = useState(null)
     const [addComment, setAddComment] = useState('')
     const [replyTo, setReplyTo] = useState(null)


    // * functions
  useEffect(() => {
    //todo fetching the comment of each post
      if(type === 'highlight'){
        const highlight = feedHighlights.find(el => el.id === item?.id)
        const comment = highlight.highlightsComment
        setComments(comment)
      }else {
        const post = feedPosts.find(el => el.id === item?.id)
        const comment = post.postsComment        
        setComments(comment)
      }
    
  }, [feedPosts, feedHighlights])


  const handleReply = (item) => {
    setAddComment((prev) => {
      if (!prev.startsWith(`@${item.username}`)) {
        return `@${item.username} `;
      }
      return prev;
    });
    setReplyTo(item.username);
    setCommentToReply(item.id)
    

  };

  const handleCommentSubmit = async (postId, authorId) => {
    if (addComment.trim() !== '') {
      try {
        if (type === 'highlight') {
          const createVideoComment = await createNewHighlightComment(postId, authorId, currentUser.username, currentUser.profileImages[0], addComment);
          setAddComment('');
          if (createVideoComment.success) {
            dispatch(fetchHighlightComments(postId, authorId));
          }
        } else {
          const createPostComment = await createNewPostComment(postId, authorId, currentUser.username, currentUser.profileImages[0], addComment);
          setAddComment('');
          if (createPostComment.success) {
            dispatch(fetchPostRepliesToComments(postId, authorId));
          }
        }
        // setAddComment(''); // Clear the comment input
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };
  
  const handleReplyToComment = async (postId, authorId) => {
    if (replyTo) {
      const originalReplyComment = addComment.split(' ').slice(1).join(' ');
      if (originalReplyComment.trim() !== '') {
        try {
          if (type === 'highlight') {
            const createVideoComment = await createNewHighlighReplyToComment(postId, authorId, currentUser.username, currentUser.profileImages[0], originalReplyComment, commentToReply);
            if (createVideoComment.success) {
              dispatch(fetchHighlightRepliesToComments(authorId, postId, commentToReply));
            }
          } else {
            const createReplyToComment = await createNewPostReplyToComment(postId, authorId, currentUser.username, currentUser.profileImages[0], originalReplyComment, commentToReply);
            if (createReplyToComment.success) {
              dispatch(fetchPostRepliesToComments(authorId, postId, commentToReply));
            }
          }
          setAddComment(''); // Clear the comment input
          setReplyTo('');
        } catch (error) {
          console.error('Error replying to comment:', error);
        }
      }
    }
    
  };
    
  const returnToPost = () => {
      navigation.goBack()
  }

  

    return (
        <SafeAreaView style={[styles.commentModal, globalStyles.appScreen, {backgroundColor: theme.background}]}>
            <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />

      
        <BottomSheet
            ref={commentModalRef}
            snapPoints={snapPoints}
            backgroundStyle={[styles.handlerStyle, { backgroundColor: theme.background}]}
            handleIndicatorStyle={{ backgroundColor: theme.header, width: 50 }}
            enablePanDownToClose
            onClose={() => returnToPost()}

        >
            <BottomSheetView style={[styles.contentContainer]}>
                <View style={styles.header}>
                    <View style={styles.firstHeader}>
                        <NavPressable icon={'arrow-backward'} onPress={() => returnToPost(0)} />
                        <Text style={[styles.headerText, {color: theme.header}]}>Comments</Text>
                    </View>
                    <View style={styles.space} />
                </View>

                <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollableContentContainer]}>
                {comments.length != 0 &&
                  comments.map((commentItem, index) => {
                    return (
                      <SingleComment isVideo={type === 'highlight'} authorId={item.authorId} postId={item.id} index={index} item={commentItem} key={index.toString()} handleReply={() => handleReply(commentItem)} />
                    )
                  })
                }
                </BottomSheetScrollView>

                <View style={[styles.commentSection, {  }]}>
                    <View style={[styles.commentProfile]}>
                        <FastImage
                            priority={FastImage.priority.high}
                            style={[styles.commentProfileImage]}
                            source={{ uri: currentUser.profileImages[0]}}
                        />
                        <TextInput inputMode='text' value={addComment} onChangeText={(val) => setAddComment(val)} placeholder='Add a comment...' placeholderTextColor={theme.paragraph} style={[styles.input, {color: theme.header, backgroundColor: addComment.length > 0 ? color.primaryRGBA50 : theme.input}]} />
                    </View>

                    <TouchableOpacity onPress={replyTo ? () => handleReplyToComment(item.id, item.authorId) : () => handleCommentSubmit(item.id, item.authorId)}>
                        <Text style={[styles.sendText, {color: addComment.length > 4 ? theme.primaryColor: '#E5AFAF'}, addComment.length < 4 && {fontFamily: getFontFamily('PlusJakartaSans', '600'),}]}>Post</Text>
                    </TouchableOpacity>
                </View>

                {/* current user space for adding his comment */}

            </BottomSheetView>
        </BottomSheet>
    </SafeAreaView>
    )
}

Comments.propTypes = {
    
}

export default Comments

