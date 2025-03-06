import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'

import { getFontFamily, scaling } from '../../../../themes/themes'
import { useTheme } from '../../../../context/ThemeContext'
import Icon from '../../../Icon/Icon'
import { formatLikesCount, formatPostTime } from '../../../../data/dataConstants'

const { verticalScale, horizontalScale, fontScale } = scaling


const SingleSubComment = (props) => {
    const {theme} = useTheme()

  return (
    <View style={styles.mainCommentContainer}>
        <Pressable>
            <Image source={{uri: props.item.profileUrl}} style={styles.mainCommentContainerProfile} />
        </Pressable>
        <View style={styles.mainCommentContainerChild2}>
            <View style={styles.mainCommentContainerUserName}>
                <Text style={[styles.mainCommentContainerUserNameText, { color: theme.commentText }]}>{props.item.username}</Text>
                <Text style={[styles.mainCommentContainerUserNameTime, { color: '#A9A9A9' }]}>{formatPostTime(props.item.createdAt.seconds)}</Text>
            </View>
            <View style={styles.mainCommentContainerContent}>
                <Text style={[styles.mainCommentContainerContentText, { color: theme.textColor }]}>{props.item.text}</Text>
            </View>
            <View style={styles.mainCommentContainerInteractions}>
                <View style={styles.mainCommentContainerLikeCount}>
                    <Pressable onPress={() => { }}><Icon color={theme.textColor} name='heart' size={fontScale(18)} /></Pressable>
                    <Text style={styles.mainCommentContainerInteractionsText}>{formatLikesCount(props.item.likes)}</Text>
                </View>
                
            </View>
        </View>
    </View>
  )
}

SingleSubComment.propTypes = {
    item: PropTypes.object.isRequired,
}

export default SingleSubComment

const styles = StyleSheet.create({
    mainCommentContainer: {
        flexDirection: 'row',
        gap: 15,
        paddingTop: verticalScale(20),
        alignItems: 'flex-start',
    
        // marginBottom: verticalScale(24)
      },
      mainCommentContainerProfile: {
        width: horizontalScale(45),
        height: horizontalScale(45),
        borderRadius: horizontalScale(45),
      },
      mainCommentContainerChild2: {
        flex: 1,
        gap: 7,
      },
      mainCommentContainerUserName: {
        gap: 10,
        flexDirection: 'row'
      },
      mainCommentContainerUserNameText: {
        fontSize: fontScale(18),
        lineHeight: fontScale(21),
        fontFamily: getFontFamily('PlusJakartaSans', '700')
      },
      mainCommentContainerUserNameTime: {
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        fontSize: fontScale(13),
      },
      mainCommentContainerContent: {},
      mainCommentContainerContentText: {
        fontFamily: getFontFamily('PlusJakartaSans', '400'),
        fontSize: fontScale(15),
      },
      mainCommentContainerInteractions: {
        flexDirection: 'row',
        gap: 20,
      },
      mainCommentContainerInteractionsText: {
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        fontSize: fontScale(13),
        textAlign: 'center'
      },
      mainCommentContainerLikeCount: {
        flexDirection: 'row',
        gap: 5
      },
})