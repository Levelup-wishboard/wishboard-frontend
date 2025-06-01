import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const gold = require('../assets/images/gold_trophy.png');
const silver = require('../assets/images/silver_trophy.png');
const bronze = require('../assets/images/bronze_trophy.png');
const normal = require('../assets/images/trophy.png');

// const hallOfFameData = [
//   { userId: 'u001', postId: 'p101', name: '수정이', likes: 120 },
//   { userId: 'u002', postId: 'p102', name: '수룡이', likes: 95 },
//   { userId: 'u003', postId: 'p103', name: '성신이', likes: 90 },
//   { userId: 'u004', postId: 'p104', name: '준이', likes: 85 },
//   { userId: 'u005', postId: 'p105', name: '하늘', likes: 82 },
//   { userId: 'u006', postId: 'p106', name: '민지', likes: 80 },
//   { userId: 'u007', postId: 'p107', name: '도윤', likes: 78 },
//   { userId: 'u008', postId: 'p108', name: '은지', likes: 76 },
//   { userId: 'u009', postId: 'p109', name: '하진', likes: 75 },
//   { userId: 'u010', postId: 'p110', name: '태현', likes: 73 },
// ];

export default function HallOfFameScreen({ navigation }) {
  const [hallOfFameData, setHallOfFameData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTop10 = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('로그인 필요', '다시 로그인 해주세요.');
          return;
        }

        const response = await axios.get('http://3.39.187.114:8080/HallOfFame/TOP10', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setHallOfFameData(response.data); 
      } catch (error) {
        console.error('TOP10 불러오기 실패:', error);
        Alert.alert('오류', '명예의 전당 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTop10();
  }, []);

  const DEFAULT_USER = {
    userId: 'dummy',
    postId: 'dummy',
    name: 'x',
    likes: 0,
  };
  
  const ensureLength = (arr, length) => {
    const clone = [...arr];
    while (clone.length < length) {
      clone.push({
        ...DEFAULT_USER,
        userId: `dummy-${clone.length}`,  // 고유하게 만듦
        postId: `dummy-post-${clone.length}`
      });
    }
    return clone.slice(0, length);
  };
  
  const renderTopThree = () => {
    const raw = [hallOfFameData[1], hallOfFameData[0], hallOfFameData[2]];
    const items = ensureLength(raw.filter(Boolean), 3); // 부족한 경우 더미로 채움
    const trophies = [silver, gold, bronze];

    return (
      <View style={styles.row}>
        {items.map((item, i) => {
          const isFirst = i === 1;
          return (
            <TouchableOpacity
              key={`${item.communityId}-${i}`}
              style={[styles.card, isFirst && styles.firstCard]}
              onPress={() => navigation.navigate('HallOfFameDetailScreen', { item})}
            >
              <Text style={[styles.name, styles.topName]}>{item.nickname}</Text>
              <Image
                source={trophies[i]}
                style={[styles.trophy, isFirst && styles.firstTrophy]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  const renderGroup = (startIndex, count) => {
    const items = hallOfFameData.slice(startIndex, startIndex + count);
    return (
      <View style={styles.row}>
        {items.map((item, idx) => (
          <TouchableOpacity
          key={`${item.communityId}-${item.userId}-${idx}`}
            style={styles.card}
            onPress={() => navigation.navigate('HallOfFameDetailScreen', { item })}
          >
            <Image source={normal} style={styles.trophy} />
            <View style={styles.textContent}>
              <Text style={styles.name}>{item.nickname}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <Text style={styles.title}>명예의 전당</Text>
        <Text style={styles.title2}>이번달 Top 10</Text>
        {renderTopThree()}
        <View style={styles.box}></View>
        {renderGroup(3, 3)}
        {renderGroup(6, 3)}
        {renderGroup(9, 1)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333A73',
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'center',
    color: '#FBA834'
  },
  title2: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
    color: '#FBA834'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginBottom: 20,
    alignItems: 'flex-end'
  },
  card: {
    alignItems: 'center',
    width: 90,
  },
  firstCard: {
    width: 120,
  },
  trophy: {
    width: 72,
    height: 72,
    marginTop: 20
  },
  firstTrophy: {
    width: 110,
    height: 110,
  },
  textContent: {
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgb(255, 255, 255)',
    marginTop: 10
  },
  meta: {
    fontSize: 12,
    color: 'gray',
  },
  topName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 35
  },
  box: {
    width: 324,
    height: 27,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    marginLeft: 10
  },
  backButton: {
    alignSelf: 'flex-start'
  },
  backIcon: {
    width: 20,
    height: 20
  },
});
