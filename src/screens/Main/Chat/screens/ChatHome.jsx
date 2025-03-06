import {StatusBar, StyleSheet, View, FlatList, Pressable, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useTheme } from '../../../../context/ThemeContext'
import { globalStyles } from '../../../../themes'

import { color, scaling } from '../../../../themes/themes'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { Avatar, ChatChannelList } from '../../../../components'
import { createChatChannel } from '../../../../utils/stream-chat-client-functions'
import { ChannelList, useChatContext } from 'stream-chat-react-native'
import CallContext from '../../../../context/CallContext'
import { Routes } from '../../../../navigation/Routes'

const {verticalScale, horizontalScale, fontScale} = scaling

const ChatHome = ({navigation}) => {
  const {theme} = useTheme()
  const {usersThatYouFollow} = useSelector(state => state.users)
  const {currentUser} = useSelector(state => state.user)
  const {client} = useChatContext()

  const sort = { last_updated: -1 };

  const checkOrCreateChannel = (member) => {
    console.log(member.uid);
    
    createChatChannel(member, client, navigation)
  }
   

  return (
    <SafeAreaView style={[{ backgroundColor: theme.background},styles.container, globalStyles.appScreen]}>
      <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />
      
      {/* List of followers */}
      <View style={[styles.followersListContainer]}>
        <FlatList
          horizontal
          data={usersThatYouFollow}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 15, borderWidth: 2, borderColor: 'red'}}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <Avatar
              userID={item.uid}
              url={item.profileImages[0]}
              enableName={true}
              name={item.firstName}
              onAvatarPress={() => checkOrCreateChannel(item)}
            />
          )}
        />
      </View>

      {/* List of chats */}
      <ChannelList
        sort={sort}
        List={ChatChannelList}
        filters={{ type: 'messaging', members: { $in: [currentUser.id] } }}
        onSelect={(channel) => {}}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(18),
    gap: 30
  },
  followersListContainer: {
    paddingHorizontal: horizontalScale(18)
  },
  incomingCallContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.primary,
},
})

export default ChatHome
