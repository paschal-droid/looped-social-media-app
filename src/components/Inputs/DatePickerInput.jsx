import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import Icon from '../Icon/Icon'
import { scaling, getFontFamily, color } from '../../themes/themes'
import { monthNames } from '../../data/dataConstants'

const {verticalScale, horizontalScale, fontScale} = scaling


const DatePickerInput = ({onPress= () => {}, date}) => {
    const {theme} = useTheme()
    const [selectedDate, setselectedDate] = useState(date)
    const [showBirthDate, setBirthDate] = useState(false)
    const currentDate = new Date()

    const year = selectedDate.getFullYear().toString();
    const monthIndex = selectedDate.getMonth(); // Month index (0-11)
    const month = monthNames[monthIndex]; // Get month name from array
    const day = selectedDate.getDate().toString().padStart(2, '0');


    useEffect(() => {
        setselectedDate(date)
        if (date < currentDate) {
            setBirthDate(true)
        } else {
            setBirthDate(false)
        }
    }, [date])


  return (
    <Pressable onPress={onPress} style={[styles.dateContainer, {borderColor: theme.paragraph}]}>
      <Icon
        style={[styles.dateAction]}
        name={'calendar'}
        size={fontScale(20)}
        color={theme.icon}
      />
      <Text style={[styles.date, {color: theme.header}]}>{ showBirthDate && date.getFullYear() != currentDate.getFullYear() ? `${day} ${month} ${year}` : 'Date Of Birth'}</Text>
    </Pressable>
  )
}

export default DatePickerInput

const styles = StyleSheet.create({
  dateContainer: {
    justifyContent: 'center',
    height: verticalScale(50),
    flexDirection: 'row',
    flex: 1,
    borderWidth: 2,
    borderRadius: 1000,
    alignItems: 'center',
  },
  date: {
    flex: 1,
    marginLeft: horizontalScale(45),
    marginRight: horizontalScale(20),
    fontFamily: getFontFamily('PlusJakartaSans', '800'),
    fontSize: fontScale(16),
    lineHeight: horizontalScale(20),

  },
  dateAction: {
    position: 'absolute',
    left: horizontalScale(16),
    height: '100%',
    width: horizontalScale(20),
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});