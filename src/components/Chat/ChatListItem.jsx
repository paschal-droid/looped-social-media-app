import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'

import { scaling, color, getFontFamily } from '../../themes/themes'
import FastImage from 'react-native-fast-image'

import useUserPresence from '../../utils/useUserPresence'
import { useTheme } from '../../context/ThemeContext'
import { formatTimeDifference } from '../../data/dataConstants'

const {horizontalScale, verticalScale, fontScale} = scaling


const ChatListItem = ({onSelectChannel, follower, isMyMessage, lastMessage, unreadCount, last_message_at}) => {
    const {theme} = useTheme()
    const isOnline = useUserPresence(follower.uid)
    return (
        <TouchableOpacity onPress={onSelectChannel} style={styles.chatContainer}>
            <View style={[styles.chatuserInfoContainer]}>
                <View style={[styles.chatUserProfile]}>
                    <FastImage priority={FastImage.priority.high} style={styles.chatUserProfileImage} source={{ uri: follower.profileImages[0] }} />
                </View>
                {isOnline && <View style={[styles.onlineIndicator, { backgroundColor: theme.success}]} />}
                <View style={[styles.chatUserProfileInfo]}>
                    <Text style={[styles.chatUserProfileInfoTextMain, { color: theme.header }]}>{follower?.firstName} {follower?.lastName}</Text>
                    <Text numberOfLines={1} style={[styles.chatUserProfileInfoText, { color: theme.chatBubbleText }]}>{isMyMessage ? `You: ${lastMessage}` : lastMessage}</Text>
                </View>
            </View>
            <View style={[styles.chatDeliveryTimeContainer]}>
                {unreadCount != 0 ? (
                    <View style={[styles.chatMessageCount, { backgroundColor: theme.primaryColor}]}>
                        <Text style={[styles.chatMessageCountText, { color: color.white }]}>{unreadCount}</Text>
                    </View>

                ) : <></>}
                {last_message_at && <Text style={[styles.chatMessageTime, { color: theme.chatBubbleText }]}>{lastMessage && formatTimeDifference(Math.floor(new Date(last_message_at).getTime() / 1000) * 1000)}</Text>}
            </View>
        </TouchableOpacity>
    )
}

ChatListItem.propTypes = {
    onSelectChannel: PropTypes.func.isRequired,
    follower: PropTypes.object.isRequired,
    isMyMessage: PropTypes.bool.isRequired,
    lastMessage: PropTypes.string.isRequired,
    unreadCount: PropTypes.number.isRequired,
    last_message_at: PropTypes.any.isRequired
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
        flex: 0.7
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


export default ChatListItem

