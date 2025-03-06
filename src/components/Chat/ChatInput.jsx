import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AutoCompleteInput, useMessageInputContext } from "stream-chat-react-native";
import { useTheme } from "../../context/ThemeContext";
import { color, getFontFamily, scaling } from "../../themes/themes";
import Icon from "../Icon/Icon";


const {horizontalScale, verticalScale, fontScale} = scaling


const ChatInput = () => {
    const { sendMessage, text} = useMessageInputContext();
    const {theme} = useTheme()

    return (
        <View style={[styles.inputContainer]}>
          <View style={[styles.textInputContainer, {backgroundColor: text.length> 0 ? color.primaryRGBA50 : theme.input, borderColor: text.length> 0 ? color.primary : theme.input}]}>
            <AutoCompleteInput additionalTextInputProps={{style: [styles.input, {color: theme.header}]}} />
            <View style={[styles.options]}>
            </View>
          </View>
          <TouchableOpacity disabled={!text} onPress={sendMessage} style={[styles.chatSend, {backgroundColor: theme.primaryColor}, !text && {opacity: 0.4}]}>
            <Icon name='send' size={fontScale(25)} color={color.white} />        
          </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    inputContainer: {
        // flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: horizontalScale(5),
        gap: 10,
        alignItems: 'center',
    },
    textInputContainer: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
         // flex: 1,
        justifyContent: 'center',
        height: horizontalScale(54),
        paddingHorizontal: horizontalScale(10),
        paddingVertical: horizontalScale(5),
        borderRadius: verticalScale(12),
        gap: 10,
        alignItems: 'center',
    },
    options: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7
    },
    input: {
        flex: 1,
        fontFamily: getFontFamily('PlusJakartaSans', '700'),
        fontSize: fontScale(15),
    },
    chatSend: {
        width: horizontalScale(45),
        height: horizontalScale(45),
        borderRadius: horizontalScale(50),
        justifyContent: 'center',
        alignItems: 'center'
      },
    shadowContainer: {
        position: 'absolute',
        borderRadius: horizontalScale(12),
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
  });

  export default ChatInput