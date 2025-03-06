import React from 'react'
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { useTheme } from '../../../context/ThemeContext'
import { globalStyles } from '../../../themes'

import Animated, { Easing, FadeInLeft, FadeInUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { EmptyPostList, NotificationCard, PageHeader } from '../../../components'
import { scaling } from '../../../themes/themes'

const {verticalScale, horizontalScale, fontScale} = scaling


const Activity = ({navigation}) => {
  const {theme} = useTheme()
  const {activity} = useSelector(state => state.user)
  
  return (
    <SafeAreaView style={[{ backgroundColor: theme.background}, globalStyles.appScreen, globalStyles.spacePadding]}>
      <StatusBar barStyle={theme.statusBarTextColor} backgroundColor={theme.background} />
      {/* Header */}
      <Animated.View entering={FadeInUp.delay(100).springify().easing(Easing.ease)} style={[styles.header]}>
        <PageHeader headerText={'All Activity'} />
      </Animated.View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, rowGap: 30}}>
        
        {/* Notifications */}
        {activity.length > 0 ? (
        <View style={[styles.notification]}>
          {activity.map((notification, i) => (
            <Animated.View entering={FadeInLeft.delay((i + activity.length) * 100).duration(500)} key={i}>
              <NotificationCard activity={notification} />
            </Animated.View>

          ))}
        </View>

        ) : 
        (
          <EmptyPostList icon='bell-off' type='recent activities' />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  notification: {
    gap: 25,
    marginTop: verticalScale(25)
  }
})

export default Activity