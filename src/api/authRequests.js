import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import { differenceInHours } from '../data/dataConstants.js'

export const createOTPRequest = async (phoneNumber) => {
    try {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber)
        return confirmation
    } catch (error) {
        if(error.code == 'auth/missing-phone-number'){
            return {error: 'This number used is in the wrong format, try again', title: 'Phone Number Format incorrect'}
        }
        if(error.code == 'auth/invalid-phone-number'){
            return {error: 'The Phone number you used does not exist', title: 'Invalid Phone Number'}
        }
        if(error.code == 'auth/too-many-requests'){
            return {error: `Too many attemps, Please Try again in ${differenceInHours}h`, title: 'Too Many OTP Attempts'}
        }
        if(error.code === 'auth/unknown'){
            return {error: 'An unknown error occurred. Please try again later.', title: 'Something went wrong'}
        }
        if (error.code === 'auth/missing-client-identifier'){
            return {error: 'An error occurred. Please try again later or contact support.', title: 'Contact Support'}
        }
        if(error.code === 'auth/network-request-failed'){
            return {error: 'No Internet Connection', title: 'Turn on your mobile data or wifi'}
        }
        console.error('Error sending OTP:', error)
        return {error: 'There was an error confirming the Phone Number', title: 'Try using another Phone Number'}
    }
}

export const loginWithOTP = async (confirmation, otp) => {
    try {
        await confirmation.confirm(otp)
        const registeredUser = await firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .get()
        if(registeredUser.exists) {
            return {isRegistered: true}
        }else {
            return {isRegistered: false}
        }
        
    } catch (error) {
        if (error.code == 'auth/invalid-verification-code') {
            return {error: "The OTP code is incorrect, please check and try again", title: 'Invalid OTP Code '}
        }
        if(error.code == 'auth/too-many-requests'){
            return {error: `Please Try again in ${differenceInHours}h`, title: 'Too many attempts'}
        }
        if(error.code === 'auth/network-request-failed'){
            return {error: 'No Internet Connection', title: 'Turn on your mobile data or wifi'}
        }
        if(error.code === 'auth/unknown'){
            return {error: 'An unknown error occurred. Please try again later.', title: 'Something went wrong'}
        }
        if (error.code === 'auth/missing-client-identifier'){
            return {error: 'An error occurred. Please try again later or contact support.', title: 'Contact Support'}
        }
        console.error('Error confirming OTP:', error)
        return {error: 'Try sending a fresh otp request using the link below', title: 'Error confirming the OTP'}
    }
}

export const firstTimeConfirmOTP = async (confirmation, otp) => {
    try {
        await confirmation.confirm(otp)
        const registeredUser = await firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .get()
        if(registeredUser.exists) {
            return {isRegistered: true, status: true}
        }else {
            return {isRegistered: false, status: true}
        }
    } catch (error) {
        if (error.code == 'auth/invalid-verification-code') {
            return {error: "The OTP code is incorrect, please check and try again", title: 'Invalid OTP Code '}
        }
        if(error.code == 'auth/too-many-requests'){
            return {error: `Please Try again in ${differenceInHours}h`, title: 'Too many attempts'}
        }
        if(error.code === 'auth/network-request-failed'){
            return {error: 'No Internet Connection', title: 'Turn on your mobile data or wifi'}
        }
        if(error.code === 'auth/unknown'){
            return {error: 'An unknown error occurred. Please try again later.', title: 'Something went wrong'}
        }
        if (error.code === 'auth/missing-client-identifier'){
            return {error: 'An error occurred. Please try again later or contact support.', title: 'Contact Support'}
        }
        console.error('Error confirming OTP:', error)
        return {error: 'Try sending a fresh otp request using the link below', title: 'Error confirming the OTP'}
    }
}