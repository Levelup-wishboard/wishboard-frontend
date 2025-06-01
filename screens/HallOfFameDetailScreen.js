import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CATEGORY_COLORS = {
  '해보고싶다': '#93DEFF',
  '배우고싶다': '#FF9393',
  '되고싶다': '#93FFC9',
  '갖고싶다': '#FFFF93',
  '가보고싶다': '#CC93FF',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export default function HallOfFameDetailScreen({ route, navigation }) {
  const { item  } = route.params;
  
  const [trophy, setTrophy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrophyDetail = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('로그인 필요', '다시 로그인 해주세요.');
          return;
        }

        const response = await axios.get(`http://3.39.187.114:8080/HallOfFame/detail/${item.bucketId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setTrophy(response.data);
      } catch (error) {
        console.error('상세정보 불러오기 실패:', error);
        Alert.alert('오류', '상세 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrophyDetail();
  }, [item.bucketId]);

  // 예시: 해당 유저의 트로피 정보
  // const trophy = {
  //   category: '해보고싶다',
  //   color: '#93DEFF',
  //   title: '열기구 타기',
  //   createdAt: '2024.04.21',
  //   targetDate: '2025.02.14',
  // };

  // const reason = '여행 중 열기구를 보고 꼭 타보고 싶었어요.';
  // const promise = '끝까지 도전해서 꼭 달성할 거예요!';
  // const imageUri = require('../assets/images/bungee.png');
  if (!trophy) {
    return (
      <View style={styles.wrapper}>
        <Text style={{ padding: 20, textAlign: 'center' }}>로딩 중...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Image source={require('../assets/images/trophy.png')} style={styles.trophy} />

          <View style={styles.headerText}>
            <Text style={styles.firstLine}>{item.nickname}님이 달성한 버킷리스트</Text>
            <View style={styles.badgeRow}>
              <Text style={[styles.badge, { backgroundColor: CATEGORY_COLORS[trophy.category] || '#ccc' }]}>
                {trophy.category}
              </Text>
              <Text style={styles.title}>{trophy.title}</Text>
            </View>
            <Text style={styles.date}>작성일: {formatDate(trophy.createdAt)}</Text>
            <View style={styles.bottomBox}>
                <Text style={styles.date}>달성일: {formatDate(trophy.achievedAt)}</Text>
                {/* {origin === 'ai' && (
                    <TouchableOpacity style={styles.aiButton} onPress={() => console.log('AI 버튼 눌림')}>
                        <Text style={styles.aiButtonText}>목표 추가하기</Text>
                    </TouchableOpacity>
                    )} */}
            </View>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.dateLabel}>{formatDate(trophy.createdAt)}</Text>

        <View style={styles.imageBox}>
        <Image source={{ uri: trophy.image }} style={styles.image} />
        </View>

        <View style={styles.textBox}>
          <Text style={styles.inputLabel}>이 꿈을 꾸게 된 이유</Text>
          <Text style={styles.textContent}>{trophy.reason}</Text>

          <Text style={styles.inputLabel}>포기하지 않기 위한 나만의 다짐</Text>
          <Text style={styles.textContent}>{trophy.resolution}</Text>
        </View>
        
      </ScrollView>
      <TouchableOpacity style={styles.fixedButton} onPress={() => navigation.navigate('HallOfFameDetailScreen2', {  name: item.nickname,id: item.bucketId, index: 0 })}>
            <Text style={styles.buttonText}>{'다음 페이지>'}</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  textBox: {
    padding: 20,
  },
  header: {
    backgroundColor: '#333A73', 
    paddingTop: 30,
    padding: 15,
    flexDirection: 'column',
    gap: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  firstLine: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    color: '#000',
    // paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 10,
    marginRight: 8,
    height: 15,
    width: 62,
  },
  title: {
    fontSize: 14,
    color: '#fff',
    // fontWeight: 'bold',
  },
  date: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  imageBox: {
    width: 240,
    height: 220,
    backgroundColor: '#eee',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  textContent: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderColor: '#DADADA',
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 14,
  },
  trophy: {
    width: 64,
    height: 64,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  fixedButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FBA834',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    width:100,
    height:25,
    paddingHorizontal: 10,
    // paddingVertical: 3
    paddingTop:2
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:12
  },
  aiButton: {
    backgroundColor: '#FBA834',
    marginLeft: 70,
    borderRadius: 8,
    alignItems: 'center',
    width:100,
    height:25,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomBox:{
    flexDirection: 'row',
  },
});
