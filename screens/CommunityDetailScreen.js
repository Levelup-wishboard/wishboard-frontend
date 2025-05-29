// screens/CommunityDetailScreen.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, View, Text, FlatList, TouchableOpacity,
  ScrollView, ActivityIndicator, StyleSheet
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../components/Header';
import WriteButton from '../components/WriteButton';
import api from '../constants/api';

const BOARD_TYPES = ['정보', '트로피', 'Q&A', '인원모집'];

/* ────────── ① 색상 테이블: 대문자·무공백 키만 보관 ────────── */
const BOARD_COLORS = {
  정보:   '#93DEFF',
  INFO:    '#93DEFF',
  트로피:    '#FFC107',   // 한글은 그대로 키로 둡니다
  TROPHY:  '#FFC107',
  'Q&A':   '#93FFC9',
  QNA:     '#93FFC9',
  인원모집:  '#FF9393',
  RECRUIT: '#FF9393',
  ALL:     '#607D8B',
};

/* ────────── ② boardType → 컬러 키 변환 함수 ────────── */
const toColorKey = (raw = '') => {
  const trimmed = raw.replace(/\s+/g, '');      // 공백 제거
  const upper   = trimmed.toUpperCase();        // 영어 대문자
  const cut     = upper.replace(/게시판$/i, ''); // “게시판” 접미사 제거
  return cut;                                   // 항상 정규화된 키 반환
};

const TABS = [
  { key: 'All',     label: 'All' },
  { key: '정보',     label: '정보' },
  { key: '트로피',   label: '트로피' },
  { key: 'Q&A',     label: 'Q&A' },
  { key: '인원모집', label: '인원모집' },
];

export default function CommunityDetailScreen() {
  /* ───────────── route 파라미터 ───────────── */

  const {
    communityDiversity,
    communityType,
    title,
    fromSearch = false,
  } = useRoute().params;
  console.log('▶️ [Route params]', { communityType, communityDiversity, fromSearch });

  const navigation = useNavigation();

  /* ───────────── state ───────────── */
 // const initialTab = fromSearch ? communityType : 'All';
  const initialTab = communityType || 'All';
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const [posts,        setPosts]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrapId, setScrapId] = useState(null);

  /* ───────────── 스크랩 여부 조회 ───────────── */
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

useEffect(() => {
  setLoading(true);
  setError(null);

  if (fromSearch) {
    // ─── 검색 분기 ───
    if (selectedTab === 'All') {
      // “All” 탭: diversity 안의 모든 게시판 글 합치기
      Promise.all(
        BOARD_TYPES.map(type =>
          api.get(`/api/communities/${encodeURIComponent(type)}`, { params: { page: 0, size: 100, communityDiversity } 
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
      // “특정 탭” 분기: 해당 탭 + diversity
      const endpoint = `/api/communities/${encodeURIComponent(selectedTab)}`;
      const params   = { page: 0, size: 100 };

      console.log('▶️ fetching (search single)', endpoint, params);
      api.get(endpoint, { params })
        .then(({ data }) => {
           // diversity 키워드로 필터링
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

  }  else {
     // ─── 홈→디테일 분기 ───
   if (selectedTab === 'All') {
     // All 탭: diversity 안의 모든 게시판 글을 /
     // Promise.all로 병렬 조회 → 합치기
     Promise.all(
       BOARD_TYPES.map(type =>
         api.get(
           `/api/communities/${encodeURIComponent(type)}`,
           { params: { page: 0, size: 20 } }
         ).then(res =>
           // 받은 content 중 diversity 필터
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
     // 수정: /api/communities/{탭} 로 호출
     api.get(
       `/api/communities/${encodeURIComponent(selectedTab)}`,
       { params: { page: 0, size: 20 } }
     )
       .then(({ data }) => {
        // diversity 필터 적용
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




  /* ───────────── 북마크 토글 ───────────── */
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
            setScrapId(data.scrapId);  // POST 응답이 새로 생성된 scrapId 를 반환한다면
          })
         .catch(e => console.warn('북마크 추가 실패', e));
    }
  };

  /* ───────────── UI ───────────── */
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
                  onPress={() => {
                    console.log('▶️ [Tab pressed]', key);
                    setSelectedTab(key);
                  }}
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
        console.log('▶️ [renderItem]', {
              diversity: item.diversity,
              boardType: item.communityType,
              secondTag,
            });
        const colorKey = toColorKey(secondTag);
        const color    = BOARD_COLORS[colorKey] || '#666';
        console.log('🔖 secondTag:', secondTag,
                    '→ colorKey:', colorKey,
                    '→ color:', color);
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

              <View style={styles.statsRow}>
                <Feather name="thumbs-up" size={16} color="#666" />
                <Text style={styles.statsText}>{item.likes || 0}</Text>
                <Feather name="message-circle" size={16} color="#666" style={{ marginLeft: 12 }} />
                <Text style={styles.statsText}>{item.comments || 0}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* <WriteButton
        onPress={() =>
          navigation.navigate('PostWrite', {
            communityType: fromSearch ? communityDiversity : communityType,
            communityTitle: title,
            defaultBoardTab: selectedTab,
          })
        }
      /> */}
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

/* ──────────── styles: 원본 그대로 ──────────── */
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