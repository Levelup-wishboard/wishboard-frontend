// screens/CommunityDetailScreen.js
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    StatusBar,
    Platform,
    TouchableOpacity,
    ScrollView
  } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';

// 게시판별 라벨 색상 맵
const BOARD_COLORS = {
  'Q&A': '#93FFC9',       // 초록
  '정보': '#93DEFF',      // 파랑
  '트로피': '#FFC107',   // 노랑
  '인원모집': '#FF9393', // 분홍
  All: '#607D8B',              // 회색
};

// 예시 데이터 (각 게시판별)
const mockData = {
    All: [
        {
          id: '1',
          board: '정보',
          detail: '수상스키',
          title: '수상스키 장소 추천이요',
          author: '나나',
          image: null,
          likes: 10,
          comments: 5,
          time: '18:30',
        },
        {
          id: '2',
          board: 'Q&A',
          detail: '번지점프',
          title: '번지점프 어디가 최고일까요?',
          author: '키키',
          image: require('../assets/images/bungee.png'),
          likes: 3,
          comments: 2,
          time: '17:15',
        },
      ],
    정보게시판: [
      {
        id: '1',
        board: '정보',
        detail: '수상스키',
        title: '수상스키 장소 추천이요',
        author: '나나',
        image: null,
        likes: 10,
        comments: 5,
        time: '18:30',
      },
    ],
    트로피게시판: [
      {
        id: '4',
        board: '트로피',
        detail: '번지점프',
        title: '번지점프 성공했어요',
        author: '키키',
        image: require('../assets/images/prize.png'),
        likes: 3,
        comments: 2,
        time: '17:15',
      },
    ],
    'Q&A게시판': [
      {
        id: '3',
        board: 'Q&A',
        detail: '수상스키',
        title: '수상스키 질문있어요',
        author: '나나',
        image: null,
        likes: 10,
        comments: 5,
        time: '18:30',
      },
    ],
    인원모집게시판: [
      {
        id: '5',
        board: '인원모집',
        detail: '수상스키',
        title: '수상스키 함께할 멤버 모집합니다!',
        author: '나나',
        image: null,
        likes: 10,
        comments: 5,
        time: '18:30',
      },
    ],
  };
const TABS = ['All', '정보게시판', '트로피게시판', 'Q&A게시판', '인원모집게시판'];

const CommunityDetailScreen = () => {
    
  const route = useRoute();
  const { communityId, title } = route.params;
  //const [posts, setPosts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All');
  const [posts, setPosts] = useState(mockData['All']);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // TODO: communityId 로 API 호출 or 데이터 가져오기
    // 예시:
    // fetch(`/api/communities/${communityId}/posts`).then(...)
    setPosts([
      { id: '1', author: '나나', content: '첫 게시글입니다.' },
      { id: '2', author: '키키', content: '수상스키 시작을 위한 필수 준비물' },
    ]);
    // TODO: API 또는 로컬에서 북마크 상태 불러오기
    // setIsBookmarked(fetchedValue);

    //첫 화면에서는 All
    setSelectedTab('All');
    setPosts(mockData['All']);
  }, [communityId]);

  const toggleBookmark = () => {
    // TODO: API 호출 or 로컬 저장소에 상태 업데이트
    setIsBookmarked(prev => !prev);
  };

  const onSelectTab = (tab) => {
    setSelectedTab(tab);
    setPosts(mockData[tab] || []);
  };

return (
    <View style={styles.container}>
      <Header
        showBackButton={true}
        leftContent={title}
        showBookmark={true}
        isBookmarked={isBookmarked}
        onBookmarkPress={toggleBookmark}
      />

      {/* 탭 버튼 */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {TABS.map((tab) => {
            const isSelected = tab === selectedTab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => onSelectTab(tab)}
                style={[
                  styles.tabButton,
                  isSelected && styles.tabButtonActive
                ]}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 게시글 리스트 */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          // board 값에 맞춰 BOARD_COLORS에서 색상을 가져옵니다.
          const boardColor = BOARD_COLORS[item.board] || '#666';
          return (
            <View style={styles.postContainer}>

              {/* 상단: detail + board */}
              <View style={styles.labelRow}>
                <View style={[styles.labelBox, styles.detailBox]}>
                  <Text style={styles.labelText}>{item.detail}</Text>
                </View>
                <View style={[styles.labelBox, { backgroundColor: boardColor }]}>
                  <Text style={styles.labelText}>{item.board}</Text>
                </View>
              </View>

              {/* 제목 + 썸네일 */}
              <View style={styles.titleRow}>
                <Text style={styles.titleText} numberOfLines={1}>
                  {item.title}
                </Text>
                {item.image ? (
                  <Image source={item.image} style={styles.thumbnail} />
                ) : null}
              </View>

              {/* 작성자 */}
              <Text style={styles.authorText}>{item.author}</Text>

              {/* 좋아요, 댓글, 시간 */}
              <View style={styles.statsRow}>
                <View style={styles.statsItem}>
                  <Feather name="thumbs-up" size={16} color="#666" />
                  <Text style={styles.statsText}>{item.likes}</Text>
                </View>
                <View style={styles.statsItem}>
                  <Feather name="message-circle" size={16} color="#666" />
                  <Text style={styles.statsText}>{item.comments}</Text>
                </View>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
      </View>
    );
  }}
/>
    </View>
  );
};

export default CommunityDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
  },
  tabScroll: {
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 12,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  tabButtonActive: {
    backgroundColor: '#FBA834',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  labelBox: {
    backgroundColor: '#FBA834',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  detailBox: {
    backgroundColor: '#CDCDCD',
  },
  labelText: {
    fontSize: 12,
    color: '#000000',
  },
  postContainer: {
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginLeft: 8,
  },
  authorText: {
    fontSize: 12,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },

});
