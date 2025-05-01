import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

/* ---------------- 고정 데이터 ---------------- */
// community_diversity (상위 분류)
const COMMUNITIES = [
  { id: 'extreme-sports',  name: '익스트림 스포츠' },
  { id: 'indoor-activities',   name: '실내활동' },
  { id: 'study',    name: '학업' },
  { id: 'health',   name: '피트니스•건강' },
];

// type (하위 분류)
const TYPES = [
  { id: 't1', communityId: 'extreme-sports', name: '수상스키' },
  { id: 't2', communityId: 'extreme-sports', name: '번지점프' },
  { id: 't3', communityId: 'indoor-activities',  name: '피아노' },
  { id: 't4', communityId: 'study',  name: '공부' },
  { id: 't5', communityId: 'health',  name: '크로스핏' },
];

/* ---------------- 헬퍼 ---------------- */
const COMMUNITY_MAP = Object.fromEntries(COMMUNITIES.map((c) => [c.id, c]));
const normalize = (s) => s.toLowerCase().replace(/\s+/g, '');

function filterCommunities(keyword) {
  if (!keyword) return COMMUNITIES;

  const key = normalize(keyword);
  const matched = [];

  // ① 상위 분류 이름 매치
  COMMUNITIES.forEach((c) => {
    if (normalize(c.name).includes(key)) matched.push(c);
  });

  // ② 하위 분류 매치 → 해당 community 추가
  TYPES.forEach((t) => {
    if (normalize(t.name).includes(key)) {
      const comm = COMMUNITY_MAP[t.communityId];
      if (comm && !matched.some((m) => m.id === comm.id)) matched.push(comm);
    }
  });

  return matched;
}

/* ---------------------------------------------------- */
export default function SearchCommunityScreen() {
  const navigation = useNavigation();

  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState(COMMUNITIES);

  /* Debounce 300 ms */
  useEffect(() => {
    const id = setTimeout(() => setResults(filterCommunities(keyword)), 300);
    return () => clearTimeout(id);
  }, [keyword]);

  /* 이동 */
  const goDetail = (id, title) =>
    navigation.navigate('CommunityDetail', { communityId: id, title });

  /* ---------------- UI ---------------- */
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header showBackButton leftContent="커뮤니티 검색" />

      {/* 검색창 */}
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="상위·하위 분류를 입력하세요"
            placeholderTextColor="#999"
            value={keyword}
            onChangeText={setKeyword}
          />
        </View>
      </View>

      {/* 결과 목록 */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => goDetail(item.id, item.name)}>
            <Ionicons name="people-outline" size={20} color="#333" style={{ marginRight: 8 }} />
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#777', padding: 16 }}>검색 결과가 없습니다.</Text>
        }
      />
    </View>
  );
}

/* ---------------- 스타일 ---------------- */
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#333A73',
    padding: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  searchInput: { flex: 1, color: '#000' },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemText: { fontSize: 15, color: '#333' },
});
