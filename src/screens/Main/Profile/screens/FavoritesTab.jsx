import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { EmptyPostList, GridItem } from '../../../../components'
import { useTheme } from '../../../../context/ThemeContext'
import { scaling } from '../../../../themes/themes'

const {horizontalScale, verticalScale, fontScale} = scaling


const FavoritesTab = () => {
  const {theme} = useTheme()
  const favorites = []
  return (
    <View style={[styles.gridContainer, {backgroundColor: theme.background}, favorites.length === 0 && {justifyContent: 'center'}]}>
      <BottomSheetFlatList
        data={favorites}
        ListEmptyComponent={<EmptyPostList icon='favorite' type='favorite' />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.gridItemContainer, favorites.length === 0 && { flex: 1}]}
        keyExtractor={(item) => item.id}
        nestedScrollEnabled
        numColumns={3}
        renderItem={({ item, index }) => <GridItem item={item} gridHeight={2}  showImpression={false} index={index} showMore={() => {}} />}
      />
    </View>
  )
}

export default FavoritesTab

const styles = StyleSheet.create({  
  gridContainer: {
    flex: 1
  },
})