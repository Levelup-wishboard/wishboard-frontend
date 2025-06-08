// screens/BucketListScreen.js
import React, { useContext } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { getTagColor } from '../constants/Colors';
import { BucketListContext } from '../context/BucketListContext';

export default function BucketListScreen() {
  const { bucketList, togglePin } = useContext(BucketListContext);
  const navigation = useNavigation();

  const parseDday = (dday) => {
    if (dday === '언젠가') return Infinity;
    return parseInt(dday.replace('D-', ''), 10);
  };

  const sortedList = [...bucketList].sort((a, b) => {
    if (a.pinned !== b.pinned) return b.pinned - a.pinned; // pinned true 우선
    return parseDday(a.dday) - parseDday(b.dday); // dday 오름차순
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>김수정 님의 WISHBOARD</Text>
          <Text style={styles.headerSubtitle}>꿈을 기록하고, 함께 실현해가는 버킷리스트</Text>
        </View>
        <View style={styles.trophyWrapper}>
          <Image source={require('../assets/images/trophy.png')} style={styles.trophyImage} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sortedList.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.bucketCard}
            onPress={() => navigation.navigate('BucketListDetail', { bucket: item })}
          >
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
                color={item.pinned ? '#FBA834' : '#999'}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('BucketListAdd')}
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