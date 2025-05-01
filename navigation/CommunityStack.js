// navigation/CommunityStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityHomeScreen from '../screens/CommunityHomeScreen';
import CommunityDetailScreen from '../screens/CommunityDetailScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import PostWriteScreen from '../screens/PostWriteScreen'
import KeywordRegisterScreen from '../screens/KeywordRegisterScreen';
import SearchCommunityScreen from '../screens/SearchCommunityScreen';
import CommunityCreateScreen from '../screens/CommunityCreateScreen';

const Stack = createNativeStackNavigator();

export default function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunityHome" component={CommunityHomeScreen} />
      <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="PostWrite" component={PostWriteScreen} />
      <Stack.Screen name="KeywordRegister" component={KeywordRegisterScreen} options={{ title: '알림 키워드' }} /> 
      <Stack.Screen name="CommunitySearch" component={SearchCommunityScreen} options={{ title: '커뮤니티 검색' }}/>
      <Stack.Screen name="CommunityCreate" component={CommunityCreateScreen} />
    </Stack.Navigator>
  );
}
