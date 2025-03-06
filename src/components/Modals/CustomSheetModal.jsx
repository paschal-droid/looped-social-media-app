import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import PropTypes from 'prop-types';
import React, { useMemo, useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getFontFamily, scaling } from '../../themes/themes';

const { verticalScale, horizontalScale, fontScale } = scaling
const {height} = Dimensions.get('window')


const CustomSheetModal = ({children, openModal}) => {
    const snapPoints = useMemo(() => ['50%', '75%'], []);
    const { theme } = useTheme()
    const customSheetModalRef = useRef(null);


    const returnToPost = () => {
        openModal(false)
    }


    return (

        <BottomSheet
            ref={customSheetModalRef}
            snapPoints={snapPoints}
            backgroundStyle={[styles.handlerStyle, { backgroundColor: theme.background, borderWidth: 0.5, borderColor: theme.oppositeBackground }]}
            handleIndicatorStyle={{ backgroundColor: theme.header, width: 50 }}
            enablePanDownToClose
            onClose={() => returnToPost()}

        >
            <BottomSheetView style={[styles.contentContainer]}>
                <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles]}>
                    {children}
                </BottomSheetScrollView>

            </BottomSheetView>
        </BottomSheet>
    )
}

CustomSheetModal.propTypes = {
    openModal: PropTypes.func.isRequired
}

export default CustomSheetModal

const styles = StyleSheet.create({
    handlerStyle: {
        borderTopRightRadius: horizontalScale(35),
        borderTopLeftRadius: horizontalScale(35),
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: horizontalScale(22),
        paddingVertical: horizontalScale(10),
    },
    scrollableContentContainer: {
        height: height*0.8,
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
        width: horizontalScale(27),
        aspectRatio: 1/1,
        borderRadius: horizontalScale(27),
    },
    input: {
      fontSize: fontScale(15),
      fontFamily: getFontFamily('PlusJakartaSans', '400'),
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