// utils/NavigationService.js
import { createNavigationContainerRef, useNavigationState } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const navigate = ({name, nestedScreens, params}) => {
  if (navigationRef.current?.isReady()) {
    if(nestedScreens != ''){
        navigationRef.navigate(name, {screen: nestedScreens, params: params});
    } 
    navigationRef.navigate(name, params)
  }
};
