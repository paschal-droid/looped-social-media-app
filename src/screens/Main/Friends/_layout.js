import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';

import { useDispatch } from 'react-redux';
import { TabIcon, TopTabText } from "../../../components";
import InAppNotification from '../../../components/PushNotification/InAppNotification';
import { useTheme } from "../../../context/ThemeContext";
import { Routes } from '../../../navigation/Routes';
import { scaling } from '../../../themes/themes';
import Requests from './screens/Requests';
import Suggestions from './screens/Suggestions';
import Mutuals from './screens/Mutual';
import FriendsInvite from './screens/Invite';
import FriendSearch from './screens/Search';
import { StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../../../themes';


const {horizontalScale, verticalScale, fontScale} = scaling


const Tab = createMaterialTopTabNavigator();

const EmptyComponent = () => {
  return(null)
}

const Friends = () => {
  const {top} = useSafeAreaInsets()
  const {theme} = useTheme()
  const dispatch = useDispatch()
 

  return (
    <SafeAreaView style={[globalStyles.appScreen,{backgroundColor: theme.background}]}>
    <InAppNotification />
    <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />
    <Tab.Navigator
      initialRouteName={Routes.FriendsSuggestion}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarIndicatorStyle: {backgroundColor: 'transparent'},
        tabBarStyle: {
          height: verticalScale(56),
          elevation: 0,
          justifyContent: 'center',
          backgroundColor: theme.background,
        },
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
            name={"search-outline"}
            size={fontScale(22)}
            isFocused={focused}
            />
          ),
          tabBarShowLabel: false,
        }}
        name={Routes.Search} component={FriendSearch} />

      <Tab.Group>
        <Tab.Screen options={{tabBarLabel: ({focused}) => (<TopTabText tabText="Suggestions" isFocused={focused} />)}} name={Routes.FriendsSuggestion} component={Suggestions} />
        <Tab.Screen options={{tabBarLabel: ({focused}) => (<TopTabText tabText="Mutuals" isFocused={focused} />)}} name={Routes.FriendsMutual} component={Mutuals} />
        <Tab.Screen options={{tabBarLabel: ({focused}) => (<TopTabText tabText="Requests" isFocused={focused} />)}} name={Routes.FriendsRequest} component={Requests} />
      </Tab.Group>


      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
            name={"add-friend-outline"}
            size={fontScale(22)}
            isFocused={focused}
            />
          ),
          tabBarShowLabel: false,
        }}
        name={Routes.FriendsInvite} component={FriendsInvite} />
    </Tab.Navigator>
    </SafeAreaView>
  );
}

export default Friends