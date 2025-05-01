import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTagColor } from '../constants/Colors';

const TAG_FILTERS = ['All', '해보고싶다', '되고싶다', '갖고싶다', '가보고싶다', '배우고싶다'];

const BUCKET_LIST = [
  { id: '1', tag: '갖고싶다', text: '포르쉐 911 사기' },
  { id: '2', tag: '가보고싶다', text: '북극으로의 크루즈여행가기' },
  { id: '3', tag: '배우고싶다', text: '서핑 배우기' },
  { id: '4', tag: '해보고싶다', text: '열기구 타기' },
  { id: '5', tag: '해보고싶다', text: '세계 일주' },
  { id: '6', tag: '배우고싶다', text: '일본어 배우기' },
  { id: '7', tag: '되고싶다', text: '디지털 노마드 되기' },
  { id: '8', tag: '갖고싶다', text: '강남 아파트' },
  { id: '9', tag: '가보고싶다', text: '사하라 사막 여행' },
  { id: '10', tag: '되고싶다', text: '유엔 평화대사 되기' },
  { id: '11', tag: '해보고싶다', text: '스카이다이빙' },
  { id: '12', tag: '갖고싶다', text: '최신 아이패드 프로' },
];

export default function PopularBucketListScreen({ navigation }) {
  const [selectedTag, setSelectedTag] = useState('All');

  const filteredList =
    selectedTag === 'All'
      ? BUCKET_LIST.slice(0, 10)
      : BUCKET_LIST.filter(item => item.tag === selectedTag).slice(0, 10);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>인기버킷리스트</Text>
        <View style={styles.iconRow}>
          <Ionicons name="notifications-outline" size={22} color="#FBA834" style={styles.icon} />
          <Ionicons name="person-outline" size={22} color="#FBA834" style={styles.icon} />
        </View>
      </View>

      {/* 전체 콘텐츠 스크롤뷰 */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 탭 필터 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabContainer}
        >
          {TAG_FILTERS.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.tabButton, selectedTag === tag && styles.activeTab]}
              onPress={() => setSelectedTag(tag)}
            >
              <Text style={[styles.tabText, selectedTag === tag && styles.activeTabText]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 리스트 */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          {filteredList.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.bucketItem}
              onPress={() => console.log('Item clicked')}
            >
              <View style={[styles.tagBox, { backgroundColor: getTagColor(item.tag) }]}>
                <Text style={styles.tagText}>{item.tag}</Text>
              </View>
              <Text style={styles.bucketText}>{item.text}</Text>
              <Ionicons name="add-circle" size={20} color="#FBA834" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2F327D',
    padding: 12,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 12,
  },
  tabScroll: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  tabContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tabButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#555',
  },
  activeTab: {
    backgroundColor: '#FBA834',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bucketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  tagBox: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 10,
  },
  tagText: {
    fontSize: 10,
    color: '#000',
  },
  bucketText: {
    fontSize: 14,
    color: '#333',
  },
});
