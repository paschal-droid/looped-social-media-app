import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth'
import { useTheme } from '../../context/ThemeContext'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { color, getFontFamily, scaling } from '../../themes/themes'
import FastImage from 'react-native-fast-image'
import Icon from '../Icon/Icon'
import NavPressable from '../Patterns/NavPressable'
import { useSelector } from 'react-redux'
import useUserPresence from '../../utils/useUserPresence'
import { useChatContext } from 'stream-chat-react-native'
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import { generateUniqueImageNameV2 } from '../../data/dataConstants'

const {fontScale, verticalScale, horizontalScale} = scaling


const ChatRoomHeader = () => {
  const {theme} = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  const ios = Platform.OS === 'ios'
  const {top} = useSafeAreaInsets()
  const {usersThatYouFollow} = useSelector(state => state.users)
  const {currentUser} = useSelector(state => state.user)
  const { client : ChatClient } = useChatContext();
  const videoClient = useStreamVideoClient()
  
  
  // const channel = ChatClient.channel('messaging', route.params.channelID)
    
  const memberId =  auth().currentUser.uid ===  route.params.channelID.split('_')[0] ? route.params.channelID.split('_')[1] : route.params.channelID.split('_')[0]

  const isOnline = useUserPresence(memberId);

  const follower = usersThatYouFollow.find((follower) => follower.uid === memberId)


  const createCall = async ({type}) => {
    if (!videoClient) return;

    // Create call object
    const call = videoClient.call(type, generateUniqueImageNameV2(type));
    await call.create({
      data: {
        members: [{ user_id: currentUser.id, role: 'call_member'}, {user_id: memberId, role: 'call_member'}], // Who to call
      },
      ring: true, // Ring the callee's device
    
    });
    // Navigate to active call screen but no need to do that as our CallContext detects and then handles the navigation
  }
  

  return (
    <View style={[styles.chatRoomHeaderContainer, {paddingTop: ios ? top+10 : top+20, backgroundColor: theme.background}]}>
      <StatusBar backgroundColor={theme.backgroundColor} barStyle={theme.statusBarTextColor} />
      <View style={[styles.chatRoomInfo]}>
        <NavPressable icon={'arrow-left'} onPress={() => navigation.goBack()} />
        <View style={[styles.chatuserInfoContainer]}>
          <View style={[styles.chatUserProfile]}>
            <FastImage priority={FastImage.priority.high} style={styles.chatUserProfileImage} source={{ uri: follower?.profileImages[0] }} />
          </View>
          {isOnline && <View style={[styles.onlineIndicator, {backgroundColor: theme.success}]} />}
          <View style={[styles.chatUserProfileInfo]}>
            <Text style={[styles.chatUserProfileInfoTextMain, { color: theme.header }]}>{follower?.firstName}</Text>
            {isOnline && <Text style={[styles.chatUserProfileInfoText, { color: theme.subText }]}>Online Now</Text>}
          </View>
        </View>
      </View>

      {/*Header Right component  */}
      <View style={[styles.chatActions]}>
        <Icon style={styles.chatActionIcon} color={theme.header} size={fontScale(28)} onPress={() => createCall({type: 'audio_room'})} name='phone' />
        <Icon style={styles.chatActionIcon} color={theme.header} size={fontScale(28)} onPress={() => createCall({type: 'default'})} name='video1' />
      </View>
    </View>
  )
}

export default ChatRoomHeader

const styles = StyleSheet.create({
  chatRoomHeaderContainer: {
    borderBottomWidth: 0.4,
    borderBottomColor: color.Grey,
    paddingHorizontal: horizontalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  chatRoomInfo: {
    flexDirection: 'row',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: horizontalScale(10)
  },
  chatuserInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatUserProfile: {
    width: horizontalScale(30),
    borderRadius: horizontalScale(30),
    aspectRatio: 1,
    overflow: 'hidden',
    position: 'relative'
  },
  chatUserProfileImage: {
    width: '100%',
    height: '100%',
  },
  chatUserProfileInfo: {
    alignItems: 'flex-start'
  },
  chatUserProfileInfoTextMain: {
    fontFamily: getFontFamily('PlusJakartaSans', '700'),
    fontSize: fontScale(18),
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  chatUserProfileInfoText: {
    fontFamily: getFontFamily('PlusJakartaSans', '400'),
    fontSize: fontScale(12),
    letterSpacing: 0.2,
  },
  onlineIndicator: {
    width: horizontalScale(6),
    height: horizontalScale(6),
    borderRadius: horizontalScale(10),
    position: 'absolute',
    bottom: 0,
    left: horizontalScale(20),
  },
  chatActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    paddingBottom: horizontalScale(10)

  },
  chatActionIcon: {
    width: horizontalScale(55),
    height: horizontalScale(55),
    textAlignVertical: 'center',
    textAlign: 'right',
  },
})