// navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import MyPageScreen from '../screens/MyPageScreen';
import EditInfoScreen from '../screens/EditInfoScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainScreen from '../screens/MainScreen';
import CommentPost from '../screens/CommentPostScreen';
import MyPostsScreen from '../screens/MyPostsScreen';
import LikedPostsScreen from '../screens/LikedPostsScreen';
import AlamScreen from '../screens/AlamScreen';


const Stack = createNativeStackNavigator();

export default function MypageStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Mypage" component={MyPageScreen} />
      <Stack.Screen name="EditionInfo" component={EditInfoScreen} />
      <Stack.Screen name="Notification" component={NotificationSettingsScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="CommentPost" component={CommentPost} />
      <Stack.Screen name="MyPosts" component={MyPostsScreen} />
      <Stack.Screen name="LikedPosts" component={LikedPostsScreen} />
      <Stack.Screen name="Alam" component={AlamScreen} />
      
    </Stack.Navigator>
  );
}
