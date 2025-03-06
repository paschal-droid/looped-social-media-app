import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Onboard from './Onboard'
import Welcome from './Welcome'
import { Routes } from '../../navigation/Routes'

const Stack = createNativeStackNavigator()

const Onboarding = () => {
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen component={Welcome} name={Routes.Welcome} />
      <Stack.Screen component={Onboard} name={Routes.Prompt} />
    </Stack.Navigator>
  );
}

const options = {
  header: ()=> null,
  headerShown: false,
  tabBarShowLabel: false,
  tabBarHideOnKeyboard: true,
  animation: 'slide_from_right',
}

export default Onboarding

