import { StyleSheet, View } from 'react-native'
import React from 'react'

import { scaling, color } from '../../themes/themes'
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'
import useUserPresence from '../../utils/useUserPresence'
import { useMessageContext, useTheme } from 'stream-chat-react-native'


const {horizontalScale} = scaling



const ChatAvatar = () => {
  
    const { message } = useMessageContext(); 
    const { theme: {messageSimple : {avatarWrapper}} } = useTheme();
    const {currentUser} = useSelector(state => state.user)
    const isOnline = useUserPresence(message.user_id);
    
  
  return (
      <View style={[styles.avatarContainer, message.user_id === currentUser.id ? avatarWrapper.rightAlign : avatarWrapper.leftAlign] }>
        <FastImage
          priority={FastImage.priority.high}
          source={{ uri: message.user.profileImage}}
          style={styles.avatar}
        />
        {/* Online status indicator */}
        {isOnline && <View style={[styles.onlineIndicator]} />}
      </View>

  )
}

ChatAvatar.propTypes = {
    
}

export default ChatAvatar

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8
  },
    avatarContainer: {
        borderRadius: horizontalScale(32),
        justifyContent: 'center',
        width: horizontalScale(32),
        height: horizontalScale(32),
        alignItems: 'center',    
    },
    avatar: {
        aspectRatio: 1/1,
        width: '100%',
        borderRadius: horizontalScale(100)
    },
    
    onlineIndicator: {
        position: 'absolute',
        bottom: horizontalScale(-2),
        left: horizontalScale(20),
        width: horizontalScale(6),
        height: horizontalScale(6),
        borderRadius: horizontalScale(6),
        backgroundColor: color.success,
    },
    
})