import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { EmptyPostList, GridItem } from '../../../../components'
import { useTheme } from '../../../../context/ThemeContext'



const VideoTab = () => {
  const {theme} = useTheme()
  const {highlights} = useSelector(state => state.profileViewUser)
  return (
    <View style={[styles.gridContainer, {backgroundColor: theme.background}, highlights.length === 0 && {justifyContent: 'center'}]}>
      <BottomSheetFlatList
        data={highlights}
        ListEmptyComponent={<EmptyPostList type='Highlights' icon='play' />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.gridItemContainer, highlights.length === 0 && { flex: 1}]}
        keyExtractor={(item) => item.id}
        nestedScrollEnabled
        numColumns={3}
        renderItem={({ item, index }) => <GridItem gridHeight={2} item={item} showImpression={true} impressionCount={45} impressionIcon={'play'} index={index} showMore={() => {}} />}
      />
    </View>
  )
}

export default VideoTab

const styles = StyleSheet.create({  
  gridContainer: {
    flex: 1
  },
})