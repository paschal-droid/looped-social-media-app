import { createSlice } from "@reduxjs/toolkit"
import firestore from '@react-native-firebase/firestore'
import auth from "@react-native-firebase/auth";
import { fetchOtherUsersData } from "./Users";

const prevState = {
    currentUser: null,
    following: [],
    posts: [],
    stories: [],
   highlights: [],
   activity: [],
}

const User = createSlice({
    name: 'user',
    initialState: prevState,
    reducers: {
        setUser: (state, action) => {
            return { ...state, currentUser: action.payload };
        },
        setPosts: (state, action) => {
            return { ...state, posts: action.payload };
        },
        setStories: (state, action) => {
            return { ...state, stories: action.payload };
        },
        setHighlights: (state, action) => {
            return { ...state, highlights: action.payload };
        },
        setFollowing: (state, action) => {
            return { ...state, following: action.payload };
        },
        setActivity: (state, action) => {
            return {...state, activity: action.payload}
        },
        reset: (state, action) => {
            return prevState;
        },
      
    }
})


export const {setUser, reset, setFollowing, setPosts, setHighlights, setStories, setActivity} = User.actions

// Thunk action to fetch user data from Firestore
export const fetchUser = () => async (dispatch) => {
    try {
        const snapshot = await firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .get();

        if (snapshot.exists) {
            const userData = snapshot.data();
            dispatch(setUser({...userData, id: snapshot.id}));
        } else {
            if(__DEV__) {
                console.log('User does not exist');
            }
        }
    } catch (error) {
        if(__DEV__) {
            console.error('Error fetching user:', error);
        }
    }
};

export const fetchUserPosts = () => (dispatch) => {
    try {
        firestore()
        .collection('user_content')
        .doc(auth().currentUser.uid)
        .collection('posts')
        .orderBy('createdAt', "desc")
        .onSnapshot((snapshot) => {
            if(snapshot === null){
                dispatch(setPosts([]))
                return
            }            
            let posts = snapshot.docs.map(doc => {
                const data = doc.data()
                const id = doc.id
                return {id, ...data}
            })
            dispatch(setPosts(posts))
        })
    } catch (error) {
        if(__DEV__) {
            console.error('Error fetching posts:', error);
        }
    }
}

export const fetchUserStories = () =>  (dispatch) => {
    try {
        firestore()
        .collection('user_content')
        .doc(auth().currentUser.uid)
        .collection('stories')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
            if(snapshot === null){
                dispatch(setStories([]))
                return
            }
            let stories = snapshot.docs.map(doc => {
                const data = doc.data()
                const id = doc.id
                return {id, ...data}
            })
            dispatch(setStories(stories))
        })
    } catch (error) {
        if(__DEV__) {
            console.error('Error fetching stories:', error);
        }
    }
}

export const fetchUserVideos = () => (dispatch) => {
    try {
        firestore()
        .collection('user_content')
        .doc(auth().currentUser.uid)
        .collection('highlights')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
            if(snapshot === null){
                dispatch(setHighlights([]))
                return
            }
            let videos = snapshot.docs.map(doc => {
                const data = doc.data()
                const id = doc.id
                return {id, ...data}
            })
            dispatch(setHighlights(videos))
        })
    } catch (error) {
        if(__DEV__) {
            console.error('Error fetching videos:', error);
        }
    }
}

export const fetchFollowing = () => (dispatch) => {
    try {
        firestore()
        .collection('connections')
        .doc(auth().currentUser.uid)
        .collection('following')
        .onSnapshot((snapshot) => {
            if(snapshot === null){
                dispatch(setFollowing([]))
                return
            }
            let following = snapshot.docs.map(doc => {
                const id = doc.id
                return id
            })
            
            dispatch(setFollowing(following))
            //! we are going to fetch the posts, stories and videos of those we follow here
            for(let i = 0; i < following.length; i++){ //? getting the item from the following posts which is the uid of the users you follow
                dispatch(fetchOtherUsersData(following[i]))
            }
        })
    } catch (error) {
        if(__DEV__) {
            console.error('Error fetching user follows:', error);
        }
    }
}

export const fetchActivity = () => (dispatch) => {
    const now = new Date()
    const endOfWeek = new Date(now.setDate(now.getDate() - 21));
    try {
        firestore()
        .collection('notifications')
        .doc(auth().currentUser.uid)
        .collection('messages')
        .where('createdAt', '>=', endOfWeek)
        .onSnapshot((snapshot) => {
            if(snapshot === null){
                dispatch(setActivity([]))
                return
            }
            let activities = snapshot.docs.map(doc => {
                const data = doc.data()
                const id = doc.id
                return {id, ...data}
            })
            
            dispatch(setActivity(activities))
        })
    } catch (error) {
        if(__DEV__) {
            console.error('Error fetching user activities & notifications:', error);
        }
    }
}


export default User.reducer
