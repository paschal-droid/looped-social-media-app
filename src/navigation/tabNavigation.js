import { BlurView } from '@react-native-community/blur';
import auth from '@react-native-firebase/auth';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


import { Routes } from "./Routes";

import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { ProfileTabIcon, TabIcon } from "../components";
import { useTheme } from "../context/ThemeContext";
import { fetchActivity, fetchFollowing, fetchUser, fetchUserPosts, fetchUserStories, fetchUserVideos } from "../redux/reducers/User";
import { Home, Profile, Reels } from "../screens/Main";
import { scaling } from '../themes/themes';

const {horizontalScale, verticalScale, fontScale} = scaling

const Tab = createBottomTabNavigator()

const EmptyComponent = () => {
  return(null)
}




const TabNavigation = () => {
    const {theme} = useTheme();
    const dispatch = useDispatch()

    useEffect(() => {
      const unsubscribers = [];
  
      // Add each unsubscribe function to the array
      unsubscribers.push(dispatch(fetchUser()));
      unsubscribers.push(dispatch(fetchUserPosts()));
      unsubscribers.push(dispatch(fetchUserStories()));
      unsubscribers.push(dispatch(fetchUserVideos()));
      unsubscribers.push(dispatch(fetchFollowing()));
      unsubscribers.push(dispatch(fetchActivity()));
  
      return () => {
          // Call each unsubscribe function if it's valid
          unsubscribers.forEach(unsub => {
              if (typeof unsub === 'function') {
                  unsub();
              }
          });
      };
  }, [dispatch]);
    
    const screenOptions={
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: horizontalScale(60),
          position: 'absolute',
          elevation: 0,
          borderTopWidth: 0,
          borderTopLeftRadius: horizontalScale(25),
          borderTopRightRadius: horizontalScale(25),
          backgroundColor: theme.backgroundShade,
        },
        tabBarBackground: ()=> (<BlurView overlayColor="" blurAmount={20} style={styles.blurViewStyles} />)
    }

    return (
       <Tab.Navigator screenOptions={screenOptions}>
        {/* Home Screen */}
        <Tab.Screen
            options={{
            tabBarIcon: ({ focused }) => (
                <TabIcon name="home2-outline" size={28} isFocused={focused} />
            ), animation: 'slide_from_right', tabBarLabelPosition: 'below-icon',
            }}
            component={Home}
            name={Routes.Home}
        />

        {/* Chat Screen */}
        <Tab.Screen
            listeners={({navigation}) => ({
            tabPress: event => {
                event.preventDefault();
                navigation.navigate(Routes.Chat);
            },
            })}
            options={{
                tabBarIcon: ({ focused }) => (
                    <TabIcon name="chats-outline" size={28} isFocused={focused} />
                ), animation: 'slide_from_right', tabBarLabelPosition: 'below-icon',
            }}
            component={EmptyComponent}
            name={'temp-chat'}
        />

        {/* Create Screen */}
        <Tab.Screen
            listeners={({navigation}) => ({
            tabPress: event => {
                event.preventDefault();
                navigation.navigate(Routes.Create);
            },
            })}
            options={{
                tabBarIcon: ({ focused }) => (
                  <TabIcon name="post-add-outline" size={32} isFocused={focused} />
                ), animation: 'slide_from_right', tabBarLabelPosition: 'below-icon',
                tabBarBackground: ()=> (<BlurView overlayColor="" blurAmount={15} blurRadius={15} style={styles.blurViewStyles} />),
              }}
            component={EmptyComponent}
            name={'EmptyCreate'}
        />

        {/* Friends Suggestion Screen */}
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="video-lib-outline" size={28} isFocused={focused} />
          ), animation: 'slide_from_right', tabBarLabelPosition: 'below-icon',
        }}
        component={Reels}
        name={Routes.Reels}
      />

      {/* Profile Screen */}
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <ProfileTabIcon isFocused={focused} />
          ), animation: 'slide_from_right', tabBarLabelPosition: 'below-icon',
        }}
        component={Profile}
        name={Routes.Profile}
        initialParams={{uid: auth().currentUser.uid}}
      />

       </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    blurViewStyles: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      borderRadius: 1000
    }
})

export default TabNavigation