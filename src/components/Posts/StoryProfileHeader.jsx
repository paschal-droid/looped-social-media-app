import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { Routes } from '../../navigation/Routes'
import { color, getFontFamily, scaling } from '../../themes/themes'
import Icon from '../Icon/Icon'
import UpdateStorySpinner from '../Loaders/UpdateStorySpinner'

const {horizontalScale, verticalScale, fontScale} = scaling


const StoryProfileHeader = () => {
    const {theme} = useTheme()
    const colorScheme = useColorScheme() === 'light'
    const navigation = useNavigation()

    const handlePress = () => {
        navigation.navigate(Routes.Create,  {params: {screenIndex: 1}, screen: Routes.QuickPost})
    };

  return (
    <TouchableOpacity
      style={styles.storyProfileContainer}
      onPress={handlePress}>
      <View style={styles.gradientWrapper}>
        <UpdateStorySpinner width={65+3} hasBeenViewed={true} />

        {/* User's Story Profile */}
        <View
          style={[
            styles.imageContainer,
            {backgroundColor: colorScheme ? color.smoke : theme.oppositeBackground, width: horizontalScale(65), height: horizontalScale(65)},
          ]}>
            <View style={[styles.userStoryImage, {backgroundColor: theme.segmentedControl}]}>
                <Icon name='post-add' size={fontScale(24)} color={theme.iconSecondary} />
            </View>
        </View>
      </View>
      {/* Story User's Name */}
        <Text style={[styles.viewersText, {color: theme.background}]}>
          Add Story
        </Text>
    </TouchableOpacity>
  )
}

export default StoryProfileHeader

const styles = StyleSheet.create({
    storyProfileContainer: {
        gap: 7,
        alignItems: 'center',
      },
      viewersText: {
          fontFamily: getFontFamily('PlusJakartaSans', '600'),
          fontSize: fontScale(14),
          textTransform: 'capitalize',
          letterSpacing: 0.2
        },
      gradientWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: horizontalScale(4)
      },
      imageContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: horizontalScale(100),
        justifyContent: 'center',
        zIndex: 10,
      },
      userStoryImage: {
        aspectRatio: 1/1,
        width: '88%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: horizontalScale(100)
      },
})