import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrophyScreen from '../screens/TrophyScreen';
import CommunityStack from './CommunityStack';
import CommunityHomeScreen from '../screens/CommunityHomeScreen';
import HomeStack from './HomeStack'; // ✅ 변경된 부분

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
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
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="BucketList" component={() => null} />
      <Tab.Screen name="Community" component={CommunityStack} />
      <Tab.Screen name="Trophy" component={TrophyScreen} />
    </Tab.Navigator>
  );
}
