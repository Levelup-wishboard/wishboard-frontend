// navigation/CommunityStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityHomeScreen from '../screens/CommunityHomeScreen';
import CommunityDetailScreen from '../screens/CommunityDetailScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import PostWriteScreen from '../screens/PostWriteScreen'

const Stack = createNativeStackNavigator();

export default function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunityHome" component={CommunityHomeScreen} />
      <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="PostWrite" component={PostWriteScreen} />
    </Stack.Navigator>
  );
}
