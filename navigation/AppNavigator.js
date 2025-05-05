import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommunityStack from './CommunityStack';
import HomeStack from './HomeStack';
import BucketListStack from './BucketListStack'; // ✅ 버킷리스트 Stack 연결
import TrophyStack from './TrophyStack'; // ✅ 트로피 Stack도 유지
import MypageStack from './MyPageStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



//  화면별 임시 컴포넌트 
function HomeScreen() {
  return <MainScreen />
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


// function TrophyScreen() {
  // return (
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <Text>트로피 화면</Text>
    // </View>
    // <Stack.Navigator>
      // <Stack.Screen name="Trophy" component={TrophyHomeScreen} />
      // <Stack.Screen name="TrophyDetail" component={TrophyDetailScreen} options={{ title: '트로피 상세' }} />
    // </Stack.Navigator>

  // );
// }



const Tab = createBottomTabNavigator();
const HiddenStack = createNativeStackNavigator();

function HiddenStackScreen() {
  return (
    <HiddenStack.Navigator screenOptions={{ headerShown: false }}>
      <HiddenStack.Screen name="mypage" component={MypageStack} />
    </HiddenStack.Navigator>
  );
}

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
      <Tab.Screen name="BucketList" component={BucketListStack} />
      <Tab.Screen name="Community" component={CommunityStack} />
      <Tab.Screen name="Trophy" component={TrophyStack} />
      <Tab.Screen
        name="mypage"
        component={HiddenStackScreen}
        options={{
          tabBarButton: () => null, 
          tabBarItemStyle: {
            display: 'none', 
            width: 0,
          },
        }}
      />

    </Tab.Navigator>
  );
}
