import { Dimensions } from "react-native";
import DeviceInfo from "react-native-device-info";

const {width, height} = Dimensions.get('window');


//! THIS HELPS TO CHECK IF THE DEVICE HAS A SMALL WIDTH AND A NOTCH AT THE TOP OF THE SCREEN
const isSmall = width <= 375 && !DeviceInfo.hasNotch()

//* THIS HELPER FUNCTIONS HELPS SET ARBITARY NUMBERS FOR OUR MOBILE SCREEN WIDTH AND HEIGHT
//* FOR WHEN WE NEED TO CREATE STYLES FOR DIFFERENT SCREEN, THINK OF IT AS A CSS MEDIA SCREEN
//* QUERY BUT FOR MOBILE SCREEN IN REACT NATIVE


const guidelineBaseWidth = () => {
    if(isSmall) {
        return 330
    }

    return 350
}

const horizontalScale = (size) => (width/guidelineBaseWidth()) * size;

const guidelineBaseHeight = () => {
    if(isSmall) {
        return 550
    } else if(width > 410) return 620

    return 680
}


const verticalScale = (size) => (height / guidelineBaseHeight()) * size

const guidelineBaseFonts = () => {
    if (width > 410) {
        return 430;
    }
    return 400
}

const fontScale = (size) => Math.round((width /guidelineBaseFonts()) * size)


export const color = {
    black: '#0C0C0C',
    darkbackground: '#1A1B23',
    smoke: '#222222',
    white: '#FFFFFF',
    whiteRGBA75: 'rgba(255,255,255,0.75)',
    whiteRGBA90: 'rgba(255,255,255,0.85)',
    whiteRGBA50: 'rgba(255,255,255,0.50)',
    whiteRGBA45: 'rgba(255,255,255,0.45)',
    whiteRGBA32: 'rgba(255,255,255,0.32)',
    whiteRGBA15: 'rgba(255,255,255,0.16)',
    black2: 'rgba(0,0,0, 0.8)',
    blackRGBA50: 'rgba(0,0,0, 0.5)',
    blackRGBA60: 'rgba(0,0,0, 0.6)',
    blackRGBA75: 'rgba(0,0,0, 0.75)',
    blackRGBA90: 'rgba(0,0,0, 0.85)',
    blackRGBA45: 'rgba(0,0,0, 0.45)',
    blackRGBA32: 'rgba(0,0,0, 0.32)',
    blackRGBA15: 'rgba(0,0,0, 0.16)',
    segmentedControl: '#00000026',
    darkGrey: '#0b0b0b',
    grey: '#333333',
    error: '#B31312',
    like: '#FF4B4B',
    success: '#65B741',
    chatBubble: '#E4E4E4D4',
    chatBubbleText: '#383737',
    yellow: '#E2F163',
    gray: '#B6B4C2',
    gray2: '#E2E5DE',
    gradClr1: '#E5AFAF',
    gradClr2: '#C4BCFF',
    gradClr3: '#C2D8BE',
    buttonBGClr: '#FFCCCB',
    buttonBGClr2: '#0F1B44',
    primary: '#9A1CD9',
    primaryRGBA50: 'rgba(154, 28, 217, 0.08)',
    subText: '#8F8588',
    indicator: '#2A2A2A',
    indicator2: '#C7C7C7',
    shadowLight: 'rgba(255,255,255,0.60)',
    shadowDark: 'rgba(0,0,0, 0.6)'

}

export const getFontFamily = (baseFont, weight) => {
    switch (weight) {
        case '100':
            return `${baseFont}-Thin`
        case '200':
            return `${baseFont}-ExtraLight`
        case '300':
            return `${baseFont}-Light`
        case 'normal':
        case '400':
            return `${baseFont}-Regular`
        case '500':
            return `${baseFont}-Medium`
        case '600':
            return `${baseFont}-SemiBold`
        case 'bold':
        case '700':
            return `${baseFont}-Bold`
        case '800':
            return `${baseFont}-ExtraBold`
        case '900':
            return `${baseFont}-Black`
        default:
            return `${baseFont}-Regular`
    }
}

export const scaling = {verticalScale, horizontalScale, fontScale}

export default Theme = {color, scaling, getFontFamily}