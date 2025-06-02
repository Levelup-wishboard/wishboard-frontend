import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { getTagColor } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [pinnedList, setPinnedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyPopular = [
    { id: 1, title: '스카이다이빙', category: '해보고싶다' },
    { id: 2, title: '해외 트레킹', category: '가보고싶다' },
    { id: 3, title: '봉사활동 100시간', category: '되고싶다' },
  ];

  const dummyCommunity = [
    { id: 1, title: '드디어 도전 완료했어요!', author: '은지', tag: '되' },
    { id: 2, title: '이 코스 강추합니다.', author: '민수', tag: '가' },
    { id: 3, title: '어제 눈물났어요 ㅠ', author: '하늘', tag: '해' },
  ];

  const fetchPinned = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get('http://3.39.187.114:8080/api/bucketlist/pinned', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPinnedList(response.data);
    } catch (error) {
      console.error('고정 버킷리스트 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPinned();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <View style={styles.topRow}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            <View style={styles.iconRow}>
              <Ionicons name="notifications-outline" size={24} color="#FBA834" style={styles.icon} />
              <Ionicons name="person-outline" size={24} color="#FBA834" style={styles.icon} />
            </View>
          </View>
          <Text style={styles.level}>Lv. 3 도전자</Text>
        </View>

        {/* 도전 중인 버킷리스트 */}
        <Text style={styles.sectionTitle}>도전 중인 버킷리스트</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#FBA834" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {pinnedList.map((item) => (
              <View key={item.bucketId} style={styles.card}>
                <Image
                  source={item.image ? { uri: item.image } : require('../assets/images/default.png')}
                  style={styles.cardImage}
                />
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={[styles.cardTag, { backgroundColor: getTagColor(item.category) }]}>
                  {item.category}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* 인기 버킷리스트 */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>인기 버킷리스트</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.moreText}>더보기</Text>
          </TouchableOpacity>
        </View>
        {dummyPopular.map((item) => (
          <View key={item.id} style={styles.popularItem}>
            <Text style={styles.popularTitle}>{item.title}</Text>
            <Text style={[styles.cardTag, { backgroundColor: getTagColor(item.category) }]}>
              {item.category}
            </Text>
          </View>
        ))}

        {/* 최근 커뮤니티 글 */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>최근 커뮤니티 글</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.moreText}>더보기</Text>
          </TouchableOpacity>
        </View>
        {dummyCommunity.map((post) => (
          <View key={post.id} style={styles.communityItem}>
            <Text style={styles.communityTitle}>{post.title}</Text>
            <Text style={styles.communityMeta}>
              {post.author} · {post.tag}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { width: 100, height: 30, resizeMode: 'contain' },
  iconRow: { flexDirection: 'row' },
  icon: { marginLeft: 12 },
  level: { fontSize: 14, marginTop: 10, color: '#555' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginTop: 30 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  moreText: { color: '#FBA834' },

  horizontalList: { paddingLeft: 20, marginTop: 10 },
  card: {
    width: 140,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginRight: 12,
  },
  cardImage: { width: '100%', height: 80, borderRadius: 8 },
  cardTitle: { marginTop: 8, fontWeight: 'bold' },
  cardTag: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    color: '#fff',
    fontSize: 12,
  },

  popularItem: {
    backgroundColor: '#f9f9f9',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
  },
  popularTitle: { fontSize: 16, fontWeight: 'bold' },

  communityItem: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  communityTitle: { fontSize: 15, fontWeight: '600' },
  communityMeta: { fontSize: 12, color: '#999', marginTop: 4 },
});
