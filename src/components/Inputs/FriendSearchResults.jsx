import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { scaling, getFontFamily, color} from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'
import { useSelector } from 'react-redux'
import UserActionButton from '../Buttons/UserActionButton'
import FastImage from 'react-native-fast-image'
import { followUser, unFollowUser } from '../../api/user-functions'


const {horizontalScale, verticalScale, fontScale} = scaling


const FriendSearchResults = (props) => {
  const {following} = useSelector((state) => state.user)
  const {theme} = useTheme()
  const [isFollowing, setIsFollowing] = useState(false)


  useEffect(() => {
    if(following.indexOf(props.result.id) > -1){
      setIsFollowing(true)
    } else {
      setIsFollowing(false)
    }
  }, [following])

  const onFollow = async () => {
    await followUser(props.result.id)

  }

  const onUnfollow = async () => {
    await unFollowUser(props.result.id)
    
  }

    
  return (
    <View style={[styles.searchResultsContainer]}>
      <Pressable onPress={props.onShowProfile} style={[styles.searchResultsUserInfoContainer]}>
          <View style={[styles.searchResultsUserProfileImageContainer]}>
              <FastImage priority={FastImage.priority.high} source={{ uri: props.result?.profileImages[0] }} style={[styles.searchResultsUserProfileImage]} />
          </View>
          <View style={[styles.searchResultsUserProfileInfoContainer]}>
              <Text numberOfLines={1} style={[styles.searchResultsUserProfileInfoName, { color: theme.header }]}>{props.result.firstName} {props.result.lastName}</Text>
              <Text style={[styles.searchResultsUserProfileMoreInfo, { color: theme.paragraph }]}>{props.result?.occupation}</Text>
          </View>
      </Pressable>

      <View style={[styles.userFollowingActionContainer]}>
        <UserActionButton
          backgroundColor={isFollowing ? theme.background : theme.primaryColor}
          borderColor={isFollowing ? theme.primaryColor : theme.background}
          borderWidth={1.5}
          textColor={isFollowing ? theme.primaryColor : color.whiteRGBA90}
          width={16}
          height={6}
          useIcon={false}
          onAction={isFollowing ? onUnfollow : onFollow}
          actionText={isFollowing ? 'Following' : 'Follow'}
          fontSize={13}
        />
      </View>
    </View>
  )
}

FriendSearchResults.propTypes = {
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

export default FriendSearchResults
