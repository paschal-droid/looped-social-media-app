import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const serverURL = 'https://us-central1-stay-looped.cloudfunctions.net/loopedServer'

export const searchUsers = async query => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .where('firstName', '>=', query.trim().toLowerCase())
      .where('firstName', '<=', query.trim().toLowerCase() + '\uf8ff')
      .limit(10)
      .get();

    const users = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return users;
  } catch (error) {
    console.error('Error searching Firestore:', error);
    throw error;
  }
};

export const fetchSuggestions = async query => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .where('firstName', '>=', query.trim())
      .limit(5)
      .get();

    const suggestions = snapshot.docs.map(doc => doc.data().firstName);
    return suggestions;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
};

export const followUser = async (guestUID) => {
  try {
    await firestore()
    .collection('connections')
    .doc(auth().currentUser.uid)
    .collection('following')
    .doc(guestUID)
    .set({})

    await firestore()
    .collection('connections')
    .doc(guestUID)
    .collection('followers')
    .doc(auth().currentUser.uid)
    .set({});

  } catch(error) {
    if (__DEV__) {
      console.log(error);
    }
  }

  await fetch(`${serverURL}/follow`, {
      method: 'POST',
      body: JSON.stringify({userUID: auth().currentUser.uid, guestUID}),
      headers: {"Content-Type": "application/json"}
    }).then(response => {
      if (__DEV__) {
        console.log(response.status);
      }
  })
}

export const unFollowUser = async (guestUID) => {
  try {
    await firestore()
    .collection('connections')
    .doc(auth().currentUser.uid)
    .collection('following')
    .doc(guestUID)
    .delete()

    await firestore()
    .collection('connections')
    .doc(guestUID)
    .collection('followers')
    .doc(auth().currentUser.uid)
    .delete()
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }

    await fetch(`${serverURL}/unfollow`, {
      method: 'POST',
      body: JSON.stringify({userUID: auth().currentUser.uid, guestUID}),
      headers: {"Content-Type": "application/json"}
    }).then(response => {
      if (__DEV__) {
        console.log(response.status);
      }
    })
}

export const likePost = async (userId, postId) => {
  try {
    await firestore()
      .collection('user_content')
      .doc(userId)
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .doc(auth().currentUser.uid)
      .set({})

    await fetch(`${serverURL}/like`, {
      method: 'POST',
      body: JSON.stringify({userId: auth().currentUser.uid, postId: postId, authorId: userId, type: 'post'}),
      headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (__DEV__) {console.log(response.status);}
    })
    
  } catch (error) {
    if (__DEV__) {console.log(error);}
  }
}

export const likeVideo = async (userId, videoId) => {
  try {
    await firestore()
      .collection('user_content')
      .doc(userId)
      .collection('highlights')
      .doc(videoId)
      .collection('likes')
      .doc(auth().currentUser.uid)
      .set({})

    await fetch(`${serverURL}/like`, {
        method: 'POST',
        body: JSON.stringify({userId: auth().currentUser.uid, postId: videoId, authorId: userId, type: 'highlight'}),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (__DEV__) {console.log(response.status);}
    })
  } catch (error) {
    if (__DEV__) {console.log(error);}
  }
}

export const dislikePost = async (userId, postId) => {
  try {
    await firestore()
      .collection('user_content')
      .doc(userId)
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .doc(auth().currentUser.uid)
      .delete()

    await fetch(`${serverURL}/dislike`, {
      method: 'POST',
      body: JSON.stringify({userId: auth().currentUser.uid, postId: postId, authorId: userId, type: 'post'}),
      headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (__DEV__) {console.log(response.status);}
    })
  } catch (error) {
    if (__DEV__) {console.log(error);}
  }
}
export const dislikeVideo = async (userId, videoId) => {
  try {
    await firestore()
      .collection('user_content')
      .doc(userId)
      .collection('highlights')
      .doc(videoId)
      .collection('likes')
      .doc(auth().currentUser.uid)
      .set({})

    await fetch(`${serverURL}/dislike`, {
        method: 'POST',
        body: JSON.stringify({userId: auth().currentUser.uid, postId: videoId, authorId: userId, type: 'highlight'}),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (__DEV__) {console.log(response.status);}
    })
  } catch (error) {
    if (__DEV__) {console.log(error);}
  }
}