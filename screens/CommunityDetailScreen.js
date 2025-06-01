// screens/CommunityDetailScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView, View, Text, FlatList, TouchableOpacity,
  ScrollView, ActivityIndicator, StyleSheet,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import WriteButton from '../components/WriteButton';
import api from '../constants/api';

const BOARD_TYPES = ['정보', '트로피', 'Q&A', '인원모집'];

const BOARD_COLORS = {
  정보:   '#93DEFF',
  INFO:    '#93DEFF',
  트로피:    '#FFC107',
  TROPHY:  '#FFC107',
  'Q&A':   '#93FFC9',
  QNA:     '#93FFC9',
  인원모집:  '#FF9393',
  RECRUIT: '#FF9393',
  ALL:     '#607D8B',
};

const toColorKey = (raw = '') => {
  const trimmed = raw.replace(/\s+/g, '');
  const upper   = trimmed.toUpperCase();
  const cut     = upper.replace(/게시판$/i, '');
  return cut;
};

const TABS = [
  { key: 'All',     label: 'All' },
  { key: '정보',     label: '정보' },
  { key: '트로피',   label: '트로피' },
  { key: 'Q&A',     label: 'Q&A' },
  { key: '인원모집', label: '인원모집' },
];

export default function CommunityDetailScreen() {
  const {
    communityDiversity,
    communityType,
    title,
    fromSearch = false,
  } = useRoute().params;
  const navigation = useNavigation();

  const initialTab = communityType || 'All';
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const [posts,        setPosts]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrapId, setScrapId] = useState(null);

  useEffect(() => {
    api.get('/api/community-scraps')
       .then(({ data }) => {
          const list = Array.isArray(data.content) ? data.content : [];
          const hit  = list.find(s => s.communityName === communityDiversity);
           if (hit) {
           setIsBookmarked(true);
           setScrapId(hit.scrapId);
         } else {
           setIsBookmarked(false);
           setScrapId(null);
         }
       })
       .catch(e => console.warn('스크랩 조회 실패', e));
  }, [communityDiversity]);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    setError(null);

    if (fromSearch) {
      if (selectedTab === 'All') {
        Promise.all(
          BOARD_TYPES.map(type =>
            api.get(`/api/communities/${encodeURIComponent(type)}`, {
              params: { page: 0, size: 100, communityDiversity }
            })
              .then(res =>
                (res.data.content || [])
                  .map(p => ({ ...p, communityType: type }))
              )
          )
        )
          .then(results => setPosts(results.flat()))
          .catch(e => {
            console.warn('불러오기 실패', e);
            setError('불러오기 실패');
            setPosts([]);
          })
          .finally(() => setLoading(false));
      } else {
        const endpoint = `/api/communities/${encodeURIComponent(selectedTab)}`;
        const params = { page: 0, size: 100 };

        api.get(endpoint, { params })
          .then(({ data }) => {
            const filtered = (data.content || [])
              .filter(post => post.diversity === communityDiversity);
            setPosts(filtered);
          })
          .catch(e => {
            console.warn('불러오기 실패', e);
            setError('불러오기 실패');
            setPosts([]);
          })
          .finally(() => setLoading(false));
      }
    } else {
      if (selectedTab === 'All') {
        Promise.all(
          BOARD_TYPES.map(type =>
            api.get(
              `/api/communities/${encodeURIComponent(type)}`,
              { params: { page: 0, size: 20 } }
            ).then(res =>
              (res.data.content || [])
                .filter(p => p.diversity === communityDiversity)
                .map(p => ({ ...p, communityType: type }))
            )
          )
        )
          .then(results => setPosts(results.flat()))
          .catch(e => {
            console.warn('불러오기 실패', e)
            setError('불러오기 실패')
            setPosts([])
          })
          .finally(() => setLoading(false))
      } else {
        api.get(
          `/api/communities/${encodeURIComponent(selectedTab)}`,
          { params: { page: 0, size: 20 } }
        )
          .then(({ data }) => {
            setPosts(
              (data.content || [])
                .filter(p => p.diversity === communityDiversity)
            );
          })
          .catch(e => {
            console.warn('불러오기 실패', e)
            setError('불러오기 실패')
            setPosts([])
          })
          .finally(() => setLoading(false))
      }
    }
  }, [communityDiversity, selectedTab, fromSearch]);
  
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const toggleBookmark = () => {
    if (isBookmarked) {
      api.delete(`/api/community-scraps/${encodeURIComponent(communityDiversity)}`)
         .then(() => {
        setIsBookmarked(false);
        setScrapId(null);
      })
         .catch(e => console.warn('북마크 해제 실패', e));
    } else {
      api.post('/api/community-scraps', { communityName: communityDiversity })
          .then(({ data }) => {
            setIsBookmarked(true);
            setScrapId(data.scrapId);
          })
         .catch(e => console.warn('북마크 추가 실패', e));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        showBackButton
        leftContent={title}
        showBookmark
        isBookmarked={isBookmarked}
        onBookmarkPress={toggleBookmark}
      />
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {TABS.map(({ key, label }) => {
            const active = key === selectedTab;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.tabButton, active && styles.tabButtonActive]}
                onPress={() => setSelectedTab(key)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading && <ActivityIndicator style={{ margin: 16 }} />}
      {error   && <Text style={{ color: 'red', padding: 16 }}>{error}</Text>}

      <FlatList
        data={posts}
        keyExtractor={item => String(item.communityId)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!loading && (
          <Text style={{ color:'#777', padding:16 }}>게시글이 없습니다.</Text>
        )}
        renderItem={({ item }) => {
          const firstTag = item.diversity;
          const secondTag = selectedTab === 'All'
            ? item.communityType
            : selectedTab;
          const colorKey = toColorKey(secondTag);
          const color    = BOARD_COLORS[colorKey] || '#666';
          return (
            <TouchableOpacity
              style={styles.postContainer}
              onPress={() =>
                navigation.navigate('PostDetail', {
                  communityType: fromSearch ? communityDiversity : communityType,
                  postId: item.communityId,
                })
              }
            >
              <View style={styles.labelRow}>
                <View style={[styles.labelBox, styles.detailBox]}>
                  <Text style={styles.labelText}>{firstTag}</Text>
                </View>
                <View style={[styles.labelBox, { backgroundColor: color }]}>
                  <Text style={styles.labelText}>{secondTag}</Text>
                </View>
              </View>

              <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.authorText}>{item.createdAt?.slice(0,10) || ''}</Text>
              {/* 좋아요/댓글 수는 더 이상 표시하지 않음 */}
            </TouchableOpacity>
          );
        }}
      />

      <WriteButton
        onPress={() =>
          navigation.navigate('PostWrite', {
            diversity : communityDiversity,
            communityType,
            defaultBoardTab: selectedTab,
          })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  tabContainer: { backgroundColor: '#FFFFFF', borderBottomColor: '#eaeaea', borderBottomWidth: 1 },
  tabScroll: { paddingHorizontal: 16 },
  tabButton: {
    paddingVertical: 8, paddingHorizontal: 10, marginRight: 12,
    marginTop: 10, marginBottom: 10, borderRadius: 12, backgroundColor: '#f0f0f0',
  },
  tabButtonActive: { backgroundColor: '#FBA834' },
  tabText: { fontSize: 14, color: '#333' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: 16 },
  labelRow: { flexDirection: 'row', marginBottom: 8 },
  labelBox: {
    backgroundColor: '#FBA834', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4, marginRight: 8,
  },
  detailBox: { backgroundColor: '#CDCDCD' },
  labelText: { fontSize: 12, color: '#000000' },
  postContainer: {
    marginBottom: 24, backgroundColor: '#FFF', borderRadius: 8, padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  titleText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
  thumbnail: { width: 48, height: 48, borderRadius: 4, marginLeft: 8 },
  authorText: { fontSize: 12, color: '#666' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statsItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  statsText: { fontSize: 12, color: '#666', marginLeft: 4 },
  dateText:{ fontSize: 12, color: '#999', marginRight:5 },
  timeText: { fontSize: 12, color: '#999', marginLeft:5 },
});
