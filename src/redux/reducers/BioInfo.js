import { createSlice } from "@reduxjs/toolkit";

const prevState = {
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    gender: '',
    occupation: '',
    profileBio: '',
    username: '',
    profileImageUrls: [],
    selectedInterests: []
  }

const UserBioInfo = createSlice({
    name: 'userBioInfo',
    initialState: prevState,
    reducers: {
        updateUserInfo: (state, action) => {
            return {...state, ...action.payload}
        },
        updateInterests: (state, action) => {
            if(state.selectedInterests.includes(action.payload)){
                state.selectedInterests = state.selectedInterests.filter(item => item != action.payload)
            }else {
                state.selectedInterests.push(action.payload)
            }
        },
        resetUserInfo: () => {
            return prevState
        }
    }
})

export const {updateUserInfo, resetUserInfo, updateInterests} = UserBioInfo.actions

export default UserBioInfo.reducer