import { useCalls } from '@stream-io/video-react-native-sdk';
import React, {createContext, useEffect} from 'react'
import { Pressable, StyleSheet, Text } from 'react-native';
import { Routes } from '../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { useScreen } from './ScreenContext';
import { ActiveCallBanner } from '../components';

const CallContext = createContext()

export const CallProvider = ({children}) => {
    const calls = useCalls()
    const call = calls[0]
    const navigation = useNavigation()

    const {currentScreen} = useScreen()

    const isOnCallScreen =  currentScreen === Routes.ActiveCall


    useEffect(() => {
        if(!call) return;

        const callingState = call.state.callingState

        if(!isOnCallScreen && callingState === 'ringing') {
          navigation.navigate(Routes.Chat, {screen: Routes.ActiveCall})
        }

    }, [call, isOnCallScreen])
    

    return (
        <CallContext.Provider value={{ call }}>
          {call && !isOnCallScreen && <ActiveCallBanner callId={call.id} />}
          {children}
        </CallContext.Provider>
      );
}

const styles = StyleSheet.create({
    
})

export default CallContext