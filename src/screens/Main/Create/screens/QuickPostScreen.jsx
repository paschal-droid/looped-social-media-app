import { useIsFocused } from '@react-navigation/native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppState, Linking, Platform, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Video from 'react-native-video'
import { Camera, Templates, useCameraDevice, useCameraFormat, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera'
import { CameraCountdownTimer, Icon, InAppNotification, PostSegmentedControl, SelectInput, StoryType, VideoTimeInterval } from '../../../../components'
import PushNotificationContext from '../../../../context/PushNotificationContext'
import { useTheme } from '../../../../context/ThemeContext'
import { formattedMedia, formatTime, timerOptions } from '../../../../data/dataConstants'
import { Routes } from '../../../../navigation/Routes'
import { globalStyles } from '../../../../themes'
import { color, getFontFamily, scaling } from '../../../../themes/themes'
import ImageCropPicker from 'react-native-image-crop-picker'

const { fontScale, horizontalScale, verticalScale } = scaling


const QuickPostScreen = ({navigation, route}) => {
    // hooks
    const { theme } = useTheme()
    const {screenIndex} = route.params
    const { setNotification } = useContext(PushNotificationContext)
    const { hasPermission } = useCameraPermission()
    const { hasPermission: hasMic, requestPermission: reqMic } = useMicrophonePermission()
    const camera = useRef(null)
    const {top} = useSafeAreaInsets()
    const ios = Platform.OS === 'ios'
    const [currentCamera, setCurrentCamera] = useState('back');
  
    // Video States
    const [recordedVideo, setRecordedVideo] = useState(null)
    const [capturedImage, setcapturedImage] = useState(null)
    const [capturedMediaList, setCapturedMediaList] = useState([])
    const [isRecording, setIsRecording] = useState(false)
    const [recordedTime, setRecordedTime] = useState(15000);
    const [remainingTime, setRemainingTime] = useState(null);
    const [timerInterval, setTimerInterval] = useState(null);
    const [totalPlaybackDuration, setTotalPlaybackDuration] = useState(0); // Total duration in seconds
    const [playbackRemainingTime, setPlaybackRemainingTime] = useState(0); // Remaining time in seconds
    
    const [selectedTimer, setSelectedTimer] = useState(0)
    const [showTimer, setShowTimer] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false)
    

    const [flash, setFlash] = useState('off')
    const isFocused = useIsFocused()
    const appState = AppState.currentState
    const isActive = isFocused && appState === "active"
    
    const device = useCameraDevice(currentCamera, { physicalDevices: ['ultra-wide-angle-camera', 'wide-angle-camera', 'telephoto-camera'] })
    const format = useCameraFormat(device, [...Templates.Snapchat, { photoHdr: true },{ videoHdr: true },])
    const cameraProps = selectedMedia === 0 ? {photo: true} : {video: true, audio: true, photo: true}
    const [selectedMedia, setSelectedMedia] = useState(screenIndex ? screenIndex : 0)
    const [selectedStoryType, setSelectedStoryType] = useState('photo')
    
    
    //todo GET THE PERMISSION TO USE THE USER'S DEVICE CAMERA
    useEffect(() => {
        async function getPermission() {
          const permission = await Camera.requestCameraPermission();
          const audioPermission = await Camera.requestMicrophonePermission()
          if (permission === 'denied') await Linking.openSettings();
          if (audioPermission === 'denied') await Linking.openSettings();
        }
        getPermission();
    }, [hasPermission, hasMic]);
    
    const proceedToEdit = () => {
        if(capturedImage) {
            setCapturedMediaList([capturedImage])
        }
        if(recordedVideo) {
            setCapturedMediaList([recordedVideo])
        }
    }


    const setTimer = () => {
        setShowDropdown(prev => !prev)
    }
    const rotateCamera = () => {
        setCurrentCamera((prev) => {
            if (prev === 'back') {
              return 'front'
            } else {
              return 'back'
            }
        })
    }
    const useFlash = () => {
        setFlash((currVal) => currVal === 'off' ? 'on' : 'off')
    }
    const retakeMedia = () => {
        setcapturedImage(null)
        setRecordedVideo(null)
    }
    const captureMedia = async () => {
        try {
            if (selectedMedia === 0) {
                if (camera.current !== null) {
                    const photo = await camera.current.takePhoto({
                      flash: flash
                    });                    
                    setcapturedImage({uri: `file://${photo.path}`, type: 'image', capturingMediaType: 'post',});
                }
            } else if (selectedMedia === 1) {
                if (selectedStoryType === 'photo') {
                    if (camera.current !== null) {
                        const photo = await camera.current.takePhoto({
                          flash: flash
                        });
                        setcapturedImage({uri: `file://${photo.path}`, type: 'image', capturingMediaType: 'story',});
                    }
                } else {
                    setRemainingTime(Math.floor(recordedTime / 1000))
                    startRecording()
                }
            } else {
                setRemainingTime(Math.floor(recordedTime / 1000))
                startRecording()
            }
          } catch (error) {
            if(__DEV__) {
                console.error('Error capturing media:', error);
            }
        }        
    }

    const handleCapturing = () => {
        if(selectedTimer === 0) {
            captureMedia()
        } else {
            setShowTimer(true)
        }
    }
    const uploadMedia = () => {
        ImageCropPicker.openPicker({
            mediaType: selectedMedia === 0 ? 'photo' : selectedMedia === 2 ? 'video' : 'any',
            multiple: selectedMedia !== 2, // Allow multiple selection except for video
          }).then(media => {
            if (selectedMedia != 2) {
                const sortedMedia = formattedMedia(media, selectedMedia)
                setCapturedMediaList(sortedMedia)
            } else {
                const selectedVideo = {
                    type: 'video',
                    capturingMediaType: 'highlight',
                    uri: media.path,
                    duration: media.duration,
                }
                setCapturedMediaList([selectedVideo])
            }
            
            
        }).catch((error) => {
            if(__DEV__) {
                console.log(error)
            }
        }
        );
    }

    const sideOptionList = [
        {id: 'all', icon: 'timer', trigger: setTimer, text: 'Timer'},
        {id: 'all', icon: 'rotate-camera', trigger: rotateCamera, text: 'Flip'},
        {id: 'all', icon: flash === 'on' ? 'bolt' : 'flash-off', trigger: useFlash, text: 'Flash'},
        {id: 'video', icon: 'refresh', trigger: retakeMedia, text: 'Retake'},
    ]

    //! code for recording video and stopping it
    const startRecording = async () => {
        if (!camera.current) {
            return;
          }
          if(isRecording) {
            await stopRecording()
            return;
          }
          setIsRecording(true)
          camera.current.startRecording({
            flash: flash,
            onRecordingFinished: (video) => {
              setIsRecording(false)
              setRecordedVideo({uri: 'file://' + video.path, duration: video.duration, resolution: video.height/video.width, type: 'video', capturingMediaType: 'highlight',})
            },
            onRecordingError: (error) => {
                if(__DEV__) {
                    console.log(error);
            
                }
              setIsRecording(false)
            }
          }),
          setTimerInterval(setInterval(() => {
            setRemainingTime(time => time - 1);
          }, 1000));
    };
      
      const stopRecording = async () => {
        if (!camera.current) {
            return;
          }
          try {
            await camera.current.stopRecording();
            setIsRecording(false);
            clearInterval(timerInterval);
          } catch (error) {
            if(__DEV__) {
                console.error('Failed to stop recording:', error);
            
            }
        }
      };
      
      useEffect(() => {
        const checkTime = async () => {
            if(remainingTime === 0) {
                await stopRecording()
            }
        }
        checkTime()
      }, [remainingTime])
    
      useEffect(() => {
        if(capturedMediaList.length > 0) {
            ImageCropPicker.clean()
            setCapturedMediaList([])
            setcapturedImage(null)
            setRecordedVideo(null)
            setSelectedTimer(0)
            setRecordedTime(15000)
            navigation.navigate(Routes.QuickEdit, {capturedMediaList})
        }
      }, [capturedMediaList])
    
    

    return (
        <>
            <InAppNotification />
            <View style={[globalStyles.appScreen, {backgroundColor: theme.background}]}>
                <StatusBar translucent={true} barStyle={'light-content'} backgroundColor={'transparent'} />
                {/* Countdown timer component */}
                {showTimer && selectedTimer > 0 && <CameraCountdownTimer 
                    initialTime={selectedTimer}
                    onComplete={() => {
                      setShowTimer(false);
                      setSelectedTimer(0)
                      captureMedia();
                    }}
                />}

                {/* Normal Component */}
                <View style={[styles.cameraContainer, {paddingTop: ios ? top : top+10}]}>
                    <View style={[styles.topCameraContainer]}>
                        <View style={styles.iconBox}>
                            <Icon onPress={() => { navigation.navigate(Routes.Home)}} name='close2' color={color.white} size={fontScale(32)} />
                        </View>
                        <View style={styles.topOptionContainer}>
                            {selectedMedia === 1 && <StoryType setStoryType={setSelectedStoryType} />}
                        </View>
                        <View style={styles.iconBox}>
                            {(capturedImage || recordedVideo) && <Icon onPress={proceedToEdit} name='check' color={color.white} size={fontScale(32)} />}
                        </View>
                    </View>
                    
                    {(!capturedImage && !recordedVideo) && (
                        <View style={[styles.sideCameraContainer]}>
                            {selectedMedia === 0 ? (
                                <>
                                    <SelectInput
                                        data={timerOptions}
                                        placeholder={`${selectedTimer}s`}
                                        handleSelection={(val) => setSelectedTimer(val)}
                                        showDropdown={showDropdown}
                                    />
                                    {sideOptionList.filter(item => item.id !== 'video').map((option, index) => (
                                        <Pressable style={styles.option} onPress={option.trigger} key={index}>
                                            <Icon name={option.icon} color={color.white} size={fontScale(32)} />
                                            <Text style={[styles.text]}>{option.text}</Text>
                                        </Pressable>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <SelectInput
                                        data={timerOptions}
                                        placeholder={`${selectedTimer}s`}
                                        showDropdown={showDropdown}
                                        handleSelection={(val) => setSelectedTimer(val)}
                                    />
                                    {sideOptionList.map((option, index) => (
                                        <Pressable style={styles.option} onPress={option.trigger} key={index}>
                                            <Icon name={option.icon} color={color.white} size={fontScale(32)} />
                                            <Text style={[styles.text]}>{option.text}</Text>
                                        </Pressable>
                                    ))}

                                </>
                            )}

                        </View>
                    )}

                    {/* To show the user the time remaining */}
                    {isRecording && <View style={styles.duration}>
                        <Text style={styles.durationText}>-{formatTime(remainingTime)}</Text>
                        </View>
                    }

                    {(capturedImage || recordedVideo) ? (
                        <View style={styles.previewContainer}>
                            {recordedVideo && <View style={styles.duration}><Text style={styles.durationText}>{formatTime(playbackRemainingTime)}</Text></View>}
                            <View style={styles.previewActionContainer}>
                                <TouchableOpacity onPress={retakeMedia} style={[styles.previewAction, {backgroundColor: '#35383F'}]}>
                                    <Text style={styles.previewActionText}>Retake</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={proceedToEdit} style={[styles.previewAction]}>
                                    <Text style={styles.previewActionText}>Proceed to edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <>
                            {!isRecording && (
                                <View style={[styles.bottomCameraContainer]}>
                                <View style={styles.videoRecordTimeContainer}>
                                    {selectedMedia > 0 && <VideoTimeInterval setSelectedRecordingTime={setRecordedTime} />}
                                    <PostSegmentedControl selectedIndex={selectedMedia} setSelectedIndex={setSelectedMedia} />
                                </View>
                                <View style={styles.cameraActionContainer}>
                                    <View style={styles.sideOptionContainer}>
                                        <Icon name='effects' color={color.primary} size={fontScale(32)} />
                                        <Text style={styles.optionText}>Effects</Text>
                                    </View>
                                    <TouchableOpacity onPress={handleCapturing}>
                                        <View style={[styles.cameraShutterContainer]}>
                                            {selectedMedia > 0 && <Icon name='video-filled-white' color={color.white} size={fontScale(32)} />}
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={uploadMedia} style={styles.sideOptionContainer}>
                                        <Icon name='upload' color={color.white} size={fontScale(32)} />
                                        <Text style={styles.optionText}>Upload</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            )}
                        </>
                    )}
                {/* Camera Screen */}
                    <View style={[StyleSheet.absoluteFill, {zIndex: -10,}]}>
                        {(recordedVideo || capturedImage) ? (
                            <>
                                {capturedImage ? (
                                    <FastImage source={{uri: capturedImage?.uri}} style={StyleSheet.absoluteFillObject} />
                                ) : (
                                    <Video 
                                        source={recordedVideo} 
                                        style={[StyleSheet.absoluteFillObject]} 
                                        resizeMode='cover' 
                                        repeat
                                        onLoad={(meta) => {
                                            const durationInSeconds = meta.duration;
                                            setTotalPlaybackDuration(durationInSeconds);
                                            setPlaybackRemainingTime(durationInSeconds);
                                        }}
                                        onProgress={(progress) => {
                                            const currentTime = progress.currentTime;
                                            const remaining = totalPlaybackDuration - currentTime;
                                            setPlaybackRemainingTime(Math.max(0, remaining)); // Ensure it doesn’t go below 0
                                        }}
                                    />
                                )}
                            </>
                        ) : (
                        <Camera
                            ref={camera}
                            style={StyleSheet.absoluteFillObject}
                            device={device}
                            resizeMode='cover'
                            orientation='portrait'
                            format={format}
                            isActive={isActive}
                            photo
                            video
                            audio
                            videoHdr={format.supportsVideoHdr}
                            photoHdr={format.supportsPhotoHdr}
                        /> )}                      
                    </View>
                </View>
            </View>
        </>
  )
}


const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        paddingHorizontal: horizontalScale(22),
        justifyContent: 'space-between',
        paddingBottom: horizontalScale(15)
    },
    topCameraContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconBox: {
        width: horizontalScale(40),
    },
    addMusicContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.blackRGBA45,
        borderRadius: horizontalScale(20),
        padding: horizontalScale(8),
        gap: 4
    },
    text: {
        fontFamily: getFontFamily('FuturaPT', '500'),
        fontSize: fontScale(18),
        color: color.white
    },
    sideCameraContainer: {
        position: 'absolute',
        alignItems: 'center',
        gap: 25,
        top: '25%',
        right: '5%',
    },
    option: {
        gap: 2,
        width: horizontalScale(50),
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomCameraContainer: {
        gap: 30,        
    },
    cameraActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        width: '80%'
    },
    sideOptionContainer: {
        gap: 2,
        alignItems: 'center'
    },
    optionText: {
        fontFamily: getFontFamily('Poppins', '200'),
        fontSize: fontScale(12),
        color: color.white
    },
    cameraShutterContainer: {
        backgroundColor: color.primary,
        width: horizontalScale(55),
        height: horizontalScale(55),
        borderRadius: horizontalScale(60),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: color.white
    },
    selectMoreOptions: {
        width: horizontalScale(50),
        alignItems: 'center'
    },
    videoRecordTimeContainer: {
        gap: 20
    },
    topOptionContainer: {
        gap: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    previewContainer: {
        gap: 20
    },
    durationText: {
        fontFamily: getFontFamily('FuturaPT', '700'),
        fontSize: fontScale(30),
        color: color.white,
        letterSpacing: 0.4
    },
    previewActionContainer: {
        flexDirection: 'row',
        gap: 20
    },
    previewAction: {
        flex: 1,
        paddingVertical: horizontalScale(18),
        paddingHorizontal: horizontalScale(16),
        borderRadius: 100,
        backgroundColor: color.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewActionText: {
        fontFamily: getFontFamily('FuturaPT', '600'),
        fontSize: fontScale(17),
        textTransform: 'capitalize',
        color: color.white,
        letterSpacing: 0.4
    },
    duration: {
        backgroundColor: color.segmentedControl,
        paddingHorizontal: horizontalScale(15),
        paddingVertical: horizontalScale(5),
        borderRadius: 10,
        alignSelf: 'center'
    },

})

export default QuickPostScreen