//todo used to manage the state of any other user aside the authenticated user

import {createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const prevState = {
  usersThatYouFollow: [],
  usersLoaded: 0,
  feedPosts: [],
  feedHighlights: [],
  storiesFeed: [],
};

const Users = createSlice({
  name: 'users',
  initialState: prevState,
  reducers: {
    setUsers: (state, action) => {
      return {...state, usersLoaded: state.usersLoaded + 1, usersThatYouFollow: [...state.usersThatYouFollow, action.payload.user]};
    },
    setPosts: (state, action) => {
      return {
        ...state,
        feedPosts: [...state.feedPosts, ...action.payload.posts],
      };
    },
    setStories: (state, action) => {
      return {
        ...state,
        storiesFeed: [...state.storiesFeed, ...action.payload.stories],
      };
    },
    updateStoryViewed: (state, action) => {
      const {uid} = action.payload      
      return {...state, storiesFeed: state.storiesFeed.map((item) => item.uid === uid ? {...item, hasBeenViewed: true} : item)}
    },
    setHighlights: (state, action) => {
      return {
        ...state,
        feedHighlights: [...state.feedHighlights, ...action.payload.highlights],
      };
    },
    setPostsComments: (state, action) => {
      const {postId, comment} = action.payload
      return {
        ...state,
        feedPosts: state.feedPosts.map(post =>
          post.id === postId
            ? {...post, postsComment: comment}
            : post,
        ),
      };
    },
    setHighlightsComments: (state, action) => {
      const {videoId, comment} = action.payload
      return {
        ...state,
        feedHighlights: state.feedHighlights.map(video =>
          video.id === videoId
            ? {...video, highlightsComment: comment}
            : video,
        ),
      };
    },
    setPostsReplyToComment: (state, action) => {
      const {postId, commentId, replies} = action.payload
      return {
        ...state,
        feedPosts: state.feedPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                postsComment: post.postsComment.map(comment =>
                  comment.id === commentId
                    ? {...comment, replies: replies}
                    : comment,
                ),
              }
            : post,
        ),
      };
    },
    setHighlightsReplyToComment: (state, action) => {
      const {videoId, commentId, replies} = action.payload
      return {
        ...state,
        feedVideos: state.feedVideos.map(video =>
          video.id === videoId
            ? {
                ...video,
                highlightsComment: video.highlightsComment.map(comment =>
                  comment.id === commentId
                    ? {...comment, replies: replies}
                    : comment,
                ),
              }
            : video,
        ),
      };
    },
    setPostLikes: (state, action) => {
      const {didUserLike, postId} = action.payload
      return {
        ...state,
        feedPosts: state.feedPosts.map(post =>
          post.id === postId
            ? {...post, didUserLike}
            : post,
        ),
      };
    },
    setHighlightLikes: (state, action) => {
      const {videoId, didUserLike} = action.payload
      return {
        ...state,
        feedHighlights: state.feedHighlights.map(video =>
          video.id === videoId
            ? {...video, didUserLike}
            : video,
        ),
      };
    },
    reset: (state, action) => {
      return prevState;
    },
  },
});

export const {
  reset,
  updateUserInfo,
  setUsers,
  updateStoryViewed,
  setPosts,
  setStories,
  setPostsComments,
  setHighlights,
  setHighlightsComments,
  setHighlightsReplyToComment,
  setPostsReplyToComment,
  setPostLikesCount,
  setHighlightLikesCount,
  setPostLikes,
  setHighlightLikes,
} = Users.actions;

export default Users.reducer

