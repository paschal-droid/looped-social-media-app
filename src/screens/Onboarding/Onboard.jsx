import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import { globalStyles } from '../../themes';
import { scaling, getFontFamily,  color} from '../../themes/themes';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardAnimatedView, DoneButton, NextButton} from '../../components';
import { Routes } from '../../navigation/Routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';


const {horizontalScale, verticalScale, fontScale} = scaling
const {width, height} = Dimensions.get('window')

const Onboard = ({navigation}) => {
  const {theme} = useTheme()
  const statusBarColors = [{clr: '#E5AFAF'}, {clr:'#C4BCFF'}, {clr: '#C2D8BE'},]


  const [progress, setProgress] = useState(33)
  const [index, setIndex] = useState(0)
  const [statusBarColor, setStatusBarColor] = useState(statusBarColors[0].clr)
  


  useEffect(() => {
    switch (index) {
      case 0:
        setProgress(Math.floor(100/3))
        break;
      case 1:
        setProgress(Math.floor(100/1.5))
        break;
      // case 2:
      //   setProgress(Math.floor(100/1.33))
      //   break;
      default:
        break;
    }
   }, [index])

  const handleOnboardWizard = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    // navigation.navigate(Routes.RegistrationFlow)
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: Routes.RegistrationFlow,
            state: {
              routes: [{ name: Routes.SignUpFlow1}],
            },
          },
        ],
      })
    );
  }

  const doneComponent  = ({...props}) => {
    return (
      <DoneButton {...props} />
    )
  }

  const nextButton = ({...props}) => {
    return (
      <NextButton progress={progress} {...props} />
    )
  }

  const changePageHandler = (index) => {
    setIndex(index)
    setStatusBarColor(statusBarColors[index].clr)
  }

  return (
    <SafeAreaView style={[globalStyles.appScreen]}>
      <StatusBar barStyle={'dark-content'} backgroundColor={statusBarColor} />
      <Onboarding
        pageIndexCallback={(val) => changePageHandler(val)}
        containerStyles={styles.container}
        imageContainerStyles={styles.imageContainer}
        titleStyles={styles.title}
        bottomBarHighlight={false}
        subTitleStyles={styles.subtitle}
        showSkip={false}
        onDone={handleOnboardWizard}
        DoneButtonComponent={doneComponent}
        NextButtonComponent={nextButton}
        pages={[
          {
            backgroundColor: color.gradClr1,
            image: <OnboardAnimatedView vibeString='Posts' />,
            title: <Text style={[styles.title]}>Share your thoughts, Inspire your world!</Text>,
            subtitle: '',
          },
          {
            backgroundColor: color.gradClr2,
            image: <OnboardAnimatedView vibeString='Stories' />,
            title: <Text style={[styles.title]}>Moments that disappear, Memories that last!</Text>,
            subtitle: '',
          },
          {
            backgroundColor: color.gradClr3,
            image: <OnboardAnimatedView vibeString='Videos' />,
            title: <Text style={[styles.title]}>Bring your world to life with Videos!</Text>,
            subtitle: '',
          },          
        ]}
      />
    </SafeAreaView>
  )
}

export default Onboard

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingVertical: verticalScale(30),
    paddingHorizontal: horizontalScale(22)
  },
  title: {
    alignSelf: 'center',
    textAlign: 'center',
    color: color.white,
    fontFamily: getFontFamily('PlusJakartaSans', '800'),
    // lineHeight: fontScale(36),
    fontSize: fontScale(34),
    marginBottom: verticalScale(20),
    paddingHorizontal: horizontalScale(20)
  },
  subtitle: {
    fontFamily: getFontFamily('Poppins', '400'),
    lineHeight: fontScale(21),
    fontSize: fontScale(14)
  },
  imageContainer: {
    
  }
})