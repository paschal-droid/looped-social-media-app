import { Pressable, StyleSheet, View } from 'react-native'
import React, { useCallback } from 'react'

import { scaling, color } from '../../themes/themes'

import { useTheme } from '../../context/ThemeContext'
import { BlurView } from '@react-native-community/blur'
import { ReactionsButton, useCalls, useCallStateHooks } from '@stream-io/video-react-native-sdk'
import Icon from '../Icon/Icon'
import CallDurationBadge from './CallDurationBadge'

  const {horizontalScale, verticalScale, fontScale} = scaling

const VideoCallControls = () => {
    const {theme} = useTheme()
    const calls = useCalls()
    const call = calls[0]
    const { useMicrophoneState, useCameraState } = useCallStateHooks();


    const { isMute: microphoneMuted } = useMicrophoneState();
    const { isMute: cameraMuted } = useCameraState();

    const toggleAudioMuted = async () => {
        await call?.microphone.toggle();
    };
    const toggleVideoMuted = async () => {
        await call?.camera.toggle();
    };

    const toggleCameraFacingMode = async () => {
        await call?.camera.flip();
    };

    const hangupCallHandler = useCallback(async () => {
        try {
          await call?.endCall()
        } catch (error) {
            if(__DEV__){
                console.log("Error Ending the Call", error);
            }
        }
      }, [call]);


  return (
    <View style={{gap: 20, position: 'absolute', bottom: verticalScale(14), alignSelf: 'center'}}>
    <CallDurationBadge />
    <View style={[styles.controlContainer]}>
      <View style={[ styles.fill, {backgroundColor: 'rgba(0,0,0, 0.2)'}]} />

        {/* Muting/unmuting the audio */}
        <Pressable style={[styles.callActionIcon]} onPress={toggleAudioMuted}>
            <View style={[ {...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0, 0.05)'}]} />
            <BlurView blurAmount={5} overlayColor="" blurType="thinMaterialDark" style={styles.fill} />
            <Icon name={!microphoneMuted ? 'microphone' : 'mic-off'} size={fontScale(22)} color={color.white} />
        </Pressable>

        {/*  Toggling the Video on/off */}
        {call.type != 'audio_room' && 
        <Pressable onPress={toggleVideoMuted} style={[styles.callActionIcon]}>
            <BlurView blurAmount={5} overlayColor="" blurType="thinMaterialDark" style={styles.fill} />
            <View style={[ {...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0, 0.05)'}]} />
            <Icon name={!cameraMuted ? 'video1' : 'video-off'} size={fontScale(22)} color={color.white} />
        </Pressable>
        }

        {/* Ending the call session */}
        <Pressable onPress={hangupCallHandler}>
            <Icon style={[styles.endCallButton, { backgroundColor: theme.error }]} name='end-call' size={fontScale(22)} color={color.white} />
        </Pressable>

        {/* Toggle Camera Direction(front/back) */}
        {call.type != 'audio_room' && 
            <Pressable onPress={toggleCameraFacingMode} style={[styles.callActionIcon]}>
                <BlurView blurAmount={5} overlayColor="" blurType="thinMaterialDark" style={styles.fill} />
                <View style={[ {...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0, 0.05)'}]} />
                <Icon name={'rotate-camera'} size={fontScale(22)} color={color.white} />
            </Pressable>
        }

        {/* Reaction Button */}
        <ReactionsButton />
    </View>
    </View>
  )
}

export default VideoCallControls

const styles = StyleSheet.create({
    controlContainer: {
        flexDirection: 'row',
        gap: 10,
        padding: horizontalScale(12),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: horizontalScale(30),

    },
    fill: {
        ...StyleSheet.absoluteFill,
        borderRadius: horizontalScale(30),
    },
    callActionIcon: {
        width: horizontalScale(45),
        height: horizontalScale(45),
        borderRadius: horizontalScale(60),
        textAlignVertical: 'center',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    endCallButton: {
        width: horizontalScale(60),
        height: horizontalScale(40),
        borderRadius: horizontalScale(50),
        textAlignVertical: 'center',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
})