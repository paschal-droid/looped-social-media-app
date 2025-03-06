import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { generateUniqueImageName } from '../data/dataConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updatePostData } from '../redux/reducers/Post';


const serverURL = 'https://us-central1-stay-looped.cloudfunctions.net/loopedServer'

export const uploadProfileImages = async (profileUris) => {
    try {
        // Map each URI to an upload promise
        const uploadPromises = profileUris.map(async (profileUri) => {
            const profileName = generateUniqueImageName('profile');
            const response = await fetch(profileUri);
            const blob = await response.blob();

            const storageRef = storage().ref(`userProfiles/${auth().currentUser.uid}/${profileName}`);
            await storageRef.put(blob);
            const downloadURL = await storageRef.getDownloadURL();
            
            return { downloadURL };
        });

        // Await all uploads to complete
        const uploadResults = await Promise.all(uploadPromises);

        if (__DEV__) {
          console.log('All profile images uploaded successfully');
        }
        return uploadResults; // Array of { downloadURL } for each uploaded image

    } catch (error) {
        if (__DEV__) {
          console.error('Error uploading profile images:', error);

        }
        if (error.code === 'auth/network-request-failed') {
            return {error: 'No Internet Connection', title: 'Turn on your mobile data or wifi'}
        }
        if (error.code === 'auth/unknown') {
            return {error: 'An unknown error occurred. Please try again later.', title: 'Something went wrong'}
        }
        return { error: 'Something went wrong with the uploads', title: "Please ensure you're connected to a network"};
    }
};

export const saveBioInfoToDatabase = async (userData) => {
    const deviceToken = await AsyncStorage.getItem('deviceToken')
    try {
        await firestore().collection('users').doc(auth().currentUser.uid).set({
            firstName: userData.firstName,
            lastName: userData.lastName,
            dateOfBirth: firestore.Timestamp.fromDate(userData.dateOfBirth),
            gender: userData.gender,
            followersCount: 0,
            followingCount: 0,
            profileImages: userData.profileImageUrls,
            interests: userData.selectedInterests,
            occupation: userData.occupation,
            bio: userData.profileBio,
            username: userData.username.length > 4 ? userData.username : `${userData.firstName}${userData.lastName}`.toLowerCase(),
            deviceToken
        })

        await firestore().collection('connections').doc(auth().currentUser.uid).set({})

        await fetch(`${serverURL}/initialize`, {
          method: 'POST',
          body: JSON.stringify({userUID: auth().currentUser.uid, type: 'register'}),
          headers: {"Content-Type": "application/json"}
          }).then(response => {
            if (__DEV__) {
              console.log(response.status);
            }
        })

        return {success: 'successfully updated user data'}
        
    } catch (error) {
        if (__DEV__) {
          console.error('Error saving user info to database:', error);

        }  
        if (error.code === 'auth/network-request-failed') {
            return {error: 'No Internet Connection', title: 'Turn on your mobile data or wifi'}
        }
        if (error.code === 'auth/unknown') {
            return {error: 'An unknown error occurred. Please try again later.', title: 'Something went wrong'}
        }
        return { error: 'oops! Something went wrong somewhere', title: "Please ensure you're connected to a network"};
    }
}

export const updateDeviceToken =  async () => {
    const deviceToken = await AsyncStorage.getItem('deviceToken')
    try {
        await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .set({
            deviceToken
        }, { merge: true });
      

        await fetch(`${serverURL}/initialize`, {
          method: 'POST',
          body: JSON.stringify({userUID: auth().currentUser.uid, type: 'login'}),
          headers: {"Content-Type": "application/json"}
          }).then(response => {
            if (__DEV__) {
              console.log(response.status);

            }
        })
        
        return {success: 'successfully updated the user device token to latest'}
    } catch (error) {
        if (__DEV__) {
          console.error('Error updating device token to firestore:', error);

        }
        if (error.code === 'auth/network-request-failed') {
            return {error: 'No Internet Connection', title: 'Turn on your mobile data or wifi'}
        }
        if (error.code === 'auth/unknown') {
            return {error: 'An unknown error occurred. Please try again later.', title: 'Something went wrong'}
        }
        return { error: 'oops! Something went wrong somewhere', title: "Please ensure you're connected to a network"};
    }    

}

