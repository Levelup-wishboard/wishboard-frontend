import React,{ useState } from 'react';
import { View, StyleSheet , StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [headerTitle, setHeaderTitle] = useState('홈');

  const handleNavigationStateChange = (state) => {
    if (!state) return;
    const currentRoute = state.routes[state.index];
    let title;
    switch (currentRoute.name) {
      case 'Home':
        title = '홈';
        break;
      case 'BucketList':
        title = '버킷리스트';
        break;
      case 'Community':
        title = '';
        break;
      case 'Trophy':
        title = '트로피';
        break;
      default:
        title = '홈';
    }
    setHeaderTitle(title);
  };

  return (
    <NavigationContainer onStateChange={handleNavigationStateChange}>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    height: 80,
  },
  navigatorWrapper: {
    flex: 1,
  },
});