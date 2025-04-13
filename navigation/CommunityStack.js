// navigation/CommunityStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityHomeScreen from '../screens/CommunityHomeScreen';
import CommunityDetailScreen from '../screens/CommunityDetailScreen';

const Stack = createNativeStackNavigator();

export default function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunityHome" component={CommunityHomeScreen} />
      <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} />
    </Stack.Navigator>
  );
}
