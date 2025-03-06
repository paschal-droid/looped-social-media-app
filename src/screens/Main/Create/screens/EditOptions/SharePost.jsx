import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '../../../../../components'
import { useTheme } from '../../../../../context/ThemeContext'
import { updatePostData } from '../../../../../redux/reducers/Post'
import { color, getFontFamily, scaling } from '../../../../../themes/themes'

const {verticalScale, horizontalScale, fontScale} = scaling


const SharePost = ({openModal}) => {
  const {theme} = useTheme()
  const [option, setOption] = useState(0)
  const dispatch = useDispatch()

  const options = [
    {icon: "globe", option: 'Everyone'},
    {icon: "friends", option: 'Friends Only'},
    {icon: "user-outline", option: 'Close Friends'},
  ]

  const {sharePreference} = useSelector(state => state.post)

  useEffect(() => {
    const checkPreference = (preference) => {
        switch (preference) {
            case 'Everyone':
                return setOption(0)
            case 'Friends Only':
                return setOption(1)
            case 'Close Friends':
                return setOption(2)
            default:
                return setOption(0)
        }
    }
    checkPreference(sharePreference)
  }, [])

  const handleSharePreference = (preference, index) => {
    dispatch(updatePostData({sharePreference: preference}))
    setOption(index)
  }


  return (
    <View style={styles.modal}>
      <View style={styles.modalHeader}>
        <TouchableOpacity style={{ padding: 10 }} onPress={() => openModal(false)}>
          <Icon color={theme.oppositeBackground} name='close2' size={fontScale(25)} />
        </TouchableOpacity>

        <Text style={[styles.modalHeaderText, { color: theme.header }]}>Share Post With</Text>

        <View style={{width: 20}} />
      </View>

      <View style={[styles.sharePostContainer]}>
        {options.map((item, index) => (
          <Pressable onPress={() => handleSharePreference(item.option, index)} key={index.toString()} style={styles.optionSelectorContainer}>
            <View style={styles.shareitem}>
              <View style={[styles.shareitemiImage, { backgroundColor: theme.input }]}>
                <Icon name={item.icon} color={theme.oppositeBackground} size={fontScale(25)} />
              </View>
              <View>
                <Text style={[styles.shareitemName, { color: theme.header }]}>{item.option}</Text>
              </View>
            </View>
            <View>
              <Switch
                onValueChange={() => handleSharePreference(item.option, index)}
                value={option === index}
                trackColor={{ false: theme.input, true: color.primary }}
                thumbColor={theme.oppositeBackground}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          </Pressable>
        )
        )}
      </View>
    </View>
  )
}

SharePost.propTypes ={
  openModal: PropTypes.func.isRequired
}

export default SharePost

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
    fontFamily: getFontFamily('PlusJakartaSans', '600'),
    fontSize: fontScale(20),
    lineHeight: fontScale(24),
    textAlign: 'center',
  },
  sharePostContainer: {
    gap: 15
  },
  optionSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  shareitem: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center'
  },
  shareitemiImage: {
    width: horizontalScale(60),
    height: horizontalScale(60),
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shareitemName: {
    fontFamily: getFontFamily('FuturaPT', '500'),
    fontSize: fontScale(20),
  },
  shareitemLocation: {
    fontFamily: getFontFamily('Poppins', '500'),
    fontSize: fontScale(14),
    letterSpacing: 0.2,
  }
})