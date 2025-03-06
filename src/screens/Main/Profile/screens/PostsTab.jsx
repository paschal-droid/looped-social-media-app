import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { EmptyPostList, GridItem } from '../../../../components'
import { useTheme } from '../../../../context/ThemeContext'
import { scaling } from '../../../../themes/themes'

const {horizontalScale, verticalScale, fontScale} = scaling


const PostsTab = () => {
  const {theme} = useTheme()
  const {posts} = useSelector(state => state.profileViewUser)
  
  return (
    <View style={[styles.gridContainer, {backgroundColor: theme.background}, posts.length === 0 && {justifyContent: 'center'}]}>
      <BottomSheetFlatList
        data={posts}
        ListEmptyComponent={<EmptyPostList type='Posts' icon='image' />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.gridItemContainer, posts.length === 0 && { flex: 1}]}
        keyExtractor={(item) => item.id}
        nestedScrollEnabled
        numColumns={3}
        renderItem={({ item, index }) => <GridItem gridHeight={3} item={item} showImpression={false} index={index} showMore={() => {}} />}
      />
    </View>
  )
}

export default PostsTab

const styles = StyleSheet.create({  
  gridContainer: {
    flex: 1
  },
})