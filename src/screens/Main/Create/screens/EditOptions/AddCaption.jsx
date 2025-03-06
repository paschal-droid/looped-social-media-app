import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '../../../../../components'
import CustomKeyboardAvoidingView from '../../../../../components/Patterns/CustomKeyboardAvoidingView'
import { useTheme } from '../../../../../context/ThemeContext'
import { updatePostData } from '../../../../../redux/reducers/Post'
import { getFontFamily, scaling } from '../../../../../themes/themes'

const {verticalScale, horizontalScale, fontScale} = scaling


const AddCaption = ({openModal}) => {
  const {theme} = useTheme()
  const {caption: cap} = useSelector(state => state.post)
  const [caption, setCaption] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    setCaption(cap)
  }, [])

    
  const handleUpdateCaption = () => {
    // extractHashTags(caption.trim())
    dispatch(updatePostData({caption: caption.trim()}))
    dispatch(updatePostData({hashTags: extractHashTags(caption.trim())}))
    openModal(false)
  }

  const handleRemoveCaption = () => {
    dispatch(updatePostData({caption: ''}))
    openModal(false)
  }

  function extractHashTags(text) {
    const hashtagRegex = /#\w+/g;
    const hashtags = text.match(hashtagRegex)
    return hashtags || []
  }



  return (
    <CustomKeyboardAvoidingView>

    <View style={styles.modal}>
      <View style={styles.modalHeader}>
        <TouchableOpacity style={{ padding: 10 }} onPress={handleRemoveCaption}>
          <Icon color={theme.oppositeBackground} name='close2' size={fontScale(25)} />
        </TouchableOpacity>

        <Text style={[styles.modalHeaderText, { color: theme.header }]}>Add Caption</Text>

        <TouchableOpacity style={{ padding: 10 }} onPress={handleUpdateCaption}>
          <Icon color={theme.oppositeBackground} name='check' size={fontScale(25)} />
        </TouchableOpacity>
      </View>

      <View style={[styles.captionTextContainer]}>
        <TextInput
          multiline
          numberOfLines={20}
          onChangeText={text => setCaption(text)}
          value={caption}
          placeholder='Write something here'
          placeholderTextColor={'#979797'}
          style={[styles.captionTextInput, { color: theme.header, borderColor: theme.oppositeBackground }]}
          textAlignVertical='top'
        />
      </View>
    </View>
  </CustomKeyboardAvoidingView>
  )
}

AddCaption.propTypes = {
  openModal: PropTypes.func.isRequired
}

export default AddCaption

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    gap: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: verticalScale(10),
    borderBottomWidth: 0.5,
  },
  modalHeaderText: {
    fontFamily: getFontFamily('PlusJakartaSans', '500'),
    fontSize: fontScale(20),
    lineHeight: fontScale(24),
    textAlign: 'center',
  },
  captionTextContainer: {
    flex: 1,
  },
  captionTextInput: {
    flex: 1,
    padding: horizontalScale(15),
    fontFamily: getFontFamily('PlusJakartaSans', '500'),
    fontSize: fontScale(15),
    borderRadius: horizontalScale(15),
    borderWidth: 1,
    padding: horizontalScale(15),
  }
})