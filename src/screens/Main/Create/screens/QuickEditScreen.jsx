import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Video from 'react-native-video'
import { useDispatch } from 'react-redux'



import { useTheme } from '../../../../context/ThemeContext'
import { globalStyles } from '../../../../themes'

import { updatePostData } from '../../../../redux/reducers/Post'
import { color, getFontFamily, scaling } from '../../../../themes/themes'


import { CustomModal, Icon, NavPressable } from '../../../../components'

import { BlurView } from '@react-native-community/blur'
import { useIsFocused } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Routes } from '../../../../navigation/Routes'
import AddCaption from './EditOptions/AddCaption'
import AddTags from './EditOptions/AddTags'



const {verticalScale, horizontalScale, fontScale} = scaling

const {width} = Dimensions.get('window')

const QuickEdit = ({navigation, route}) => {
  const {theme} = useTheme()
  const [changeImage, setChangeImage] = useState(0)
  const {capturedMediaList} = route.params
  const [mediaType, setMediaType] = useState('')
  const dispatch = useDispatch()
  const isFocused = useIsFocused()  

  const checkMediaType = useCallback(() => {
    if(capturedMediaList.every(item => item.capturingMediaType === 'story')){
      setMediaType('stories')
    }
    if (capturedMediaList.every(item => item.capturingMediaType === 'highlight')) {
      setMediaType('highlights')
    }
    if (capturedMediaList.every(item => item.capturingMediaType === 'post')) {
      setMediaType('posts')
    }
  }, [])

  useEffect(() => {
    checkMediaType()
  }, [])

  // modal state for options List
  const [openCaption, setOpenCaption] = useState(false)
  const [openTag, setOpenTag] = useState(false)


  const discardChanges = () => {
    navigation.navigate(Routes.QuickPost)
  }

  const proceedToPostPreview = () => {
    dispatch(updatePostData({media: capturedMediaList, type: mediaType}))
    navigation.push(Routes.QuickSummary)
  }

  const resetOptions = () => {
    setOpenCaption(false)
    setOpenTag(false)
  }

  const sideOptionList = [
    {icon: 'alpha-a', trigger: () => setOpenCaption((prev) => !prev), text: 'Write'},
    {icon: 'user-outline', trigger: () => setOpenTag((prev) => !prev), text: 'Tag People'},
    // {icon: 'music', trigger:() => setOpenMusic((prev) => !prev), text: 'Use Music'},
    // {icon: 'location2', trigger: () => setOpenLocation((prev) => !prev), text: 'location'},
]

const widthDivide = capturedMediaList.length > 3 ? capturedMediaList.length : 4

 

  return (
    <SafeAreaView style={[{ backgroundColor: theme.background},styles.container, globalStyles.appScreen]}>
      <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />
        <NavPressable icon={'close2'} onPress={() => navigation.goBack()} />
        <View style={styles.layoutContainer}>

          {/* Main Image display */}
          <TouchableWithoutFeedback onPress={resetOptions}>
            <View style={[styles.imageMainContainer]}>
              {capturedMediaList[changeImage].type === 'video' ? (
                <Video 
                  source={capturedMediaList[changeImage]} 
                  style={[StyleSheet.absoluteFillObject]} 
                  resizeMode='cover'
                  paused={!isFocused} 
                  repeat
                />
              ) : (
                <FastImage resizeMode={FastImage.resizeMode.cover} source={{uri: capturedMediaList[changeImage].uri}} priority={FastImage.priority.high} style={StyleSheet.absoluteFill}  />
              )}
            </View>
          </TouchableWithoutFeedback>

          {/* mini list of selected Images to view */}
          <View style={styles.miniImagesContainer}>
            {capturedMediaList?.map((item, index) => (
              <TouchableOpacity onPress={() => setChangeImage(index)} key={index}>
                <View style={[styles.imageOverlayContainer, {width: width/(widthDivide + 0.8), borderColor: index === changeImage ? color.primary : 'transparent'}]}>
                  <FastImage resizeMode='cover' source={item} priority={FastImage.priority.high} style={StyleSheet.absoluteFillObject} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Edit Action container */}
        <View style={styles.previewContainer}>
          <View style={styles.previewActionContainer}>
            <TouchableOpacity onPress={discardChanges} style={[styles.previewAction, { backgroundColor: '#35383F' }]}>
              <Text style={styles.previewActionText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={proceedToPostPreview} style={[styles.previewAction]}>
              <Text style={styles.previewActionText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Side Edit Options Container */}
        <View style={[styles.sideCameraContainer]}>
          <BlurView blurAmount={10} overlayColor="" blurType="thinMaterialDark" style={StyleSheet.absoluteFill} />
            {sideOptionList.map((option, index) => (
              <Pressable style={styles.option} onPress={option.trigger} key={index}>
                <Icon name={option.icon} color={color.white} size={fontScale(32)} />
                <Text style={[styles.text]}>{option.text}</Text>
              </Pressable>
            ))}
        </View>
      </View>
      {/* Side Options Dynamic Modal Display */}
      {openCaption && 
        <CustomModal openModal={setOpenCaption}>
          <AddCaption openModal={setOpenCaption} />
        </CustomModal>}
      {openTag && 
        <CustomModal openModal={setOpenTag}>
          <AddTags openModal={setOpenTag} />
        </CustomModal>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalScale(15),
    paddingBottom: horizontalScale(15)
  },
  layoutContainer: {
    flex: 1,
    gap: 20,
    marginTop: horizontalScale(5)
  },
  imageMainContainer: {
    flex: 1,
    borderRadius: horizontalScale(15),
    overflow: 'hidden',
  },
  miniImagesContainer: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'center'
  },
  imageOverlayContainer: {
    borderWidth: 4,
    aspectRatio: 1 / 1,
    borderRadius: horizontalScale(15),
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  previewContainer: {
    gap: 20
  },
  previewActionContainer: {
    flexDirection: 'row',
    gap: 15
  },
  previewAction: {
    flex: 1,
    paddingVertical: horizontalScale(16),
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
  sideCameraContainer: {
    position: 'absolute',
    alignItems: 'center',
    gap: 25,
    top: '25%',
    right: '2%',
  },
  option: {
    gap: 2,
    // width: horizontalScale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: getFontFamily('Poppins', '200'),
    fontSize: fontScale(10),
    textTransform: 'capitalize',
    color: color.white
  },

})

export default QuickEdit
