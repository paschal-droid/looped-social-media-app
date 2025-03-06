import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'
import { getFontFamily, scaling } from '../../themes/themes'
import FastImage from 'react-native-fast-image'
import { formatPostTime } from '../../data/dataConstants'

const {horizontalScale, verticalScale, fontScale} = scaling


const NotificationCard = ({activity, showLine=false}) => {
  const {theme} = useTheme();

  return (
    <View style={[styles.notification]}>
      <View style={[styles.notificationInner]}>
        <View style={[styles.notificationContent]}>
            <View style={[styles.imageContainer]}>
                <FastImage priority={FastImage.priority.high} source={{uri: activity.imageUrl}} style={styles.notificationImage}  />
            </View>
            <View style={styles.notificationText}>
                <Text style={[styles.title, {color: theme.header}]}>{activity.postImageUrl ? activity.title.substring(0, 27) + '..' : activity.title}</Text>
                <Text style={[styles.message, {color: theme.paragraph}]}>{activity.postImageUrl ? activity.message.substring(0, 35) + '...' : activity.message}</Text>
                <Text style={[styles.date, {color: theme.header}]}>{formatPostTime(activity.createdAt.seconds)}</Text>
            </View>
        </View>
        {activity.postImageUrl && (
          <View style={styles.postImageContainer}>
            <FastImage priority={FastImage.priority.high} source={{ uri: activity.postImageUrl }} style={styles.notificationImage} />
          </View>
        )}
      </View>
      {showLine && (
        <View style={[styles.line, {backgroundColor: theme.line}]} />
      )}
    </View>
  )
}

NotificationCard.propTypes = {
    activity: PropTypes.object.isRequired,
    showLine: PropTypes.bool
}

export default NotificationCard

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 1,
  },
  notification: {
    gap: 15
  },
  notificationInner: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  notificationContent: {
    gap: 10,
    flexDirection: 'row'
  },
  notificationImage: {
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderRadius: horizontalScale(40),
  },
  notificationText: {
    gap: 5
  },
  message: {
    fontFamily: getFontFamily("FuturaPT", "500"),
    fontSize: fontScale(16),
    lineHeight: fontScale(20)
  },
  title: {
    fontFamily: getFontFamily("PlusJakartaSans", "700"),
    fontSize: fontScale(16),
    lineHeight: fontScale(22)
  },
  date: {
    fontFamily: getFontFamily("FuturaPT", "400"),
    fontSize: fontScale(13),
    lineHeight: fontScale(16)
  },
  imageContainer: {
    width: horizontalScale(45),
    height: horizontalScale(45),
    borderRadius: horizontalScale(40),
    overflow: 'hidden'
  },
  postImageContainer: {
    width: horizontalScale(45),
    height: horizontalScale(45),
    borderRadius: horizontalScale(10),
    overflow: 'hidden'
  },
  notificationImage: {
    aspectRatio: 1/1,
  },

});