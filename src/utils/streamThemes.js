import themes, { getFontFamily, scaling } from "../themes/themes";

const {fontScale, verticalScale, horizontalScale} = scaling;

// utils/streamThemeMapper.js
export const mapToStreamTheme = (appTheme) => ({
  colors: {
    // Core colors (docs: https://getstream.io/chat/docs/sdk/reactnative/theming/theme-overview/)
    primary: appTheme.primaryColor,
    accent_blue: appTheme.primaryColor,
    accent_green: appTheme.success,
    accent_red: appTheme.error,
    white: '#FFFFFF',
    black: '#1A1B23',
    grey: appTheme.subText,


    // Message bubbles (docs: https://getstream.io/chat/docs/sdk/reactnative/theming/message-components/)
    messageBubble: {
      background: appTheme.chatBubble, // Others' messages
      mineBackground: appTheme.primaryColor, // Your messages
      text: appTheme.chatBubbleText, // Others' text
      mineText: appTheme.background, // Your text
    },

    // Input (docs: https://getstream.io/chat/docs/sdk/reactnative/theming/message-input/)
    inputBackground: appTheme.input,
    inputText: appTheme.chatBubbleText,

    // Channel list (docs: https://getstream.io/chat/docs/sdk/reactnative/theming/channel-list/)
    channelPreview: {
      background: appTheme.background,
      title: appTheme.header,
      subtitle: appTheme.subText,
    },
   

    // Buttons (docs: https://getstream.io/chat/docs/sdk/reactnative/theming/buttons/)
    buttonPrimary: appTheme.buttonBGClr,
    buttonPrimaryPressed: appTheme.buttonBGClr2,
    buttonText: appTheme.header,

    // Global background (NEW: Set chat body background)
    screenBackground: appTheme.background, // Entire screen
    contentBackground: appTheme.background, // Message list area
  },
  messageList: {
    container: {
      backgroundColor: appTheme.background,
    },
    messageSystem: {
      dateText: {
        fontSize: 20
      }
    },
  },
  messageInput: {
    container: {
      backgroundColor: appTheme.background
    },
  },
  messageSimple: {
    content: {
      markdown: {
        text: {
          fontFamily: getFontFamily('PlusJakartaSans', '600'),
          fontSize: fontScale(17),
          color: appTheme.header
        },
      },
      receiverMessageBackgroundColor: appTheme.receiverChatBubble,
      senderMessageBackgroundColor:  appTheme.senderChatBubble,
    },
  },
  channelPreview: {
    date: {
      container: {
        backgroundColor: appTheme.primaryColor,
      },
      text: {
        color: appTheme.header,
        fontSize: 30
      },
    },
  },
  fonts: {
    body: 'Inter-Regular',
    bold: 'Inter-Bold',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
});