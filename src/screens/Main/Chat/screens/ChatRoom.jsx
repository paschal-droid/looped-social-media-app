import {StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../../../context/ThemeContext'

import { scaling } from '../../../../themes/themes'
import { Channel, MessageInput, MessageList, useChatContext } from 'stream-chat-react-native'

const {verticalScale, horizontalScale, fontScale} = scaling

import { AppLoader, ChatAvatar, ChatInput } from '../../../../components'


const ChatRoom = ({route}) => {
  const {theme} = useTheme()
  const {channelID} = route.params
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      const newChannel = client.channel('messaging', channelID);
      await newChannel.watch(); // Ensure the channel is active
      setChannel(newChannel);
    };

    fetchChannel();
  }, [channelID]);

  if (!channel) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <AppLoader />
      </View>
    );
  }

  return (
    <Channel MessageAvatar={ChatAvatar} channel={channel} Input={ChatInput}>
      <MessageList />
      <MessageInput  />
    </Channel>
  );
};


export default ChatRoom
