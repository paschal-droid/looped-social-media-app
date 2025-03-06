import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Routes } from '../../../navigation/Routes'
import QuickPostScreen from './screens/QuickPostScreen'
import QuickEditScreen from './screens/QuickEditScreen'
import QuickSummaryScreen from './screens/QuickSummaryScreen'

const Stack = createNativeStackNavigator()


const CreateContent = () => {
  return(
    <Stack.Navigator screenOptions={options} initialRouteName={Routes.QuickPost}>
      <Stack.Screen options={{ animation: 'slide_from_left' }} component={QuickPostScreen} initialParams={{screenIndex: 0}} name={Routes.QuickPost} />
      <Stack.Screen options={{ animation: 'slide_from_left' }} component={QuickEditScreen} name={Routes.QuickEdit} />
      <Stack.Screen options={{ animation: 'slide_from_left' }} component={QuickSummaryScreen} name={Routes.QuickSummary} />
  </Stack.Navigator>
)
}

const options = {
  header: ()=> null,
  headerShown: false,
  tabBarShowLabel: false,
  tabBarHideOnKeyboard: true,
  animation: 'slide_from_bottom',
}

export default CreateContent