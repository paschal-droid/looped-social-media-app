import { CallContent, RingingCallContent, StreamCall, useCalls, useCallStateHooks } from '@stream-io/video-react-native-sdk'
import React, { useContext, useEffect } from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ParticipantVideoFallback, VideoCallControls } from '../../../../../components'
import { useTheme } from '../../../../../context/ThemeContext'
import { reactions } from '../../../../../data/dataConstants'
import { Routes } from '../../../../../navigation/Routes'
import { globalStyles } from '../../../../../themes'
import IncomingCall from './IncomingCall'
import OutgoingCall from './OutgoingCall'
import PushNotificationContext from '../../../../../context/PushNotificationContext'
import { useSelector } from 'react-redux'



const ActiveCall = ({navigation}) => {
  const {theme} = useTheme()
  const calls = useCalls()
  const {currentUser}= useSelector(state => state.user)
  const call = calls[0]
  

  const {setNotification} = useContext(PushNotificationContext)

  useEffect(() => {
    const checkCallStatus = setTimeout(() => {
      const members = call.state.members
      const callee = (members || []).map(({ user }) => user).find((user) => user.id !== currentUser.id);

      if(call.state.callingState === 'ringing'){
        setNotification({
          title: `${callee.name.split('_')[0]} is not online`,
          message: 'Try another time, or send a message',
          url: callee.image
        })
        call?.leave()
      }
    }, 20000);

    // Clean up the timer if the component unmounts before 30 seconds.
    return () => clearTimeout(checkCallStatus);
  }, []);

  if (!call) {
    if(navigation.canGoBack) {
      navigation.goBack()
    } else {
      navigation.push(Routes.ChatHome)
    }
    return null
  };

  
  return (
    <SafeAreaView style={[{ backgroundColor: theme.background},styles.container, globalStyles.appScreen]}>
      <StatusBar translucent={true} barStyle={'light-content'} backgroundColor={'transparent'} />
      <StreamCall call={call}>
        <RingingCallContent 
          CallContent={({}) => 
          <CallContent
            ParticipantNetworkQualityIndicator={null} 
            ParticipantLabel={null} 
            ParticipantVideoFallback={ParticipantVideoFallback} 
            supportedReactions={reactions} CallControls={VideoCallControls}  
          />}  
          IncomingCall={IncomingCall} 
          OutgoingCall={OutgoingCall}  
        />
      </StreamCall>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
 
})

export default ActiveCall
