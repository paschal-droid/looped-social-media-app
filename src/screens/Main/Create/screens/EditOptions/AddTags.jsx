import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { searchUsers } from '../../../../../api/user-functions'
import { Icon, SearchInput, TagSearchSingleResultCard } from '../../../../../components'
import { useTheme } from '../../../../../context/ThemeContext'
import { updatePostData } from '../../../../../redux/reducers/Post'
import { getFontFamily, scaling } from '../../../../../themes/themes'

const {verticalScale, horizontalScale, fontScale} = scaling



const AddTags = ({openModal}) => {
  const {theme} = useTheme()
  const {taggedPeople: tags} = useSelector(state => state.post)

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [taggedPeople, setTaggedPeople] = useState()
  const dispatch = useDispatch()

  //Go to the redux and check if there is any tagged id there, if so then fetch and filter those users from firestore
  useEffect(() => {
    setTaggedPeople(tags)
  }, [tags])

  const debouncedSearch = _.debounce(async (query) => {
    try {
      const users = await searchUsers(query);
      setSearchResults(users);
    } catch (error) {
      console.log('from debounced Search', error);
    }
  }, 500);

  const handleTextValue = (searchVal) => {
    setQuery(searchVal)
    handleSearch(searchVal)
  }

  const handleSearch = async (searchVal) => {
    if (searchVal != '') {
      try {
        debouncedSearch(query)
      } catch (error) {
        console.log('from the suggestions search', error);
      }
    }
  }

  const handleClose = () => {
    setQuery('')
    setSearchResults('')
  }

  const handleSelectTaggedPeople = (taggedItem) => {
    if(taggedPeople.indexOf(taggedItem) > -1){
      setTaggedPeople((prev) => {
        return prev.filter((item) => item.id !== taggedItem.id)
      })
    }else {
      setTaggedPeople((prev) => {
       return [...prev, taggedItem]
     })
    }
  }

  const handleUpdateTags = () => {
    dispatch(updatePostData({taggedPeople: taggedPeople}))
    openModal(false)
  }

  const handleRemoveCaption = () => {
    openModal(false)
  }
  
  

  return (
    <View style={styles.modal}>
      <View style={styles.modalHeader}>
        <TouchableOpacity style={{ padding: 10 }} onPress={handleRemoveCaption}>
          <Icon color={theme.oppositeBackground} name='close2' size={fontScale(25)} />
        </TouchableOpacity>

        <Text style={[styles.modalHeaderText, { color: theme.header }]}>Tag People</Text>

        <TouchableOpacity style={{ padding: 10 }} onPress={handleUpdateTags}>
          <Icon color={theme.oppositeBackground} name='check' size={fontScale(25)} />
        </TouchableOpacity>
      </View>

      <View style={styles.modalBody}>
        <View style={[styles.tagSearchContainer]}>
          <SearchInput
            onSearch={() => { }}
            onClose={handleClose}
            search={query}
            placeholder={'search for people to tag...'}
            handleTextChange={(val) => handleTextValue(val)}
          />
        </View>

        <View style={[styles.tagResultsContainer]}>
          {searchResults && searchResults.map((item, index) => (
            <TagSearchSingleResultCard 
              key={index.toString()}
              isChecked={taggedPeople.indexOf(item) > -1} 
              item={item}
              addTagged={() => handleSelectTaggedPeople(item)}
            />
          ))}
          {taggedPeople && taggedPeople.map((item, index) => (
            <TagSearchSingleResultCard 
              key={index.toString()}
              isChecked={taggedPeople.indexOf(item) > -1} 
              item={item}
              addTagged={() => handleSelectTaggedPeople(item)}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

AddTags.propTypes = {
  openModal: PropTypes.func.isRequired,
}

export default AddTags

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
    
  },
  modalHeaderText: {
    fontFamily: getFontFamily('PlusJakartaSans', '500'),
    fontSize: fontScale(20),
    lineHeight: fontScale(24),
    textAlign: 'center',
  },
  tagResultsContainer: {
    gap: 20,
    marginTop: verticalScale(20)
  },
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