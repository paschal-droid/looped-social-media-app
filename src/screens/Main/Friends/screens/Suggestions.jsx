import React, { useEffect } from 'react'
import { BackHandler, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../../context/ThemeContext'
import { globalStyles } from '../../../../themes'
import { scaling } from '../../../../themes/themes'
import { FriendProfileCardLayout, Progressbar,  } from '../../../../components'
import { Routes } from '../../../../navigation/Routes'

const {horizontalScale, verticalScale, fontScale} = scaling


const Suggestions = ({navigation}) => {
    const {theme} = useTheme()

    useEffect(() => {
      const backAction = () => {
       navigation.navigate(Routes.Home)
        return true; // Prevent default back behavior
      };
    
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    
      return () => {
        backHandler.remove();
      };
    }, [navigation]); // Added navigation dependency
    

  return (
    <View style={[globalStyles.appScreen, globalStyles.spacePadding, {backgroundColor: theme.background}]}>
      <Text>Suggestions</Text>
      <Progressbar progress={60} />
      {/* <FriendProfileCardLayout>

      </FriendProfileCardLayout> */}
    </View>
  )
}

const styles = StyleSheet.create({})

export default Suggestions
