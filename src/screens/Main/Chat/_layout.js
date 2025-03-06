import React from 'react'
import { StyleSheet } from 'react-native'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ChatHomeHeader, ChatRoomHeader } from '../../../components'
import { Routes } from '../../../navigation/Routes'
import ChatHome from './screens/ChatHome'
import ChatRoom from './screens/ChatRoom'
import ActiveCall from './screens/UI/ActiveCall'


const Stack = createNativeStackNavigator()

const Chat = ({navigation}) => {
  
  return (
    <Stack.Navigator screenOptions={options} initialRouteName='ChatHome'>
      <Stack.Screen options={{ animation: 'slide_from_right', header: () => <ChatHomeHeader /> }} component={ChatHome} name={Routes.ChatHome} />
      <Stack.Screen options={{ animation: 'slide_from_left',  header: () => <ChatRoomHeader />}} component={ChatRoom} name={Routes.ChatRoom} />
      <Stack.Screen options={{ animation: 'slide_from_right', headerShown: false}} component={ActiveCall} name={Routes.ActiveCall} />
    </Stack.Navigator>
  )
}

const options = {
  tabBarShowLabel: false,
  tabBarHideOnKeyboard: true,
  animation: 'slide_from_bottom',
}

const styles = StyleSheet.create({})

export default Chat