export const uploadMultipleMedia = (dispatch, postMedia, type) => {
    return new Promise(async (resolve, reject) => {
      try {
        const totalSize = postMedia.length; // Total number of items
        let completedSize = 0; // Track completed uploads
        // Create an array to hold upload tasks
        const uploadTasks = postMedia.map(async (media) => {
          // Generate a unique name for each media item
          // const mediaType = media.type; // "photo" or "video"
          const mediaName = generateUniqueImageName(type);
  
          // Fetch the media data and convert it to a blob
          const response = await fetch(media.uri);
          const blob = await response.blob();
  
          // Upload the blob to Firebase Storage
          const task = storage()
            .ref()
            .child(`${type}/${auth().currentUser.uid}/${mediaName}`)
            .put(blob);
  
          // Track the upload progress for this specific media
          return new Promise((resolveTask, rejectTask) => {
            task.on(
              'state_changed',
              (snapshot) => {
                // Calculate the progress for this media item
                const progress = ((completedSize + snapshot.bytesTransferred / snapshot.totalBytes) / totalSize) * 100;
                // Update progress in Redux state for this specific item
                dispatch(updatePostData({ progress: progress.toFixed() }));

              },
              (error) => {
                console.error(`Error uploading ${type}:`, error);
                rejectTask(`Error uploading ${type}`);
              },
              async () => {
                // Upload is complete, get the download URL
                completedSize += 1;
                const downloadURL = await task.snapshot.ref.getDownloadURL();
                // Resolve this specific task with its download URL
                resolveTask({ url: downloadURL, type: media.type });
              }
            );
          });
        });
  
        // Wait for all uploads to complete
        const uploadResults = await Promise.all(uploadTasks);
  
        // Resolve the main Promise with all download URLs
        resolve(uploadResults);
      } catch (error) {
        if (error.code === 'auth/network-request-failed') {
            return {error: 'No Internet Connection', title: 'Turn on your mobile data or wifi'}
        }
        if (error.code === 'auth/unknown') {
            return {error: 'An unknown error occurred. Please try again later.', title: 'Something went wrong'}
        }
        console.error('Error during upload:', error);

        reject('Something went wrong with the uploads');
        return {error: 'Something went wrong with the uploads', title: "Couldn't not create your post"}
      }
    });
};


export const createNewPostComment = async (postId, authorId, username, profileUrl, addComment) => {
  try {
      await firestore().collection('user_content').doc(authorId)
      .collection('posts').doc(postId).collection('comments')
      .add({
        userId: auth().currentUser.uid,
        text: addComment,
        createdAt: firestore.FieldValue.serverTimestamp(),
        username, 
        profileUrl: profileUrl,
        likes: 0
      })

      //todo server backend to increment the commentCount whenever a new comment has been added
      await fetch(`${serverURL}/addComment`, {
        method: 'POST',
        body: JSON.stringify({authorId, userId: auth().currentUser.uid, postId, type: 'post', commentary: addComment}),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (__DEV__) {
          console.log(response.status);
        }
      })
      return {success: 'Successfully created new Comment'}
  } catch (error) {
      if(error.code === 'auth/network-request-failed'){
          return {error: 'No Internet Connection'}
      }
      if(error.code === 'auth/unknown'){
          return {error: 'An unknown error occurred. Please try again later.'}
      }
      if (__DEV__) {console.error('Error creating a new post comment:', error)}
      return {error: 'Cannot create a new comment'}
  }
}

