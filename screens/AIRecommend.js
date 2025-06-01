// screens/AIRecommend.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// const bucketListData = [
//   {
//     id: '1',
//     image: require('../assets/images/bungee.png'),
//     title: '해외 열기구 페스티벌 참가하기',
//     author: '나나',
//     likes: 10,
//     comments: 10,
//     time: '18:30',
//   },
//   {
//     id: '2',
//     image: require('../assets/images/bungee.png'),
//     title: '해외 열기구 페스티벌 참가하기',
//     author: '나나',
//     likes: 10,
//     comments: 10,
//     time: '18:30',
//   },
// ];

const AIRecommend = ({ navigation }) => {
  const [bucketListData, setBucketListData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      setLoading(true); // 로딩 시작
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('인증 오류', '로그인이 필요합니다.');
        return;
      }

      const response = await axios.post('http://3.39.187.114:8080/ai/recommend', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBucketListData(response.data.recommendations);
    } catch (error) {
      console.error('추천 목록 가져오기 실패:', error);
      Alert.alert('오류', '추천 버킷리스트를 불러오지 못했습니다.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  fetchRecommendations();
}, []);

if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>AI 추천을 불러오는 중...</Text>
      <ActivityIndicator size="large" color="#333A73" />
    </View>
  );
}
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.category === 'AI 추천') {
          Alert.alert('이동 불가', 'AI 추천 태그는 상세 페이지가 없습니다.');
          return;
        }

        navigation.navigate('CommunityDetail', {
          communityId: item.communityId,
          title: item.title
        });
      }}
    >
      <Image source={require('../assets/images/bungee.png')} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.category || 'AI 추천'}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.authorName}</Text>
        <View style={styles.metaInfo}>
          <FontAwesome name="thumbs-o-up" size={14} color="gray" />
          <Text style={styles.metaText}>{item.likeCount}</Text>
          <MaterialCommunityIcons name="comment-outline" size={14} color="gray" style={styles.metaIcon} />
          <Text style={styles.metaText}>{item.commentCount}</Text>
          {/* <Text style={styles.metaText}>{item.time}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconBox}>
          <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          레벨업님, 한 걸음 더 나아갈까요?{'\n'}다음 버킷리스트를 추천드려요
        </Text>
      </View>

      <FlatList
        data={bucketListData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#333A73',
    paddingVertical: 20,
    paddingHorizontal: 15,
    paddingTop: 70, // status bar 고려
    flexDirection: 'row',
    alignItems: 'center'
  },
  backIconBox: {
    marginRight: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  thumbnail: {
    width: 70,
    height: 70,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#93DEFF',
    paddingHorizontal: 6,
    // paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
    fontSize: 10,
    height: 15,
    width:62,
    textAlign: 'center', 
    fontWeight: 'bold',
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 10,
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  metaIcon: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333A73',
  },
  
});

export default AIRecommend;
