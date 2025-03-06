import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'
import { scaling, color, getFontFamily } from '../../themes/themes'
import FastImage from 'react-native-fast-image'
import BouncyCheckbox from 'react-native-bouncy-checkbox'


const {verticalScale, horizontalScale, fontScale} = scaling


const TagSearchSingleResultCard = ({item, addTagged, isChecked}) => {
    const {theme} = useTheme()

  return (
      <Pressable onPress={addTagged} style={styles.tagSelectorContainer}>
          <View style={styles.tagitem}>
              <FastImage priority={FastImage.priority.high} style={[styles.tagitemImage]} source={{ uri: item.profileImages[0] }} />
              <View>
                  <Text style={[styles.tagitemText, { color: theme.header }]}>{item.firstName} {item.lastName}</Text>
                  <Text style={[styles.tagitemsubText, { color: theme.paragraph }]}>@{item.firstName}{item.lastName}</Text>
              </View>
          </View>
          <BouncyCheckbox
              size={fontScale(20)}
              fillColor={color.primary}
              unFillColor={theme.background}
              isChecked={isChecked}
              iconStyle={{ borderColor: color.primary, borderRadius: 18 }}
              innerIconStyle={{ borderWidth: 0.8, borderRadius: 18 }}
              onPress={addTagged}
          />

      </Pressable>
  )
}

TagSearchSingleResultCard.propTypes = {
    item: PropTypes.object.isRequired,
    addTagged: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired,
}

export default TagSearchSingleResultCard

const styles = StyleSheet.create({
    tagSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tagitem: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center'
    },
    tagitemImage: {
        width: horizontalScale(55),
        height: horizontalScale(55),
        borderRadius: horizontalScale(55)
    },
    tagitemText: {
        fontSize: fontScale(18),
        fontFamily: getFontFamily('PlusJakartaSans', '700'),
        lineHeight: fontScale(21.8),
    },
    tagitemsubText: {
        fontSize: fontScale(14),
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        lineHeight: fontScale(19),
        textTransform: 'lowercase'
    },
})