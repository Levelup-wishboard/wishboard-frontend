import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationSettingsScreen() {
  
  const navigation = useNavigation();
  const [switches, setSwitches] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const res = await axios.get('http://192.168.0.41:8080/users/selectAlam', {  //본인 pc ip주소로 바꿔줘야함.
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const mapped = res.data.data.map((item) => {
          const createdDate = new Date(item.createdAt);
          const today = new Date();
        
          // 오늘 기준으로 얼마나 전/후인지 (밀리초 → 일수)
          const diffTime = createdDate.getTime() - today.getTime(); // 미래면 양수
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
          let dDay;
          if (diffDays === 0) {
            dDay = 'D-DAY';
          } else if (diffDays > 0) {
            dDay = `D-${diffDays}`;
          } else {
            dDay = `D+${Math.abs(diffDays)}`;
          }
        
          return {
            id: item.notificationId,
            day: item.createdAt,
            title: item.message,
            tag: item.type,
            dDay
          };
        });
        
  
        setSwitches(mapped);
      } catch (err) {
        console.error('알림 목록 조회 실패', err);
        Alert.alert('오류', '알림 목록을 불러오지 못했습니다.');
      }
    };
  
    fetchNotifications();
  }, []);
  

  const toggleSwitch = (index) => {
    const updated = [...switches];
    updated[index].on = !updated[index].on;
    setSwitches(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
       {/* 헤더 */}
       <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FBA834" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} >알림 설정</Text>
      </View>


      <ScrollView contentContainerStyle={styles.content}>
        {switches.map((item, index) => (
          <View key={item.id} style={styles.itemContainer}>
            <View>
              <View style={styles.labelRow}>
                <Text style={styles.tag}>{item.dDay}</Text>
                <Text style={styles.label}>{item.tag}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
            </View>

            <TouchableOpacity onPress={() => toggleSwitch(index)}>
              <Image
                source={
                  item.on
                    ? require('../assets/images/toggle1.png')
                    : require('../assets/images/toggle2.png')
                }
                style={styles.toggleImage}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#2F336A',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: { fontSize: 16, color:"#FBA834", fontWeight: 'bold' },
  content: { paddingHorizontal: 0, paddingTop: 10 },

  itemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },

  tag: {
    backgroundColor: '#F0F0F0', // 연회색
    color: '#555',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '500',
  },

  label: {
    backgroundColor: '#93DEFF', 
    color: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },

  toggleImage: {
    width: 48,
    height: 28,
    resizeMode: 'contain',
    marginTop: 8,
  },
});