export const fetchOtherUsersData = uid => {
  return async (dispatch, getState) => {
    const state = getState();
    const {usersThatYouFollow} = state.users; //* Assuming `users` is under the `users` which is this current slice we are in
    const found = usersThatYouFollow.some(el => el.uid === uid);

    if (!found) {
      try {
        const snapshot = await firestore().collection('users').doc(uid).get();
        if (snapshot.exists) {
          let user = snapshot.data();
          user.uid = snapshot.id;
          dispatch(setUsers({user}));
          dispatch(fetchUsersFollowingStories(user.uid))
          dispatch(fetchUsersFollowingPosts(user.uid))
          dispatch(fetchUsersFollowingHighlights(user.uid))
        } 
      } catch (error) {
        if(__DEV__) {
          console.error('Error fetching user that you follow:', error);
        }
      }
    }
  };
};

export const fetchUsersFollowingStories = (uid) => {
  return async (dispatch, getState) => {
    const state = getState()
    const {usersThatYouFollow} = state.users
    const currentTime = Date.now()
    const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000);
    try {
      const snapshot = await firestore()
      .collection('user_content').doc(uid)
      .collection('stories')
      .where('createdAt', '>=', twentyFourHoursAgo)
      .get()
      
      if(snapshot.docs.length != 0){
        const userId = snapshot.docs[0].ref.path.split('/')[1]
        const user = usersThatYouFollow.find(el => el.uid === userId)
        let stories = snapshot.docs.map(doc => {
          const data = doc.data()
          const {username, profileImages, uid} = user
          const id = doc.id
          return {id, ...data, username, profileImages, uid, hasBeenViewed: false}
        })        
        dispatch(setStories({stories}))
      } 

      dispatch(setStories({stories: []}));
    
    } catch (error) {
      if(__DEV__) {
        console.error('Error fetching the Stories of those you follow:', error);   
      }
    }
  }
}

export const fetchUsersFollowingPosts = (uid) => {
  return async (dispatch, getState) => {
    const state = getState();
    const {usersThatYouFollow} = state.users
    try {
      const snapshot = await firestore()
      .collection('user_content')
      .doc(uid)
      .collection('posts')
      .get()

      if(snapshot.docs.length != 0){
        const userId = snapshot.docs[0].ref.path.split('/')[1]
        const user = usersThatYouFollow.find(el => el.uid === userId)
        let posts = snapshot.docs.map(doc => {
          const data = doc.data()
          const {profileImages, uid, firstName, lastName} = user
          const id = doc.id
          return {id, ...data, firstName, lastName, profileImages, uid, postsComment: []}
        })
        for (let i = 0; i < posts.length; i++) {
          dispatch(fetchUserFollowingPostLikes(userId, posts[i].id))
        }
        dispatch(setPosts({posts}))
      } else {
        dispatch(setPosts({posts: []}));
      }
    } catch (error) {
      if(__DEV__) {
        console.error('Error fetching the Posts of those you follow', error);   
      }
    }
  };
};


export const fetchUsersFollowingHighlights = (uid) => {
  return async (dispatch, getState) => {
    const state = getState();
    const {usersThatYouFollow} = state.users
    try {
      const snapshot = await firestore()
      .collection('user_content')
      .doc(uid)
      .collection('highlights')
      .get()

      if(snapshot.docs.length != 0){
        const userId = snapshot.docs[0].ref.path.split('/')[1]
        const user = usersThatYouFollow.find(el => el.uid === userId)
        let highlights = snapshot.docs.map(doc => {
          const data = doc.data()
          const {profileImages, uid, firstName, lastName} = user
          const id = doc.id
          return {id, ...data, firstName, lastName, profileImages, uid, highlightsComment: []}
        })
        for (let i = 0; i < highlights.length; i++) {
          dispatch(fetchUserFollowingHighlightLikes(userId, highlights[i].id))
        }
        dispatch(setHighlights({highlights}))
      } else {
        dispatch(setHighlights({highlights: []}));
      }
    } catch (error) {
      if(__DEV__) {
        console.error('Error fetching the highlights of those you follow', error);   
      }
    }
  };
};


