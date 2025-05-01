import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BucketListScreen from '../screens/BucketListScreen';
import BucketListAddScreen from '../screens/BucketListAddScreen';
import BucketListDetailScreen from '../screens/BucketListDetailScreen';
import ChallengeRecordScreen from '../screens/ChallengeRecordScreen'; // ✅ 추가

const Stack = createNativeStackNavigator();

export default function BucketListStack() {
    return (
      <Stack.Navigator initialRouteName="BucketListHome">
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
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChallengeRecord"
          component={ChallengeRecordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }
  


