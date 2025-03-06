import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { createSlice } from "@reduxjs/toolkit";

const prevState = {
    caption: '',
    media: [],
    taggedPeople: [],
    song: [],
    location: '',
    sharePreference: 'Everyone',
    progress: 0,
    allowComment: true,
    hashTags: [],
    type: '',
    uploadedMedia: [],
}

const PostData = createSlice({
    name: 'postData',
    initialState: prevState,
    reducers: {
        updatePostData: (state, action) => {
            return {...state, ...action.payload}
        },
        resetPostData: () => {
            return prevState
        }
    }
})

export const {updatePostData, resetPostData} = PostData.actions

export const finishUpMediaUpload = () => {
    return async (dispatch, getState) => {
       const state = getState()
       const post = state.post; //* Assuming `post` is under the `post` which is this current slice we are in
       try {
        await firestore().collection('user_content').doc(auth().currentUser.uid)
        .collection(`${post.type}`).add({
            authorId: auth().currentUser.uid,
            uploadedMedia: post.uploadedMedia,
            caption: post.caption,
            hashtags: post.hashTags,
            createdAt: firestore.FieldValue.serverTimestamp(),
            likes: 0,
            location: post.location,
            commentCount: 0,
            allowComment: post.allowComment,
            sharePreference: post.sharePreference,
            taggedPeople: post.taggedPeople.map((tags) => tags.id),
            
        })
        if(__DEV__) {
            console.log(`${post.type} upload success`);
        }
        
    } catch (error) {
        if (error.code === 'auth/network-request-failed') {
            return {error: 'No Internet Connection', title: 'Turn on your mobile data or wifi'}
        }
        if (error.code === 'auth/unknown') {
            return {error: 'An unknown error occurred. Please try again later.', title: 'Something went wrong'}
        }
        console.error('Error Creating story, From post (finishUpMediaUpload)', error);
        return { error: 'Try re-uploading your post', title: "Issue with creating your post"};
    }
       
       
    }
}

export default PostData.reducer