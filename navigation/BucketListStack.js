import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BucketListScreen from '../screens/BucketListScreen';
import BucketListAddScreen from '../screens/BucketListAddScreen';

const Stack = createNativeStackNavigator();

export default function BucketListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BucketListHome"
        component={BucketListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BucketListAdd"
        component={BucketListAddScreen}
        options={{ headerShown: false }} // ✅ 상단 기본 헤더 제거
      />
    </Stack.Navigator>
  );
}

