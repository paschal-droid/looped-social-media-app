import { StyleSheet} from "react-native"
import { scaling, color, getFontFamily} from "./themes"

const {horizontalScale, verticalScale, fontScale} = scaling
const styles = StyleSheet.create({
    appScreen: {
        flex: 1,
    },
    space: {
        marginTop: verticalScale(20),
        marginHorizontal: horizontalScale(22)
    },
    spacePadding: {
        paddingVertical: verticalScale(18),
        paddingHorizontal: horizontalScale(18)
    },
    noView: {
        flex: 1,
        justifyContent: 'center'
    },
    noConnectionContainer: {
        flex: .7
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})


export default styles