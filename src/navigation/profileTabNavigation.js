import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import auth from '@react-native-firebase/auth'
import { FavoritesTab, PostsTab, StoriesTab, VideosTab } from "../screens/Main"
import { Routes } from "./Routes";
import { StyleSheet, Text } from "react-native";
import { color, scaling } from "../themes/themes";
import { useTheme } from "../context/ThemeContext";
import { ProfileTabLabel } from "../components";
import { useSelector } from "react-redux";

const {horizontalScale, verticalScale, fontScale} = scaling


const ProfileTabs = createMaterialTopTabNavigator()

export const ProfileTabsNavigation = ({uid}) => {
    const {theme} = useTheme()
    const {posts, stories, highlights} = useSelector(state => state.profileViewUser)
    
    const screenOptions = {
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarIndicatorStyle: {backgroundColor: '#C150F6', height: verticalScale(3)},
        tabBarStyle: {
        height: verticalScale(45),
        textAlign: 'center',
        backgroundColor: theme.background,
        justifyContent: 'center',
    }
    }

    return (
      <ProfileTabs.Navigator screenOptions={screenOptions}>
        <ProfileTabs.Screen
          options={{
            tabBarLabel: ({focused}) => <ProfileTabLabel isFocused={focused} text={`${posts.length} Posts`} />,
          }}
          name={Routes.PhotosTab}
          component={PostsTab}
        />
        <ProfileTabs.Screen
          options={{
            tabBarLabel: ({focused}) => <ProfileTabLabel isFocused={focused} text={`${highlights.length} Videos`} />,
          }}
          name={Routes.VideosTab}
          component={VideosTab}
        />
        {uid === auth().currentUser.uid && (
          <ProfileTabs.Screen
            options={{
              tabBarLabel: ({focused}) => <ProfileTabLabel isFocused={focused} text={`${stories.length} Stories`} />,
            }}
            name={Routes.StoriesTab}
            component={StoriesTab}
          />
        )}
        {uid === auth().currentUser.uid && (
          <ProfileTabs.Screen
            options={{
              tabBarLabel: ({focused}) => <ProfileTabLabel isFocused={focused} text="0 Saved" />,
            }}
            name={Routes.FavoritesTab}
            component={FavoritesTab}
          />
        )}
      </ProfileTabs.Navigator>
    );
}

const styles = StyleSheet.create({
    labelText: {},
})

