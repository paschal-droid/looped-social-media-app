import { StyleSheet } from "react-native";
import { scaling, color, getFontFamily } from '../../../themes/themes'

const { verticalScale, horizontalScale, fontScale } = scaling


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: verticalScale(5)
    },
    firstHeader: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center'
    },
    headerText: {
        fontFamily: getFontFamily('PlusJakartaSans', '700'),
        fontSize: fontScale(18),
        lineHeight: fontScale(20),
    },
    sendText: {
        fontFamily: getFontFamily('PlusJakartaSans', '800'),
        fontSize: fontScale(17),
        lineHeight: fontScale(20),
    },
    space: {
        flex: 0.3
    },
    handlerStyle: {
        borderTopRightRadius: horizontalScale(25),
        borderTopLeftRadius: horizontalScale(25),
    },
    contentContainer: {
        flex: 1,
        padding: horizontalScale(20),
    },
    scrollableContentContainer: {
        // flex: 1
    },
    commentSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    commentProfile: {
        gap: 15,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    commentProfileImage: {
        width: horizontalScale(30),
        aspectRatio: 1/1,
        borderRadius: horizontalScale(27),
    },
    input: {
      fontSize: fontScale(15),
      fontFamily: getFontFamily('PlusJakartaSans', '500'),
      lineHeight: fontScale(26),
      letterSpacing: 0.28,
      flex: 1,
      paddingLeft: horizontalScale(20),
      borderRadius: horizontalScale(10),
    },
    commentCountText: {
        fontSize: fontScale(15),
        fontFamily: getFontFamily('PlusJakartaSans', '500'),
        lineHeight: fontScale(26)
    },
    
    userAddCommentInputAction: {
        marginRight: horizontalScale(10),
        padding: horizontalScale(5)
    },
})

export default styles