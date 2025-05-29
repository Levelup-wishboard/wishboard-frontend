import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import api from '../constants/api';

<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
export default function SearchCommunityScreen() {
  const navigation = useNavigation();

  const [keyword, setKeyword] = useState('');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const goDetail = (communityType) => {
  navigation.navigate('CommunityDetail', {
    communityType,          // ex. '트로피'
    diversityKeyword: keyword, // ex. '실내활동'
    title: keyword,         // 헤더에 '실내활동'으로 표시
    fromSearch: true,
  });
};

  useEffect(() => {
  let timer;
  if (keyword) {
    timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/api/communities', {
          params: { keyword },
        });
        setCommunities(data);
      } catch (e) {
        console.warn(e);
        setError(e.message);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  } else {
    setCommunities([]);
  }
  return () => clearTimeout(timer);
}, [keyword]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header showBackButton leftContent="커뮤니티 검색" />

      {/* 검색창 */}
      <View style={{ padding: 12, backgroundColor: '#333A73' }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 8, padding: 8 }}>
          <Ionicons name="search-outline" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1 }}
            placeholder="키워드를 입력하세요"
            placeholderTextColor="#999"
            value={keyword}
            onChangeText={setKeyword}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* 로딩/에러 */}
      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
      {error && <Text style={{ color: 'red', padding: 16 }}>에러: {error}</Text>}

      {/* 결과 리스트 */}
      <FlatList
        data={communities}
        keyExtractor={(item) => item.communityType}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}
            onPress={() => goDetail(item.communityType)}
          >
            <Text style={{ flex: 1 }}>{item.communityType}</Text>
            <Text style={{ color: '#666' }}>{item.postCount}개</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && keyword ? (
            <Text style={{ color: '#777', padding: 16 }}>검색 결과가 없습니다.</Text>
          ) : null
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