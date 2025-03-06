
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Comments, InAppNotification, Progressbar } from "../components";
import PushNotificationContext from "../context/PushNotificationContext";
import { finishUpMediaUpload, resetPostData } from "../redux/reducers/Post";
import { Activity, Chat, Create, Friends, Stories } from "../screens/Main";
import ProfileEditScreen from "../screens/Main/Profile/screens/ProfileEdit";
import { backgroundMessageHandler, unsubscribeOnMessage, unsubscribeOnOpened } from "../utils/notification-foreground";
import { Routes } from "./Routes";
import TabNavigation from "./tabNavigation";


const Stack = createNativeStackNavigator()


const UploadObserver = () => {
    const {progress, uploadedMedia, type} = useSelector(state => state.post)
    const dispatch = useDispatch()
    const {setNotification} = useContext(PushNotificationContext)
    
    useEffect(() => {  
      if (progress === '100' && uploadedMedia.length > 0) {
        dispatch(finishUpMediaUpload())
        setNotification({
          title: 'Upload Complete', // Title of the notification
          message: `Your ${type} has been successfully uploaded!`, // Brief description of the action completed
          duration: 5000, // Duration in milliseconds (5 seconds)
          url: uploadedMedia[0].url, // Optional: A URL if you want
        })
        setTimeout(() => {
          dispatch(resetPostData())
        }, 5000);
      }
    }, [progress, uploadedMedia]);
  
    return null; // This component only observes state
  };


const MainNavigation = () => {
    const {progress} = useSelector(state => state.post)
    const {setNotification} = useContext(PushNotificationContext)

    useEffect(() => {
      // * used to watch for changes for an incoming notification from database
      unsubscribeOnMessage(setNotification)
      unsubscribeOnOpened()
      backgroundMessageHandler()

      
      return () => {
      };
    }, [setNotification])
    


    return (

        <>
        {progress > 0 && <Progressbar progress={parseInt(progress)} />}
        <UploadObserver />
        <InAppNotification />
        <Stack.Navigator screenOptions={options} >
            <Stack.Screen options={{ animation: 'slide_from_bottom' }} component={TabNavigation} name={Routes.Tab} />
            <Stack.Screen options={{ animation: 'slide_from_bottom' }} component={Chat} name={Routes.Chat} />
            <Stack.Screen options={{ animation: 'slide_from_bottom' }} component={Create} name={Routes.Create} />
            <Stack.Screen component={Stories} name={Routes.Stories} />
            <Stack.Screen options={{ animation: 'slide_from_right' }} component={Friends} name={Routes.Friends} />
            <Stack.Screen options={{ animation: 'slide_from_right' }} component={ProfileEditScreen} name={Routes.EditProfile} />
            <Stack.Screen options={{ animation: 'slide_from_bottom' }} component={Comments} name={Routes.Comment} />
            <Stack.Screen options={{ animation: 'slide_from_right' }} component={Activity} name={Routes.Activity} />

        </Stack.Navigator>
        </>
    )
}


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


export default MainNavigation