import React,{ useState } from 'react';
import { View, StyleSheet , StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import Header from './components/Header';

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
        title = '커뮤니티';
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
      {/* Header 영역: 네비게이션 상태에 따라 왼쪽 텍스트가 바뀌도록 */}
      <View style={styles.headerWrapper}>
        <Header leftContent={headerTitle} />
      </View>
      {/* 네비게이터  */}
      <View style={styles.navigatorWrapper}>
        <AppNavigator />
      </View>
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
