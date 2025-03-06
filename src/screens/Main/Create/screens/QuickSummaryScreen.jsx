import { ScrollView, StatusBar, StyleSheet, View, Text, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../../../context/ThemeContext'
import { globalStyles } from '../../../../themes'

import { color, getFontFamily, scaling } from '../../../../themes/themes'
import { CustomModal, Icon, Line, NavPressable, Setting } from '../../../../components'
import FastImage from 'react-native-fast-image'
import { useDispatch, useSelector } from 'react-redux'
import { updatePostData } from '../../../../redux/reducers/Post'
import AddTags from './EditOptions/AddTags'
import SharePost from './EditOptions/SharePost'
import { SafeAreaView } from 'react-native-safe-area-context'
import { uploadMultipleMedia } from '../../../../api/cloudStorageRequests'
import { Routes } from '../../../../navigation/Routes'

const {verticalScale, horizontalScale, fontScale} = scaling

const QuickSummaryScreen = ({navigation}) => {
  const {theme} = useTheme()
  const {currentUser} = useSelector(state => state.user)
  const post = useSelector(state => state.post)
  const dispatch = useDispatch()

  const {caption, taggedPeople, sharePreference, allowComment, media} = useSelector(state => state.post)

  const [openTag, setOpenTag] = useState(false)
  const [openShare, setOpenShare] = useState(false)
//   const [allowComment, setAllowComment] = useState(false)

const toggleSwitch = () => {
  dispatch(updatePostData({allowComment: !allowComment}))
}

const resetOptions = () => {
    setOpenShare(false)
    setOpenTag(false)
}


const proceedToPost = () => {
    uploadMultipleMedia(dispatch, post.media, post.type)
    .then((results) => {
      dispatch(updatePostData({uploadedMedia: results}))
    })
    .catch((error) => {
        if(__DEV__) {
            console.error('Media upload failed:', error);
        }
    });
    navigation.navigate(Routes.Home)
}

const postOptionsList = [
    {icon: 'user-outline', title: 'Tagged People', extraIcon: 'arrow-right', trigger: () => setOpenTag((prev) => !prev)},
    {icon: 'comment', title: 'Allow Comment', trigger: toggleSwitch, extraIcon: ''},
    {icon: 'lock-circle', title: 'Visible To Anyone', trigger: () => setOpenShare((prev) => !prev), extraIcon: 'arrow-right'},
  ]
  
 

  return (
    <SafeAreaView style={[{ backgroundColor: theme.background}, globalStyles.appScreen]}>
        {(openShare || openTag) &&<Pressable onPress={resetOptions} style={[StyleSheet.absoluteFillObject, {backgroundColor: color.blackRGBA45}]} />}
      <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />
      <View style={{ flex: 1, gap: 25, justifyContent: '' }} >
        <View style={[styles.topContainer]}>
            <NavPressable onPress={() => navigation.goBack()} icon={'arrow-backward'}  />
            <Text style={[styles.headerText, {color: theme.header}]}>New Post</Text>
        </View>

        <View style={[styles.mainContainer]}>
            <View style={[styles.postContentContainer, {backgroundColor: theme.input}]}>
                <Text style={[styles.postContentText, {color: theme.header}]}>{caption ? caption : `No captions for this ${post.type}`}</Text>
            </View>
            <View style={styles.userProfile}>
                <FastImage resizeMode='cover' source={media[0]} priority={FastImage.priority.normal} style={[StyleSheet.absoluteFillObject, {borderRadius: horizontalScale(15)}]} />
                {media?.length > 1 && (
                    <View style={styles.mediaCountContainer}>
                        <Text style={[styles.mediaCountText, { color: theme.header }]}>+{media.length - 1}</Text>
                    </View>
                )}
            </View>
        </View>

        <Line />

        <View style={[styles.mainPrimaryContainer]}>
            {postOptionsList.map((option, index) => (
                <Setting
                    key={index.toString()}
                    icon={option.icon}
                    extraIcon={option.extraIcon}
                    onPress={option.trigger}
                    title={option.title}
                    isSwitched={allowComment}
                    toggleSwitch={toggleSwitch}
                />
            ))}
        </View>

        <Line />

        <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={proceedToPost} style={[styles.previewAction]}>
                <Icon name='share-new' color={color.white} size={fontScale(25)} />
                <Text style={styles.previewActionText}>Post</Text>
            </TouchableOpacity>
        </View>
        
      </View>
        {openTag &&
            <CustomModal openModal={setOpenTag}>
                <AddTags openModal={setOpenTag} />
            </CustomModal>}
        {openShare &&
            <CustomModal openModal={setOpenShare}>
                <SharePost openModal={setOpenShare} />
            </CustomModal>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    topContainer: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        paddingHorizontal: horizontalScale(15),
        paddingTop: horizontalScale(15)
    },
    headerText: {
        fontFamily: getFontFamily('PlusJakartaSans', '700'),
        fontSize: fontScale(20),
        lineHeight: fontScale(26)
    },
    mainContainer: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: horizontalScale(10),
        paddingBottom: verticalScale(20),
    },
    postContentContainer: {
        flex: 1,
        borderRadius: horizontalScale(15),
        paddingVertical: verticalScale(20),
        paddingHorizontal: verticalScale(18),
    },
    postContentText: {
        fontFamily: getFontFamily('PlusJakartaSans', '400'),
        fontSize: fontScale(14),
        lineHeight: fontScale(20)
    },
    userProfile: {
        borderRadius: horizontalScale(15),
        flex: 0.4
    },
    mainPrimaryContainer: {
        gap: 15,
        paddingHorizontal: verticalScale(18),
    },
    bottomContainer: {
        gap: 20,
        position: 'absolute',
        bottom: '5%',
        width: '100%',
        alignItems: 'center'
      },
      previewAction: {
        width: '50%',
        flexDirection: 'row',
        gap: 12,
        paddingVertical: horizontalScale(16),
        borderRadius: 100,
        backgroundColor: color.primary,
        alignItems: 'center',
        justifyContent: 'center',
      },
      previewActionText: {
        fontFamily: getFontFamily('FuturaPT', '600'),
        fontSize: fontScale(18),
        textTransform: 'capitalize',
        color: color.white,
        letterSpacing: 0.4
      },
    mediaCountContainer: {
        position: 'absolute',
        right: horizontalScale(-1),
        top: verticalScale(-6)
    },
    mediaCountText: {
        fontFamily: getFontFamily('Poppins', '800'),
        fontSize: fontScale(18),
        lineHeight: fontScale(20)
    },
})

export default QuickSummaryScreen
