import { FlatList, StyleSheet, Text } from 'react-native'
import React from 'react'

import { scaling, getFontFamily } from '../../themes/themes'
import { useSelector } from 'react-redux'

import { useChannelsContext,} from 'stream-chat-react-native';
import { Routes } from '../../navigation/Routes'
import { useTheme } from '../../context/ThemeContext'
import ChatListItem from './ChatListItem'
import { useNavigation } from '@react-navigation/native'
import AppLoader from '../Loaders/AppLoader';

  const {horizontalScale, verticalScale, fontScale} = scaling



const ChatChannelList = () => {
    // 1. Get channels and pagination
  const { channels, loadNextPage, refreshing, refreshList } = useChannelsContext();
  const {usersThatYouFollow} = useSelector(state => state.users)
  const {currentUser} = useSelector(state => state.user)
  const {theme} = useTheme()
  const navigation = useNavigation()  
  
  const renderItem = ({ item: channel }) => {
    const { messages, last_message_at, unreadCount } = channel?.state;
    const lastMessage = messages?.[messages.length - 1]?.text || 'Be the first to say Hello 👋';
    const memberID = channel?.data.created_by.id === currentUser.id ? channel?.id?.split('_')[1] : channel?.id?.split('_')[0]
    const follower = usersThatYouFollow.find((user) => user.uid === memberID)
    const isMyMessage = messages?.at(-1)?.id?.split('-')[0] === currentUser.id || false 
    
    if(!channel || !follower) return null
    
        
    return (
        <ChatListItem 
            onSelectChannel={() => navigation.navigate(Routes.ChatRoom, { channelID: channel.id })}
            unreadCount={unreadCount}
            follower={follower}
            isMyMessage={isMyMessage}
            lastMessage={lastMessage}
            last_message_at={last_message_at ? last_message_at : null}
        />
    )
  }


  
    return (
        <FlatList
            data={channels}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onEndReached={loadNextPage} // Pagination
            onRefresh={refreshList} // Pull-to-refresh
            refreshing={refreshing}
            ListEmptyComponent={<AppLoader />}
            contentContainerStyle={{ flexGrow: 1, gap: 16}}
    />
    )
}


const styles = StyleSheet.create({
    chatContainer: {
        flexDirection: 'row',
        paddingHorizontal: horizontalScale(22),
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      chatuserInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      chatUserProfile: {
        width: horizontalScale(50),
        height: horizontalScale(50),
      },
      chatUserProfileImage: {
        aspectRatio: 1/1,
        width: '100%',
        borderRadius: horizontalScale(50),
      },
      onlineIndicator: {
        width: horizontalScale(10),
        height: horizontalScale(10),
        borderRadius: horizontalScale(10),
        position: 'absolute',
        bottom: -1,
        left: horizontalScale(35),
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
      chatDeliveryTimeContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: 5
      },
      chatMessageTime: {
        fontFamily: getFontFamily('PlusJakartaSans', '400'),
        fontSize: fontScale(13),
        textTransform: 'uppercase'
      },
      chatMessageCount: {
        width: horizontalScale(18),
        height: horizontalScale(18),
        borderRadius: horizontalScale(20),
        alignItems: 'center',
        justifyContent: 'center'
      },
      chatMessageCountText: {
        fontFamily: getFontFamily('FuturaPT', '600'),
        fontSize: fontScale(14),
      },
})



export default ChatChannelList