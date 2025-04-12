// navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Header from '../components/Header';

// (예시) 스크린들
import HomeScreen from '../screens/HomeScreen';
import CommunityHomeScreen from '../screens/CommunityHomeScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import MyScreen from '../screens/MyScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CommunityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CommunityHome"
        component={CommunityHomeScreen}
        options={({ navigation }) => ({
          header: () => (
            <Header
              showBack={false}
              onSearch={(e) => console.log('search:', e.nativeEvent.text)}
              onPressNotification={() => navigation.navigate('Notifications')}
              onPressProfile={() => navigation.navigate('Profile')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={({ navigation }) => ({
          header: () => (
            <Header
              showBack={true}
              onBack={() => navigation.goBack()}
              placeholder="댓글을 입력해주세요"
              onSearch={(e) => console.log('comment:', e.nativeEvent.text)}
              onPressNotification={() => {}}
              onPressProfile={() => {}}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { height: 60 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="home" size={24} color={focused ? '#000' : '#888'} />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="chat-bubble-outline" size={24} color={focused ? '#000' : '#888'} />
          ),
        }}
      />
      <Tab.Screen
        name="Challenge"
        component={ChallengeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="flag" size={24} color={focused ? '#000' : '#888'} />
          ),
        }}
      />
      <Tab.Screen
        name="My"
        component={MyScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="person" size={24} color={focused ? '#000' : '#888'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
