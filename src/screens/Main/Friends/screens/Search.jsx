import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import _ from 'lodash'

import { useTheme } from '../../../../context/ThemeContext'
import { globalStyles } from '../../../../themes'
import { scaling } from '../../../../themes/themes'
import { SearchInput } from '../../../../components'
import { fetchSuggestions, searchUsers } from '../../../../api/user-functions'
import FriendSearchResults from '../../../../components/Inputs/FriendSearchResults'
import { Routes } from '../../../../navigation/Routes'

const {horizontalScale, verticalScale, fontScale} = scaling


const FriendSearch = ({navigation}) => {
  const { theme } = useTheme()
  const [isFollowing, setIsFollowing] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')


  const handleTextValue = (searchVal) => {
    setQuery(searchVal)
    handleSearch(searchVal)
  }

  const debouncedSearch = _.debounce(async (query) => {
    try {
      const users = await searchUsers(query);
      setSearchResults(users);
    } catch (error) {
      console.log('from debounced Search', error);
    }
  }, 300);


  const handleSearch = async (searchVal) => {
    
    if(query != '' && query.length > 2){
      debouncedSearch(query)
    }
  }

  const handleClose = () => {
    setQuery('')
    setSearchResults([])
  }

  return (
    <View style={[globalStyles.appScreen, globalStyles.spacePadding, {backgroundColor: theme.background}]}>
      <View style={[styles.layoutContainer, ]}>
        <SearchInput 
          search={query}
          onSearch={handleSearch}
          handleTextChange={(val) => handleTextValue(val)}
          onClose={handleClose}
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1, gap: 20, paddingVertical: verticalScale(20)}}>
          {searchResults && searchResults.map((item, index) => (
            <FriendSearchResults
              key={index.toString()}  
              result={item} 
              onShowProfile={() => navigation.navigate(Routes.Profile, {uid: item.id})} />
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1
  },
})

export default FriendSearch
