import React, { useCallback } from 'react'
import { Dimensions, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../../../context/ThemeContext'
import { color, getFontFamily, scaling } from '../../../../../themes/themes'

import { BlurView } from '@react-native-community/blur'
import { CallingState, useCallStateHooks, useCalls, useConnectedUser } from "@stream-io/video-react-native-sdk"
import FastImage from 'react-native-fast-image'
import { Icon } from '../../../../../components'
import { globalStyles } from '../../../../../themes'

const {verticalScale, horizontalScale, fontScale} = scaling
const {width} = Dimensions.get('window')

const IncomingCall = () => {
    const {theme} = useTheme()
    const connectedUser = useConnectedUser();
    const calls = useCalls()
    const call = calls[0]
    const { useCallCallingState, useCallMembers } = useCallStateHooks();
    const members = useCallMembers();
    const callingState = useCallCallingState();

    const caller = (members || []).map(({ user }) => user).find((user) => user.id !== connectedUser.id);

    const acceptCallHandler = useCallback(async () => {
      try {
        await call?.join();
      } catch (error) {
        if(__DEV__) {
          console.log("Error accepting Call", error);
            
        }
      }
    }, [call]);

    
    const rejectCallHandler = useCallback(async () => {
      try {
        if (callingState === CallingState.LEFT) {
          return;
        }
        await call?.leave({ reject: true, reason: "decline" });
      } catch (error) {
        if(__DEV__) {
          console.log("Error rejecting Call", error);
            
        }
      }
    }, [call, callingState]);

  return (
    <SafeAreaView style={[globalStyles.appScreen, {backgroundColor: theme.background}]}>
      <StatusBar translucent={true} barStyle={'light-content'} backgroundColor={'transparent'} />
      <View style={[styles.backdropContainer, {justifyContent: call.type === 'audio_room'  ? 'space-between' : 'flex-end' }]}>

        {/* Full Width, background styles */}
        <FastImage priority={FastImage.priority.high} style={[styles.backdropImage]} source={{uri: caller.custom.profileImages[call.type != 'audio_room' ? 0 : 2]}} />
        {call.type === 'audio_room' && <BlurView blurAmount={10} overlayColor="" blurType="thinMaterialDark" style={styles.backdropImage} />}
        <View style={[ {...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0, 0.2)'}]} />

        {/* Actual Components */}
        {call.type === 'audio_room' && (
          <View style={[styles.avatarContainer]}>
            <FastImage
              priority={FastImage.priority.high}
              source={{ uri: caller.image}}
              style={[styles.avatar]}
            />
            <View style={{gap: 8, alignItems: 'center'}}>
              <Text style={[styles.avatarText]}>{caller.name}</Text>
              <Text style={[styles.callTypeText]}>is calling you on {call.type === 'audio_room' ? 'audio' : 'video'}</Text>
            </View>
          </View>
        )}

        <View style={[styles.bottomContainer, call.type !== 'audio_room' && {flex: 0.22, justifyContent: 'space-between'}]}>
          {call.type !== 'audio_room' && <Text style={[styles.avatarText]}>{caller.name}</Text>}
          <View style={[styles.callActionContainer]}>
            {/* Decline Button */}
            <Pressable style={styles.callAction} onPress={rejectCallHandler}>
              <Icon style={[styles.callActionIcon, {backgroundColor: theme.error}]} name='end-call' size={fontScale(24)} color={color.white} />
              <Text style={styles.callActionText}>Decline</Text>
            </Pressable>
            {/* Accept Button */}
            <Pressable style={styles.callAction} onPress={acceptCallHandler}>
              <Icon style={[styles.callActionIcon, {backgroundColor: theme.success}]} name='phone-call' size={fontScale(24)} color={color.white} />
              <Text style={styles.callActionText}>Accept</Text>
            </Pressable>
          </View>
        </View>

      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  backdropContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: verticalScale(40)
  },
  backdropImage: {
    ...StyleSheet.absoluteFill,
  },
  avatarContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(35),
    gap: 17
  },
  avatar: {
    width: width/2.5,
    aspectRatio: 1/1,
    borderRadius: horizontalScale(100)
  },
  avatarText: {
    fontFamily: getFontFamily('FuturaPT', '600'),
    fontSize: fontScale(30),
    color: color.whiteRGBA90,
    textTransform: 'capitalize'
  },
  callTypeText: {
    fontFamily: getFontFamily('FuturaPT', '400'),
    fontSize: fontScale(20),
    color: color.white,
    textTransform: 'capitalize'
  },
  bottomContainer: {
    alignItems: 'center',
  },
  callActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    alignSelf: 'center',
    alignItems: 'center'
  },
  callAction: {
    alignItems: 'center',
    gap: 2
  },
  callActionIcon: {
    width: horizontalScale(60),
    height: horizontalScale(60),
    borderRadius: horizontalScale(70),
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  callActionText: {
    fontFamily: getFontFamily('FuturaPT', '500'),
    fontSize: fontScale(18),
    color: color.white,
    textTransform: 'capitalize'
  },
})

export default IncomingCall
