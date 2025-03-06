import React, { useContext, useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../../context/ThemeContext'
import { globalStyles } from '../../../themes'

import { useDispatch, useSelector } from 'react-redux'
import { saveBioInfoToDatabase } from '../../../api/cloudStorageRequests'
import { AppLoader, AuthActionButton, HeaderTypeA, InAppNotification, NavPressable, Tabs } from '../../../components'
import PushNotificationContext from '../../../context/PushNotificationContext'
import { interests } from '../../../data/dataConstants'
import { Routes } from '../../../navigation/Routes'
import { updateInterests } from '../../../redux/reducers/BioInfo'
import { getFontFamily, scaling } from '../../../themes/themes'


const {verticalScale, horizontalScale, fontScale} = scaling




const InterestSelection = ({navigation}) => {
  const {theme} = useTheme()
  const dispatch = useDispatch()
  const bioInfo = useSelector(state => state.bioInfo)
  const {setNotification} = useContext(PushNotificationContext)

  const [loading, setLoading] = useState(false)


  const handleAccountCompletion = async () => {
    setLoading(true)
    const completeAccountSetup = await saveBioInfoToDatabase(bioInfo)
    if(completeAccountSetup.success){
    setLoading(false)
      navigation.navigate(Routes.SignupFlow6)
    }
    setLoading(false)
    setNotification({
      message: completeAccountSetup.error,
      title: completeAccountSetup.title,
      url: '',
      timing: 8000
    });
  }


  
  

  return (
    <>
    <InAppNotification />
    {loading && <AppLoader />}
    <SafeAreaView style={[{ backgroundColor: theme.background}, globalStyles.spacePadding, globalStyles.appScreen, styles.interestSelectionSection,]}>
      <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />
      <NavPressable icon={'arrow-backward'} onPress={() => navigation.goBack()} /> 
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.interestSelectionContainer}>
          <HeaderTypeA title='Personalize your experience' subTitle='Customize your Feed by following topics that interest you the most' />
          
          {/* Interest Tabs Section */}
          <View style={styles.interestPicker}>
            {interests.map(item => (
              <Tabs
                tabId={item.interestId}
                key={item.interestId}
                name={item.name}
                onPress={() => dispatch(updateInterests(item.name))}
                isInactive={
                  bioInfo.selectedInterests.includes(item.name) !==
                  true
                }
                />
              ))}
          </View>

          {/* Final Submission of all user bio data */}
          <View style={styles.interestActions}>
            <Pressable onPress={handleAccountCompletion} style={styles.interestSkip}>
              <Text style={[styles.interestSkipText, { color: theme.oppositeBackground }]}>Skip</Text>
            </Pressable>
            <AuthActionButton
              handleAction={handleAccountCompletion}
              actionText="Let's Get Started"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </>
  )
}

export default InterestSelection

const styles = StyleSheet.create({
  interestSelectionSection: {
    gap: 20
  },
  interestSelectionContainer: {
    gap: 35
  },
  interestPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap:  16,
    columnGap: 14,
  },
  appheader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  interestActions: {
    gap: 20,
    marginTop: verticalScale(20)
  },
  interestSkip: {
    alignItems: 'center'
  },
  interestSkipText: {
    fontFamily: getFontFamily("PlusJakartaSans", "800"),
    fontSize: fontScale(20)
  }
})