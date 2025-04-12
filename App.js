import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from './components/Header';

// 각 화면에 해당하는 컴포넌트 
function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header leftContent="홈" />
      <View style={styles.content}>
        <Text>앱이 정상적으로 시작되었습니다!</Text>
      </View>
    </View>
  );
}

function BucketListScreen() {
  return (
    <View style={styles.container}>
      <Header leftContent="버킷리스트" />
      <View style={styles.content}>
        <Text>버킷리스트 화면입니다.</Text>
      </View>
    </View>
  );
}

function CommunityScreen() {
  return (
    <View style={styles.container}>
      <Header leftContent="커뮤니티" />
      <View style={styles.content}>
        <Text>커뮤니티 화면입니다.</Text>
      </View>
    </View>
  );
}

function TrophyScreen() {
  return (
    <View style={styles.container}>
      <Header leftContent="트로피" />
      <View style={styles.content}>
        <Text>트로피 화면입니다.</Text>
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
          headerShown: false, // 각 화면은 Header 컴포넌트를 직접 렌더링하므로 내부 헤더는 숨김
          tabBarShowLabel: false, 
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
        <Tab.Screen name="BucketList" component={BucketListScreen} options={{ title: '버킷리스트' }} />
        <Tab.Screen name="Community" component={CommunityScreen} options={{ title: '커뮤니티' }} />
        <Tab.Screen name="Trophy" component={TrophyScreen} options={{ title: '트로피' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
