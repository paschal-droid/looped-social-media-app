import { combineReducers } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage'

import UserBioInfo from './reducers/BioInfo'
import User from './reducers/User'
import Post from './reducers/Post'
import ProfileViewUser from './reducers/ProfileViewUser'
import Users from './reducers/Users'


const rootReducer = combineReducers({
    bioInfo: UserBioInfo,
    user: User,
    post: Post,
    profileViewUser: ProfileViewUser,
    users: Users
})

const configStorage = {
    key: 'root',
    storage: AsyncStorage,
    version: 1
}

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaltMiddleware => {
        return getDefaltMiddleware({serializableCheck: false})
    }
})

export default store