import { StyleSheet, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'

import { scaling, getFontFamily, color} from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'
import { SelectList } from 'react-native-dropdown-select-list'


const {horizontalScale, verticalScale, fontScale} = scaling

const SelectInput = ({data, handleSelection, placeholder, icon, showDropdown}) => {
    const {theme} = useTheme()

  return (
      <View style={[styles.dropdown]}>
          <SelectList
            setSelected={(val) => handleSelection(val)}
            data={data}
            save="key"
            dropdownShown={showDropdown}
            search={false}
            boxStyles={[styles.inputContainer]}
            inputStyles={[styles.inputStyles]}
            dropdownTextStyles={[styles.dropdownText]}
            arrowicon={<></>}
            dropdownStyles={[styles.dropdownContainer]}
            placeholder={placeholder}    
          />
      </View>
  );
}


SelectInput.propTypes = {
  handleSelection: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  placeholder: PropTypes.string.isRequired,
  showDropdown: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
    dropdownText: {
        fontFamily: getFontFamily('Poppins', '700'),
        fontSize: fontScale(14),
        color: color.white
    },
    dropdownContainer: {
        width: horizontalScale(62)
    },
    dropdown: {},
    inputContainer: {
        justifyContent: 'center',
        height: horizontalScale(38),
        flexDirection: 'row',
        width: horizontalScale(62),
        alignItems: 'center',
    },
    inputStyles: {
        color: color.white,
        fontFamily: getFontFamily('Poppins', '700'),
        fontSize: fontScale(14),
    },
});


export default SelectInput
