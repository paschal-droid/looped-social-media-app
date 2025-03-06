import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'

import { scaling, getFontFamily, color} from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'
import Icon from '../Icon/Icon'


const {horizontalScale, verticalScale, fontScale} = scaling

const SearchInput = (props) => {
    const {theme} = useTheme()
  return (
    <View style={[styles.inputContainer, { backgroundColor: props.search.length > 0 ? color.primaryRGBA50 : theme.input}]}>
        <TouchableOpacity style={[styles.inputAction]} onPress={props.onSearch}>
            <Icon name={props.search.length > 0 ? 'search' : 'search-outline'} size={fontScale(20)} color={props.search.length > 0 ? theme.primaryColor: theme.placeholder} />
        </TouchableOpacity>
        <TextInput value={props.search} onChangeText={(value) => props.handleTextChange(value)} placeholder={props.placeholder ? props.placeholder : 'Search here...' } placeholderTextColor={theme.placeholder} style={[styles.input, { color: theme.header }]} />
        {props.search.length > 0 && (
            <TouchableOpacity style={styles.inputAction2} onPress={props.onClose}>
                <Icon name='close2' size={fontScale(28)} color={theme.placeholder} />
            </TouchableOpacity>
        )}
    </View>
  )
}

SearchInput.propTypes = {
    handleTextChange: PropTypes.func.isRequired,
    search: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired, 
    placeholder: PropTypes.string
}

const styles = StyleSheet.create({
  inputContainer: {
    // flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    // height: verticalScale(50),
    paddingHorizontal: horizontalScale(20),
    paddingVertical: horizontalScale(5),
    borderRadius: verticalScale(12),
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: getFontFamily('PlusJakartaSans', '600'),
    fontSize: fontScale(15),
  },
  inputAction: {
    width: horizontalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputAction2: {
    width: horizontalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default SearchInput
