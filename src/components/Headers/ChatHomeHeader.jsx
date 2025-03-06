import { Platform, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { getFontFamily, scaling } from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '../Icon/Icon'
import { useSelector } from 'react-redux'
import { truncateText } from '../../data/dataConstants'
import { useNavigation } from '@react-navigation/native'
import NavPressable from '../Patterns/NavPressable'
import SearchInput from '../Inputs/SearchInput'

import Animated, { FadeInDown, FadeInLeft, FadeInRight, FadeInUp, FadeOutUp} from 'react-native-reanimated'
import UserActionButton from '../Buttons/UserActionButton'


const {fontScale, verticalScale, horizontalScale} = scaling

const ChatHomeHeader = (props) => {
    const {theme} = useTheme()
    const navigation = useNavigation()
    const ios = Platform.OS === 'ios'
    const {top} = useSafeAreaInsets()
    const [openSearch, setOpenSearch] = useState(false)
    const [openAddChat, setOpenAddChat] = useState(false)
    const [search, setSearch] = useState('')

    const {currentUser} = useSelector(state => state.user)

    const createNewChat = () => {}
    const createNewGroupChat = () => {}

  return (
    <View style={[styles.chatHomeHeaderContainer, {paddingTop: ios ? top : top+20, backgroundColor: theme.background}]}>
        <StatusBar backgroundColor={theme.backgroundColor} barStyle={theme.statusBarTextColor} />
        <View style={[styles.chatHomeHeader]}>
            <View style={[styles.chatUserInfo]}>
                <NavPressable icon={'arrow-backward'} onPress={() => navigation.goBack()} />
                <Text style={[styles.chatUsername, { color: theme.header }]}>Messages</Text>
            </View>
            <View style={[styles.chatSearch]}>
                <TouchableNativeFeedback  onPress={() => {setOpenAddChat((prev) => !prev); setOpenSearch(false)}}>
                    <Icon style={styles.openSearch} name='post-add' size={fontScale(25)} color={theme.icon} />
                </TouchableNativeFeedback>
                <TouchableNativeFeedback  onPress={() => {setOpenSearch((prev) => !prev); setOpenAddChat(false)}}>
                    <Icon style={styles.openSearch} name='search-outline' size={fontScale(25)} color={theme.icon} />
                </TouchableNativeFeedback>
            </View>
        </View>

        {openSearch && (
            <Animated.View entering={FadeInUp.delay(300).springify()} exiting={FadeOutUp.delay(200).springify()} style={[styles.chatSearchContainer]}>
                <SearchInput search={search} handleTextChange={(val) => setSearch(val)} onClose={() => setSearch('')} onSearch={() => {}} />
          </Animated.View>
        )
        }
      
        {/* action to create new chat or group */}
        {
            openAddChat && (
                <Animated.View entering={FadeInUp.delay(300).springify()} exiting={FadeOutUp.delay(200).springify()} style={[styles.chatCreateContainer]}>
                      <UserActionButton
                          backgroundColor={theme.oppositeBackground}
                          borderColor={theme.oppositeBackground}
                          borderWidth={0}
                          textColor={theme.background}
                          width={55}
                          height={15}
                          useIcon={true}
                          icon={'add-chat'}
                          iconColor={theme.background}
                          iconSize={25}
                          onAction={createNewChat}
                          actionText={'New Chat'}
                          fontSize={15}
                      />

                      <UserActionButton
                          backgroundColor={theme.oppositeBackground}
                          borderColor={theme.oppositeBackground}
                          borderWidth={0}
                          textColor={theme.background}
                          width={55}
                          height={15}
                          useIcon={true}
                          icon={'edit'}
                          iconColor={theme.background}
                          iconSize={25}
                          onAction={createNewGroupChat}
                          actionText={'New Group'}
                          fontSize={15}
                      />
                </Animated.View>
            )
        }
        

    </View>
  )
}

ChatHomeHeader.propTypes = {

}

export default ChatHomeHeader

const styles = StyleSheet.create({
    chatHomeHeaderContainer: {
        paddingHorizontal: horizontalScale(20),
        gap: 15
    },
    chatHomeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    chatUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    },
    chatUsername: {
        fontFamily: getFontFamily('PlusJakartaSans', '800'),
        fontSize: fontScale(24),
        textTransform: 'capitalize'
    },
    chatSearch: {
        flexDirection: 'row',
        gap: 10
    },
    chatCreateContainer: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: verticalScale(5)
    },
    openSearch: {
        width: horizontalScale(30),
        height: horizontalScale(30),
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    chatActionsContainer: {
        flexDirection: 'row',
        gap: 18,
        alignSelf: 'center',
        alignItems: 'center'
    }

})