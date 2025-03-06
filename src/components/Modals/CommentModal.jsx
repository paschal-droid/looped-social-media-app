import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, StatusBar, Text, TextInput, useColorScheme, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { Routes } from '../../navigation/Routes';
import { globalStyles } from '../../themes';
import { color, scaling } from '../../themes/themes';
import Icon from '../Icon/Icon';
import NavPressable from '../Patterns/NavPressable';

import styles from '../Posts/Interactions/commentStyles'
const { fontScale } = scaling



const CommentModal = ({navigation}) => {
    const snapPoints = useMemo(() => ['98%'], []);
    const { currentUser } = useSelector(state => state.user)
    const { theme } = useTheme()
    const colorScheme = useColorScheme() === 'dark'
    const stories = currentUser?.profileImages
    const commentModalRef = useRef(null);

    // ? States of the comment Modals
    const [addComment, setAddComment] = useState('')

    const returnToPost = (index) => {
        navigation.navigate(Routes.Home, {postIndex: index})
    }

    const handleAddCommentToPost = () => {
        
    }

    return (
        <SafeAreaView style={[styles.commentModal, globalStyles.appScreen, {backgroundColor: theme.background}]}>
            <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />

      
        <BottomSheet
            ref={commentModalRef}
            snapPoints={snapPoints}
            backgroundStyle={[styles.handlerStyle, { backgroundColor: theme.background }]}
            handleIndicatorStyle={{ backgroundColor: theme.header, width: 50 }}
            enablePanDownToClose
            onClose={() => returnToPost(0)}

        >
            <BottomSheetView style={[styles.contentContainer]}>
                <View style={styles.header}>
                    <View style={styles.firstHeader}>
                        <NavPressable icon={'arrow-backward'} onPress={() => returnToPost(0)} />
                        <Text style={[styles.headerText]}>Comments</Text>
                    </View>
                    <View style={styles.space}>
                        <Icon name='share-new' color={theme.icon} size={fontScale(20)} />
                    </View>
                </View>

                <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollableContentContainer]}>

                </BottomSheetScrollView>

                <View style={[styles.commentSection, {  }]}>
                    <View style={[styles.commentProfile]}>
                        <FastImage
                            priority={FastImage.priority.high}
                            style={[styles.commentProfileImage]}
                            source={{ uri: stories[0]}}
                        />
                        <TextInput inputMode='text' value={addComment} onChangeText={(val) => setAddComment(val)} placeholder='Add a comment...' placeholderTextColor={colorScheme ? color.whiteRGBA50 : color.blackRGBA50} style={[styles.input, {color: colorScheme ? color.whiteRGBA50 : color.blackRGBA50, backgroundColor: theme.input}]} />
                    </View>

                    <TouchableOpacity onPress={handleAddCommentToPost}>
                        <Icon name='send' size={fontScale(30)} color={theme.oppositeBackground} />
                    </TouchableOpacity>
                </View>

                {/* current user space for adding his comment */}

            </BottomSheetView>
        </BottomSheet>
    </SafeAreaView>
    )
}

CommentModal.propTypes = {
    
}

export default CommentModal

