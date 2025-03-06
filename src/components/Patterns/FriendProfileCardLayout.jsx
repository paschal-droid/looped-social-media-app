import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { scaling, getFontFamily, color} from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'
import { useSelector } from 'react-redux'
import UserActionButton from '../Buttons/UserActionButton'
import { followUser, unFollowUser } from '../../api/userFunctions'
import FastImage from 'react-native-fast-image'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'


const {horizontalScale, verticalScale, fontScale} = scaling


const FriendProfileCardLayout = ({children, result, onShowProfile}) => {
  const {currentUser} = useSelector((state) => state.user)
  const {theme} = useTheme()
  const [isFollowing, setIsFollowing] = useState(false)


//   useEffect(() => {
//     if(following.indexOf(props.result.id) > -1){
//       setIsFollowing(true)
//     } else {
//       setIsFollowing(false)
//     }
//   }, [following])

//   const onFollow = async () => {
//     await followUser(props.result.id)

//   }

//   const onUnfollow = async () => {
//     await unFollowUser(props.result.id)
    
//   }

    
  return (
    <View style={[styles.searchResultsContainer]}>
      <Pressable onPress={onShowProfile} style={[styles.searchResultsUserInfoContainer]}>
          <View style={[styles.searchResultsUserProfileImageContainer]}>
              <FastImage priority={FastImage.priority.high} source={{ uri: result?.profileImages[0] }} style={[styles.searchResultsUserProfileImage]} />
          </View>
          <View style={[styles.searchResultsUserProfileInfoContainer]}>
              <Text numberOfLines={1} style={[styles.searchResultsUserProfileInfoName, { color: theme.header }]}>{result.firstName} {result.lastName}</Text>
              <Text style={[styles.searchResultsUserProfileMoreInfo, { color: theme.paragraph }]}>Content Creator</Text>
          </View>
      </Pressable>

      <View style={[styles.userFollowingActionContainer]}>
        {children}

        {/* Make sure to import this when using the Card Layout */}
        {/* <UserActionButton
          backgroundColor={isFollowing ? theme.background : theme.primaryColor}
          borderColor={isFollowing ? theme.primaryColor : theme.background}
          borderWidth={1.5}
          textColor={isFollowing ? theme.primaryColor : theme.header}
          width={16}
          height={6}
          onAction={isFollowing ? () => {} : () => {}}
          actionText={isFollowing ? 'Following' : 'Follow'}
          fontSize={13}
        /> */}
      </View>
    </View>
  )
}

FriendProfileCardLayout.propTypes = {
  result: PropTypes.object.isRequired,
  onShowProfile: PropTypes.func.isRequired,

}

const styles = StyleSheet.create({
  searchResultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchResultsUserInfoContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  searchResultsUserProfileImageContainer: {},
  searchResultsUserProfileImage: {
    width: horizontalScale(55),
    height: horizontalScale(55),
    borderRadius: horizontalScale(55)
  },
  searchResultsUserProfileInfoContainer: {
    justifyContent: 'center',
    gap: 4
  },
  searchResultsUserProfileInfoName: {
    fontSize: fontScale(16),
    fontFamily: getFontFamily('PlusJakartaSans', '700'),
    lineHeight: fontScale(21.8),
    textTransform: 'capitalize',
  },
  searchResultsUserProfileMoreInfo: {
      fontSize: fontScale(14),
      fontFamily: getFontFamily('PlusJakartaSans', '500'),
      lineHeight: fontScale(19),
      textTransform: 'capitalize'
  },
});

export default FriendProfileCardLayout
