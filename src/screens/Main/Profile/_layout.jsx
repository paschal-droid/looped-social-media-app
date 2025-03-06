import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View, TouchableOpacity, BackHandler } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { globalStyles } from '../../../themes';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'


import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { AppLoader, BioText, GradientBtn, Icon, NavPressable, ProfileStats } from '../../../components';
import { ProfileTabsNavigation } from '../../../navigation/profileTabNavigation';
import { color, getFontFamily, scaling } from '../../../themes/themes';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getVisitedUserData, updateUserInfo } from '../../../redux/reducers/ProfileViewUser';
import { formatLikesCount } from '../../../data/dataConstants';
import { Routes } from '../../../navigation/Routes';
import { followUser, unFollowUser } from '../../../api/user-functions';

const {verticalScale, horizontalScale, fontScale} = scaling
const {width, height} = Dimensions.get('window')

const Profile = ({navigation, route}) => {
  const {theme} = useTheme()
  const tabBarHeight = useBottomTabBarHeight()
  const snapPoints = useMemo(() => ['62%', '80%', '95%'], []);
  const {top} = useSafeAreaInsets()
  const dispatch = useDispatch()



  const {uid} = route.params
  const userData = useSelector(state => state.user)
  const {posts, highlights} = useSelector(state => state.profileViewUser)
  const bottomSheetRef = useRef(null)

  const [activeViewedUser, setActiveViewedUser] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [postCount, setPostCount] = useState(0);

  const onFollow = () => {
    followUser(uid)
  }

  const onUnfollow = () => {
    unFollowUser(uid)
  }  
    
  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (uid === auth().currentUser.uid) {
        if (isMounted) {
          setActiveViewedUser(userData.currentUser);
          dispatch(
            updateUserInfo({
              stories: userData.stories,
              posts: userData.posts,
              highlights: userData.highlights,
            })
          );
        }
      } else {
        try {
          const snapshot = await firestore().collection("users").doc(uid).get();
          if (snapshot.exists && isMounted) {
            const userData = snapshot.data();
            dispatch(getVisitedUserData(uid));
            setActiveViewedUser({ ...userData, id: snapshot.id });
          }
        } catch (error) {
          if(__DEV__) {
            console.error("Error fetching user:", error);
          }
        }
      }
    })();
  
    return () => {
      isMounted = false;
    };
  }, [uid, dispatch]); // Added dispatch dependency for best practices
  
  //* Prevents navigating back to the previous screen
  useEffect(() => {
    const backAction = () => {
      navigation.setParams({ uid: auth().currentUser.uid });
      navigation.goBack()
      return true; // Prevent default back behavior
    };
  
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
  
    return () => {
      backHandler.remove();
    };
  }, [navigation]); // Added navigation dependency
  
  //* Update follow state only when userData.following changes
  useEffect(() => {
    setIsFollowing(userData.following.includes(uid));
  }, [userData.following, uid]);
  
  //* Update post count when posts or highlights change
  useEffect(() => {
    setPostCount(posts.length + highlights.length);
  }, [posts.length, highlights.length]); // Avoid passing whole objects, only use needed properties
  

  if(activeViewedUser === null){
    return (
    <SafeAreaView style={[globalStyles.appScreen, {backgroundColor: theme.background}]}>
      <AppLoader />
    </SafeAreaView>
  )  
}

  return (
    <SafeAreaView style={[globalStyles.appScreen, {backgroundColor: theme.background}]}>
      <StatusBar translucent={true} barStyle={'light-content'} backgroundColor={'transparent'} />
        <View style={[styles.profileImageContainer]}>
          <FastImage priority={FastImage.priority.high} source={{uri: activeViewedUser.profileImages[1]}} style={StyleSheet.absoluteFill}  />
        </View>

        <View style={[styles.navigateButton, {top: top+10}]}>
          <NavPressable 
            icon={'arrow-backward'} 
            onPress={() => {navigation.setParams({ uid: auth().currentUser.uid }); navigation.goBack()}} 
          />
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enableOverDrag={false}
          backgroundStyle={[styles.handlerStyle, {backgroundColor: theme.background}]}
          handleIndicatorStyle={{backgroundColor: theme.header, width: 0}}
        >

          {/* Static Profile username and action */}
          <View style={styles.profileUsernameContainer}>
            <View style={styles.profileUsername}>
              <Text style={[styles.profileNameText, {color: theme.header}]}>{activeViewedUser.firstName} {activeViewedUser.lastName}</Text>
              <Text style={[styles.profileUsernameText, {color: theme.paragraph}]}>@{activeViewedUser.username}</Text>
            </View>
          <View style={styles.userActionContainer}>
            {uid === auth().currentUser.uid ? 
            <TouchableOpacity onPress={() => navigation.push(Routes.EditProfile)}>
              <View style={[styles.editButton]}>
                <Icon name='edit' color={theme.primaryColor} size={fontScale(20)} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </View>
            </TouchableOpacity> :
            <GradientBtn changeGradient={isFollowing} text={isFollowing ? 'Following' : 'Follow'} onPress={isFollowing ? onUnfollow : onFollow} />
            }
          </View>
          </View>

          <BottomSheetView style={styles.profileContentContainer}>
            {/* Follower, posts, and following count */}

            <View style={styles.profileStatsContainer}>
              <ProfileStats drawLine viewMore={() => {}} mainText={'Followers'} countText={formatLikesCount(activeViewedUser.followersCount)} />
              <ProfileStats drawLine viewMore={() => {}} mainText={'Following'} countText={formatLikesCount(activeViewedUser.followingCount)} />
              <ProfileStats viewMore={() => {}} mainText={'Posts'} countText={formatLikesCount(postCount)} />
            </View>

            <View style={styles.profileBioConatiner}>
             <BioText text={activeViewedUser.bio} />
            </View>

            <View style={[styles.gridContainer, {marginBottom: tabBarHeight}]}>
              <ProfileTabsNavigation uid={uid} />
            </View>
          </BottomSheetView>

        </BottomSheet>
        

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
  },
  profileImageContainer: {
    height: height*0.45,
  },
  profileContentContainer: {
    flex: 1,
    paddingVertical: horizontalScale(10),
    gap: 40
  },
  handlerStyle: {
    borderTopRightRadius: horizontalScale(25),
    borderTopLeftRadius: horizontalScale(25),
  },
  profileUsernameContainer: {
    paddingHorizontal: horizontalScale(14),
    paddingVertical: horizontalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  profileUsername: {},
  profileNameText: {
    fontFamily: getFontFamily('PlusJakartaSans', '700'),
    fontSize: fontScale(24),
    textTransform: 'capitalize',
  },
  profileUsernameText: {
    fontFamily: getFontFamily('FuturaPT', '500'),
    fontSize: fontScale(18),
    textTransform: 'lowercase',
  },
  userActionContainer: {
    flex: 0.8,
  },
  profileStatsContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(14),
    paddingHorizontal: horizontalScale(30),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  profileBioConatiner: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(14),
  },
  goBackAction: {},
  gridContainer: {
    flex: 1
  },
  navigateButton: {
    position: 'absolute',
    zIndex: 2,
    left: horizontalScale(14)
  },
  editButton: {
    height: horizontalScale(45),
    borderRadius: horizontalScale(25),
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
  },
  editButtonText: {
    fontFamily: getFontFamily('PlusJakartaSans', '700'),
    fontSize: fontScale(18),
    textTransform: 'capitalize',
    color: color.primary
  },
})

export default Profile
