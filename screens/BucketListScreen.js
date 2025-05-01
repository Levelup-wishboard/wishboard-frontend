import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // ✅ 추가
import { getTagColor } from '../constants/Colors';

const initialData = [
  { id: 1, dday: 'D-30', tag: '배우고싶다', image: require('../assets/images/profile1.png'), text: '드럼 배우기' },
  { id: 2, dday: 'D-176', tag: '해보고싶다', image: require('../assets/images/profile2.png'), text: '스카이다이빙' },
  { id: 3, dday: '언젠가', tag: '되고싶다', image: require('../assets/images/profile3.png'), text: '베스트셀러작가 되기' },
  { id: 4, dday: 'D-46', tag: '갖고싶다', image: require('../assets/images/profile1.png'), text: '캠핑용 루프탑 텐트' },
  { id: 5, dday: 'D-132', tag: '가보고싶다', image: require('../assets/images/profile1.png'), text: '이탈리아 베네치아' },
  { id: 6, dday: 'D-380', tag: '해보고싶다', image: require('../assets/images/profile1.png'), text: '내가 찍은 사진으로 전시회 열기' },
  { id: 7, dday: '언젠가', tag: '배우고싶다', image: require('../assets/images/profile1.png'), text: '드럼 배우기' },
];

export default function BucketListScreen() {
  const [pinnedIds, setPinnedIds] = useState([]);
  const navigation = useNavigation(); // ✅ 추가

  const togglePin = (id) => {
    setPinnedIds((prev) => {
      if (prev.includes(id)) return prev.filter((pid) => pid !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const parseDday = (dday) => {
    if (dday === '언젠가') return Infinity;
    return parseInt(dday.replace('D-', ''), 10);
  };

  const sortedList = [...initialData].sort((a, b) => {
    const aPinned = pinnedIds.includes(a.id);
    const bPinned = pinnedIds.includes(b.id);
    if (aPinned !== bPinned) return bPinned - aPinned;
    return parseDday(a.dday) - parseDday(b.dday);
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>레벨업 님의 WISHBOARD</Text>
          <Text style={styles.headerSubtitle}>꿈을 기록하고, 함께 실현해가는 버킷리스트</Text>
        </View>
        <View style={styles.trophyWrapper}>
          <View style={styles.trophyTextWrapper}>
            <Text style={styles.trophyScore}>2</Text>
            <Text style={styles.trophyTotal}>/10</Text>
          </View>
          <Image source={require('../assets/images/trophy.png')} style={styles.trophyImage} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sortedList.map(item => (
          <View key={item.id} style={styles.bucketCard}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.ddayRow}>
                <Text style={styles.ddayText}>{item.dday}</Text>
                <View style={[styles.tagBox, { backgroundColor: getTagColor(item.tag) }]}>
                  <Text style={styles.tagText}>{item.tag}</Text>
                </View>
              </View>
              <Text style={styles.cardText}>{item.text}</Text>
            </View>
            <TouchableOpacity onPress={() => togglePin(item.id)}>
              <Ionicons
                name="star"
                size={18}
                color={pinnedIds.includes(item.id) ? '#FBA834' : '#999'}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('BucketListAdd')} // ✅ 연결
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#2F327D',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: { color: '#FBA834', fontWeight: 'bold', fontSize: 16 },
  headerSubtitle: { color: '#fff', fontSize: 12, marginTop: 4 },
  trophyWrapper: { alignItems: 'center' },
  trophyTextWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  trophyScore: { fontSize: 22, fontWeight: 'bold', color: '#FBA834' },
  trophyTotal: { fontSize: 12, color: '#fff', marginLeft: 2 },
  trophyImage: { width: 60, height: 60, resizeMode: 'contain' },
  scrollContent: { padding: 20, paddingBottom: 80 },
  bucketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  cardImage: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
  cardContent: { flex: 1 },
  ddayRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ddayText: {
    backgroundColor: '#fff',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    color: '#000',
    marginRight: 6,
  },
  tagBox: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  tagText: { fontSize: 10, color: '#000' },
  cardText: { fontSize: 14, color: '#000' },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FBA834',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
});
