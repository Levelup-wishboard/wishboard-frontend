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

export default function SearchCommunityScreen() {
  const navigation = useNavigation();

  const [keyword, setKeyword] = useState('');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const goDetail = (communityType) => {
  navigation.navigate('CommunityDetail', {
    communityType,          // ex. '트로피'
    communityDiversity: keyword, // ex. '실내활동'
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