export const createNewHighlightComment = async (postId, authorId, username, profileUrl, addComment) => {
  try {
      await firestore().collection('user_content').doc(authorId)
      .collection('highlights').doc(postId).collection('comments')
      .add({
        userId: auth().currentUser.uid,
        text: addComment,
        createdAt: firestore.FieldValue.serverTimestamp(),
        username,
        profileUrl,
        likes: 0
      })

      //todo server backend to increment the commentCount whenever a new comment has been added
      await fetch(`${serverURL}/addComment`, {
        method: 'POST',
        body: JSON.stringify({authorId, userId: auth().currentUser.uid, postId, type: 'highlight', commentary: addComment}),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (__DEV__) {console.log(response.status);}
      })
      return {success: 'Successfully created new Comment'}
  } catch (error) {
      if(error.code === 'auth/network-request-failed'){
          return {error: 'No Internet Connection'}
      }
      if(error.code === 'auth/unknown'){
          return {error: 'An unknown error occurred. Please try again later.'}
      }
      console.error('Error creating a new video comment:', error);
      return {error: 'Cannot create a new comment'}
  }
}

export const createNewPostReplyToComment = async (postId, authorId, username, profileUrl, addComment, commentId) => {
  try {
      await firestore().collection('user_content').doc(authorId)
      .collection('posts').doc(postId).collection('comments').doc(commentId).collection('replies')
      .add({
        userId: auth().currentUser.uid,
        text: addComment,
        createdAt: firestore.FieldValue.serverTimestamp(),
        username, 
        profileUrl: profileUrl,
        likes: 0
      })

      //todo server backend to increment the commentCount whenever a new reply has been added to a comment
      await fetch(`${serverURL}/reply`, {
        method: 'POST',
        body: JSON.stringify({authorId, userId: auth().currentUser.uid, postId, type: 'post'}),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (__DEV__) {
          console.log(response.status);
        }
      })
      return {success: 'new reply updated'}
  } catch (error) {
      if(error.code === 'auth/network-request-failed'){
          return {error: 'No Internet Connection'}
      }
      if(error.code === 'auth/unknown'){
          return {error: 'An unknown error occurred. Please try again later.'}
      }
      console.error('Error creating a reply to a user comment:', error);
      return {error: 'Cannot reply to the comment'}
  }
}


export const createNewHighlighReplyToComment = async (postId, authorId, username, profileUrl, addComment, commentId) => {
  try {
      await firestore().collection('user_content').doc(authorId)
      .collection('highlights').doc(postId).collection('comments').doc(commentId).collection('replies')
      .add({
        userId: auth().currentUser.uid,
        text: addComment,
        createdAt: firestore.FieldValue.serverTimestamp(),
        username, 
        profileUrl: profileUrl,
        likes: 0
      })

      await fetch(`${serverURL}/reply`, {
        method: 'POST',
        body: JSON.stringify({authorId, userId: auth().currentUser.uid, postId, type: 'highlight'}),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (__DEV__) {
          console.log(response.status);
        }
      })

      return {success: 'new reply updated'}
  } catch (error) {
      if(error.code === 'auth/network-request-failed'){
          return {error: 'No Internet Connection'}
      }
      if(error.code === 'auth/unknown'){
          return {error: 'An unknown error occurred. Please try again later.'}
      }
      console.error('Error creating a reply to a user comment:', error);
      return {error: 'Cannot reply to the comment'}
  }
}

  
// export const cleanUpUsersCollection = async () => {
//     const db = getFirestore();
//     try {
//       const usersCollectionRef = collection(db, 'users');
//       const querySnapshot = await getDocs(usersCollectionRef);
      
  
//       querySnapshot.forEach(async (docSnapshot) => {
        
//         if (docSnapshot.id.length < 28) {
//           await deleteDoc(doc(db, 'users', docSnapshot.id));
//           console.log(`Deleted doc with ID: ${docSnapshot.id}`);
//         }
//       });
  
//       console.log('Cleanup completed.');
//     } catch (error) {
//       console.error('Error cleaning up users collection:', error);
//     }
// };