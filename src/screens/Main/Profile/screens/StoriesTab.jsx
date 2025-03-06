import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { EmptyPostList, GridItem } from '../../../../components'
import { useTheme } from '../../../../context/ThemeContext'


const StoriesTab = () => {
  const {theme} = useTheme()
  const {stories} = useSelector(state => state.profileViewUser)
  return (
    <View style={[styles.gridContainer, {backgroundColor: theme.background}, stories.length === 0 && {justifyContent: 'center'}]}>
      <BottomSheetFlatList
        data={stories}
        ListEmptyComponent={<EmptyPostList type='Stories' icon='loader-2' />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.gridItemContainer, stories.length === 0 && { flex: 1}]}
        keyExtractor={(item) => item.id}
        nestedScrollEnabled
        numColumns={3}
        renderItem={({ item, index }) => <GridItem item={item} gridHeight={3} showImpression={true} impressionCount={34} impressionIcon={'loader-2'} index={index} showMore={() => {}} />}
      />
    </View>
  )
}

export default StoriesTab

const styles = StyleSheet.create({  
  gridContainer: {
    flex: 1
  },
})