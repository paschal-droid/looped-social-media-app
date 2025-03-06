import { StyleSheet, View, TextInput } from 'react-native'
import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { scaling, getFontFamily, color} from '../../themes/themes'
import { useTheme } from '../../context/ThemeContext'

const {horizontalScale, verticalScale, fontScale} = scaling

const BioInput = ({useExtraFeatures=false, autoCapitalize, value, handleTextChange, placeholder, keyboardType, secureTextEntry, errorType, isEditable=true}) => {
    const textInputRef = useRef(null)

    const handleFocus = () => {
        textInputRef.current.focus()
    }

    const {theme} = useTheme()

    const extraInputProps = useExtraFeatures ? {
        multiline: true,
        numberOfLines: 10,
        textAlignVertical: 'top'
    } : {}

  return (
    <View style={[styles.inputContainer]}>
        <TextInput
            onFocus={handleFocus}
            autoCapitalize={autoCapitalize ? autoCapitalize : 'words'}
            value={value}
            placeholderTextColor={theme.header}
            onChangeText={value => handleTextChange(value)}
            ref={textInputRef}
            editable={isEditable}
            placeholder={placeholder}
            style={[styles.input, { color: theme.header, borderColor: theme.oppositeBackground }]}
            keyboardType={keyboardType ? keyboardType : 'default'}
            secureTextEntry={secureTextEntry}
            {...extraInputProps}
        />
    </View>
  )
}

BioInput.propTypes = {
    handleTextChange: PropTypes.func,
    value: PropTypes.string,
    errorType: PropTypes.string,
    placeholder: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    keyboardType: PropTypes.string,
    autoCapitalize: PropTypes.string,
    useExtraFeatures: PropTypes.bool,
    isEditable: PropTypes.bool,
}

const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,       
    },
    input: {
        flex: 1,
        paddingHorizontal: horizontalScale(20),
        fontFamily: getFontFamily('PlusJakartaSans', '600'),
        fontSize: fontScale(16),
        borderRadius: horizontalScale(25),
        borderColor: color.white,
        borderWidth: 1,
        lineHeight: horizontalScale(20),
        // letterSpacing: .28,
    },
})

export default BioInput
