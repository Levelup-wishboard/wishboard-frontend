import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommunityStack from './CommunityStack';
import CommunityHomeScreen from '../screens/CommunityHomeScreen';

//  화면별 임시 컴포넌트 
function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>홈 화면</Text>
    </View>
  );
}

function BucketListScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>버킷리스트 화면</Text>
    </View>
  );
}

function CommunityScreen() {
  return <CommunityHomeScreen />;
}

function TrophyScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>트로피 화면</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'BucketList') {
            iconName = focused ? 'flag' : 'flag-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Trophy') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FBA834',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
      <Tab.Screen name="BucketList" component={BucketListScreen} options={{ title: '버킷리스트' }} />
      <Tab.Screen name="Community" component={CommunityStack} options={{ title: '커뮤니티' }} />
      <Tab.Screen name="Trophy" component={TrophyScreen} options={{ title: '트로피' }} />
    </Tab.Navigator>
  );
}