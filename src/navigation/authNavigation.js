import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";


import { Routes } from "./Routes";
import { useEffect, useState } from "react";
import { Onboarding } from "../screens/Onboarding";
import { LoginFlow1, LoginFlow2, SignUpFlow1, SignUpFlow2, SignUpFlow3, SignUpFlow4, SignUpFlow5, SignUpFlow6 } from "../screens/Auth";
import MainNavigation from "./mainNavigation";
import { useSelector } from "react-redux";


const Stack = createNativeStackNavigator()

const RegistrationNavigation = () => {
    return (
        <Stack.Navigator screenOptions={options}>
            <Stack.Screen options={{animation: 'slide_from_right'}} component={SignUpFlow1} name={Routes.SignUpFlow1} />
            <Stack.Screen options={{animation: 'slide_from_right'}} component={SignUpFlow2} name={Routes.SignupFlow2} />
            <Stack.Screen options={{animation: 'slide_from_right'}} component={SignUpFlow3} name={Routes.SignupFlow3} />
            <Stack.Screen options={{animation: 'slide_from_right'}} component={SignUpFlow4} name={Routes.SignupFlow4} />
            <Stack.Screen options={{animation: 'slide_from_right'}} component={SignUpFlow5} name={Routes.SignupFlow5} />
            <Stack.Screen options={{animation: 'slide_from_right'}} component={SignUpFlow6} name={Routes.SignupFlow6} />
        </Stack.Navigator>
    )
}

const LoginNavigation = () => {
    return (
        <Stack.Navigator screenOptions={options}>
            <Stack.Screen options={{animation: 'slide_from_right'}} component={LoginFlow1} name={Routes.LoginFlow1} />
            <Stack.Screen options={{animation: 'slide_from_right'}} component={LoginFlow2} name={Routes.LoginFlow2} />
        </Stack.Navigator>
    )
}

const AuthNavigation = () => {
    const [onboardingCompleted, setOnboardingCompleted] = useState(false)

    useEffect(() => {
        const loadOnboardingStatus = async () => {
          const value = await AsyncStorage.getItem('hasCompletedOnboarding');
          const onboardingCompleted = value === 'true';
          setOnboardingCompleted(onboardingCompleted);
        };
        loadOnboardingStatus();
      }, []);
      
    return (
        <Stack.Navigator screenOptions={options}>
            {!onboardingCompleted && <Stack.Screen options={{ animation: 'slide_from_right' }} component={Onboarding} name={Routes.Onboard} />}
            <Stack.Screen options={{animation: 'slide_from_right'}} component={LoginNavigation} name={Routes.LoginFlow} />
            <Stack.Screen options={{animation: 'slide_from_right'}} component={RegistrationNavigation} name={Routes.RegistrationFlow} />
            <Stack.Screen options={{animation: 'slide_from_right'}} component={MainNavigation} name={Routes.MainNavigation} />
        </Stack.Navigator>
    )
}

export default AuthNavigation



const options = {
    header: ()=> null,
    headerShown: false,
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    animation: 'slide_from_bottom',
}

const screenOptions = {
    animation: 'slide_from_bottom'
}