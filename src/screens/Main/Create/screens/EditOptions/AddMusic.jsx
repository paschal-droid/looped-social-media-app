import AsyncStorage from '@react-native-async-storage/async-storage'
import _ from 'lodash'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { searchSong } from '../../../../../api/in-appRequests'
import { Icon, SearchInput } from '../../../../../components'
import { useTheme } from '../../../../../context/ThemeContext'
import { getFontFamily, scaling } from '../../../../../themes/themes'


const {verticalScale, horizontalScale, fontScale} = scaling



const AddMusic =  () => {
  const {theme} = useTheme()
  const expirationTime = AsyncStorage.getItem('spotify_token_expiration')
  
  // ? STATES MGMNT
  const [searchResults, setSearchResults] = useState([])
  const [query, setQuery] = useState('')
  const [selectedSong, setSelectedSong] = useState([])
  const [sound, setSound] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)


  const handleUpdateMusic = () => {}
  const handleRemoveCaption = () => {}

  const debouncedSearch = _.debounce(async (query) => {
    try {
      const songLists = await searchSong(query);
      setSearchResults(songLists);
    } catch (error) {
      console.log('from debounced Search', error);
    }
  }, 1000);

  const handleSearch = () => {
    if (query.length >= 2) {
      try {
        debouncedSearch(query)
      } catch (error) {
        console.log('from the main search', error);
      }
    }
  }
  const handleClose = () => {
    setQuery('')
    setSearchResults([])
    if(sound) return sound.release()
    setSound(null)
  }

  const handleTextValue = (searchVal) => {
    setQuery(searchVal)
    handleSearch(searchVal)
  }

  console.log('From search results ',searchResults);
  


  
  return (
    <View style={styles.modal}>
      <View style={styles.modalHeader}>
        <TouchableOpacity style={{ padding: 10 }} onPress={handleRemoveCaption}>
          <Icon color={theme.oppositeBackground} name='close2' size={fontScale(25)} />
        </TouchableOpacity>

        <Text style={[styles.modalHeaderText, { color: theme.header }]}>Sounds</Text>

        <TouchableOpacity style={{ padding: 10 }} onPress={handleUpdateMusic}>
          <Icon color={theme.oppositeBackground} name='check' size={fontScale(25)} />
        </TouchableOpacity>
      </View>

      <View style={styles.modalBody}>
        <View style={[styles.musicSearchContainer]}>
          <SearchInput
            onSearch={handleSearch}
            onClose={handleClose}
            search={query}
            placeholder={'life is good by drake..'}
            handleTextChange={(val) => handleTextValue(val)}
          />
        </View>

        <View style={[styles.musicResultsContainer]}>

        </View>
      </View>
    </View>
  )
}

export default AddMusic

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
})