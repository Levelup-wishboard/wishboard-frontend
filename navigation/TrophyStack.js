// navigation/TrophyStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrophyScreen from '../screens/TrophyScreen';
import TrophyDetailPage1 from '../screens/TrophyDetailPage1';
import TropyDetailPage2 from '../screens/trophyDetailPage2';
import AIRecommend from '../screens/AIRecommend';

const Stack = createNativeStackNavigator();

export default function TrophyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrophyScreen" component={TrophyScreen} />
      <Stack.Screen name="TrophyDetailPage1" component={TrophyDetailPage1} />
      <Stack.Screen name="AIRecommend" component={AIRecommend} />
      <Stack.Screen name="TropyDetailPage2" component={TropyDetailPage2} />
    </Stack.Navigator>
  );
}
