import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from '../screens/MainScreen'; // 첫 진입 화면
import LoginScreen from '../screens/LoginScreen';
import MyPageScreen from '../screens/MyPageScreen';
import AppNavigator from './AppNavigator'; // 탭 포함된 네비게이터
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
         <Stack.Screen name="Main" component={Main} />
         <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="MypageScreen" component={MyPageScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    <Stack.Screen name="AppTabs" component={AppNavigator} />
    
  </Stack.Navigator>
  

  );
}