export const fetchPostComments = (postId, authorId) => async (dispatch) => {
  try {
    firestore()
      .collection('user_content')
      .doc(authorId)
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .onSnapshot(snapshot => {
        if (snapshot === null) {
          return;
        }
        let comments = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return {id, ...data};
        });
        dispatch(setPostsComments({postId, comment: comments}));
      });
  } catch (error) {
    if(__DEV__) {
      console.error('Error fetching posts comments:', error);     
    }
  }
}
export const fetchHighlightComments = (videoId, authorId) => async (dispatch) => {
  try {
    firestore()
      .collection('user_content')
      .doc(authorId)
      .collection('highlights')
      .doc(videoId)
      .collection('comments')
      .onSnapshot(snapshot => {
        if (snapshot === null) {
          return;
        }
        let comments = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return {id, ...data};
        });
        dispatch(
          setHighlightsComments({ videoId, comment: comments}),
        );
      });
  } catch (error) {
    if(__DEV__) {
      console.error('Error fetching Highlights comment:', error);     
    }
  }
}

export const fetchPostRepliesToComments = (authorId, postId, commentId) =>  async (dispatch) => {
  try {
    firestore().collection('user_content').doc(authorId)
    .collection('posts').doc(postId).collection('comments')
    .doc(commentId).collection('replies').get()
    .then((snapshot) => {
        if(snapshot === null){
            dispatch(setPostsReplyToComment({postId, replies: [], commentId}))
            return
        }
        let replies = snapshot.docs.map(doc => {
            const data = doc.data()
            const id = doc.id
            return {id, ...data}
        })
        dispatch(setPostsReplyToComment({postId, replies: replies, commentId}))
})

  } catch (error) {
    if(__DEV__) {
      console.error('Error fetching Post Replies of comments:', error);     
    }
  }
}

export const fetchHighlightRepliesToComments = (authorId, videoId, commentId) =>  async (dispatch) => {
  try {
    firestore().collection('user_content').doc(authorId)
      .collection('highlights').doc(videoId).collection('comments')
      .doc(commentId).collection('replies').get()
      .then((snapshot) => {
        if(snapshot === null){
          dispatch(setHighlightsReplyToComment({videoId, replies: [], commentId}))
          return
        }
        let replies = snapshot.docs.map(doc => {
            const data = doc.data()
            const id = doc.id
            return {id, ...data}
        })
        dispatch(setHighlightsReplyToComment({videoId, replies, commentId}))
    })
  } catch (error) {
    if(__DEV__) {
      console.log('Error fetching Video Replies of highlight comments: ', error);     
    }
  }
  
}

export const fetchUserFollowingPostLikes = (uid, postId, type) => {
  return async (dispatch, getState) => {
    try {
      firestore()
      .collection('user_content')
      .doc(uid)
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .doc(auth().currentUser.uid)
      .onSnapshot(snapshot => {
        if (snapshot === null) {
          return
        }
        const postId = snapshot.ref.path.split('/')[3]
         
        let didUserLike = false
        if(snapshot.exists){
          didUserLike = true
        }
        dispatch(setPostLikes({postId, didUserLike}))
      })
    } catch (error) {
      if(__DEV__) {
        console.error('Error fetching posts Likes:', error);
            
      }
    }
  };
};

export const fetchUserFollowingHighlightLikes = (uid, videoId) => {
  return async (dispatch, getState) => {
    try {
      firestore()
      .collection('user_content')
      .doc(uid)
      .collection('highlights')
      .doc(videoId)
      .collection('likes')
      .doc(auth().currentUser.uid)
      .onSnapshot(snapshot => {
        if (snapshot === null) {
          return
        }
        const videoId = snapshot.ref.path.split('/')[3]
         
        let didUserLike = false
        if(snapshot.exists){
          didUserLike = true
        }
        dispatch(setHighlightLikes({videoId, didUserLike}))
      })
    } catch (error) {
        if(__DEV__) {
          console.error('Error fetching highlight likes:', error);
              
        }
    }
  };
};