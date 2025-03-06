//todo used to manage the state of any other user aside the authenticated user that the current user is trying to view their profile data

import firestore from '@react-native-firebase/firestore'

import { createSlice } from "@reduxjs/toolkit";
import { createThumbnail } from "react-native-create-thumbnail";


const prevState = {
    posts: [],
    stories: [],
    highlights: [],
}

const ProfileViewUser = createSlice({
  name: 'profileViewUser',
  initialState: prevState,
  reducers: {
    updateUserInfo: (state, action) => {
      return {...state, ...action.payload};
    },
    updateNewThumbnail: (state, action) => {
      return {
        ...state,
        videos: state.videos.map(item =>
          item.id === action.payload.itemId
            ? {...item, thumbnail: action.payload.thumbnail}
            : item
        ),
      };
    },
    reset: (state, action) => {
      return prevState;
    },
  },
});

export const {reset, updateUserInfo, updateNewThumbnail} = ProfileViewUser.actions

// Thunk action to fetch user data from Firestore


export const getVisitedUserData = (guestUID) => (dispatch) => {  
  try {
    // * Fetch the posts
    firestore().collection('user_content').doc(guestUID).collection('posts').orderBy('createdAt', 'asc')
    .onSnapshot((snapshot) => {
      if (snapshot === null) {
        dispatch(updateUserInfo({posts: []}))
        return
      }

      const posts = snapshot.docs.map(doc => {
        const data = doc.data()
        const id = doc.id
        return {id, ...data}
      })

      dispatch(updateUserInfo({posts}))
    })
    

    //*  Fetch the stories
    // firestore().collection('user_content').doc(guestUID).collection('stories').orderBy('createdAt', 'asc')
    // .onSnapshot((snapshot) => {
    //   if (snapshot === null) {
    //     dispatch(updateUserInfo({stories: []}))
    //     return
    //   }
    //   const stories = snapshot.docs.map(doc => {
    //     const data = doc.data()
    //     const id = doc.id
    //     return {id, ...data}
    //   })
    //  dispatch(updateUserInfo({stories}))
    // })

    // * Fetch the videos/highlights
    firestore().collection('user_content').doc(guestUID).collection('highlights').orderBy('createdAt', 'asc')
    .onSnapshot((snapshot) => {
      if (snapshot === null) {
        dispatch(updateUserInfo({highlights: []}))
        return
      }
      const highlights = snapshot.docs.map(doc => {
        const data = doc.data()
        const id = doc.id
        return {id, ...data}
      })

      dispatch(updateUserInfo({highlights}))
    })    
    
    // dispatch(updateUserInfo({stories, posts, highlights}))
  } catch (error) {
    if(__DEV__) {console.error('Error fetching user and their data:', error)};
    
  }
}


export const generateThumbNails = () => {
    return async (dispatch, getState) => {
        const state = getState(); // Get the entire state
        const { videos } = state.profileViewedUser; // Assuming `videos` is under the `viewedUser` slice
        if(videos.length !== 0){
            for (const video of videos) {
              
                await createThumbnail({
                  url: video.videoUrl,
                  timeStamp: 3000,
                })
                  .then(response =>
                    dispatch(
                      updateNewThumbnail({
                        itemId: video.id,
                        thumbnail: response.path,
                      }),
                    ),
                  )
                  .catch(err => {if(__DEV__) console.log({err})});
                }
                return;
              } 
        else {
          if(__DEV__) {
            console.log('list is empty');
          }
            return
        }
    }
}

export default ProfileViewUser.reducer