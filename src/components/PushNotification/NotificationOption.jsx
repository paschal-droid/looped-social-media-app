import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { Routes } from '../../navigation/Routes';
import { getFontFamily, scaling } from '../../themes/themes';
import Icon from '../Icon/Icon';



const {verticalScale, horizontalScale, fontScale} = scaling

const NotificationOption = ({activity=true}) => {
  const {theme} = useTheme()
  const navigation = useNavigation()
  

  return (
    <View style={styles.container}>
      {/* Menu Icon Area */}
      <TouchableOpacity onPress={() => navigation.push(Routes.Friends)} style={{gap: 4, flexDirection: 'row', alignItems: 'center'}}>
        <Icon name="friends" size={fontScale(20)} color={theme.background} />
        <Text style={[styles.friendsText, {color: theme.background}]}>Find friends</Text>
      </TouchableOpacity>

      {/* Segmented Control Area */}
      <View
        style={[styles.segmentedControlContainer]}>
          <TouchableOpacity style={[styles.segment,{backgroundColor: theme.background}]} onPress={() => navigation.navigate(Routes.Activity)}>
            <Icon
              name={'notification-bing'}
              size={fontScale(28)}
              color={theme.iconSecondary}
            />
            {activity && <View style={[styles.alert, {backgroundColor: theme.like}]} />}
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(10),
  },
  segmentedControlContainer: {
    flexDirection: 'row',
    borderRadius: horizontalScale(16),
    width: horizontalScale(50),
    height: verticalScale(30),
    overflow: 'hidden'
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  friendsText: {
    fontFamily: getFontFamily('Poppins', '500'),
    fontSize: fontScale(14),
    textTransform: 'capitalize',
    letterSpacing: 0.2
  },
  alert: {
    width: horizontalScale(5),
    height: horizontalScale(5),
    borderRadius: horizontalScale(100),
    position: 'absolute',
    right: horizontalScale(17),
    top: horizontalScale(8),
  }
});

export default NotificationOption