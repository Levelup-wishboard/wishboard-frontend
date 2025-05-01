import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BucketListScreen from '../screens/BucketListScreen';
import BucketListAddScreen from '../screens/BucketListAddScreen';
import BucketListDetailScreen from '../screens/BucketListDetailScreen'; // ✅ 추가

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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BucketListDetail"
        component={BucketListDetailScreen}
        options={{ headerShown: false }} // ✅ detail도 헤더 숨김 처리
      />
    </Stack.Navigator>
  );
}


