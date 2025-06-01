import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyPostsScreen({ navigation }) {
  // const posts = [
  //   {
  //     id: 1,
  //     category: '스카이다이빙',
  //     label: '인원모집',
  //     title: '스카이다이빙 함께할 멤버 모집합니다! (초보자도 환영)',
  //     author: '나나',
  //     likes: 10,
  //     comments: 10,
  //     time: '18:30',
  //     thumbnail: require('../assets/images/sky.png'),
  //   },
  //   {
  //     id: 2,
  //     category: '수상스키',
  //     label: '정보',
  //     title: '수상스키 시작을 위한 필수 준비물',
  //     author: '키키',
  //   },
  //   {
  //     id: 3,
  //     category: '번지점프',
  //     label: 'Q&A',
  //     title: '우리나라에서 가장 높은 번지점프 어디인가요??',
  //     author: '안농',
  //   },
  // ];
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const res = await axios.get('http://3.39.187.114:8080/users/myWrite', {  //본인 pc ip주소로 바꿔줘야함.
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPosts(res.data.data);
      } catch (error) {
        console.error('내가 쓴 글 조회 실패:', error);
        Alert.alert('오류', '내가 쓴 글을 불러오지 못했습니다.');
      }
    };

    fetchMyPosts();
  }, []);


  const getLabelColor = (label) => {
    switch (label) {
      case '인원모집':
        return '#FF9393';
      case '정보':
        return '#93DEFF';
      case 'Q&A':
        return '#93FFC9';
      case '트로피':
        return '#FFFF93';
      default:
        return '#eee';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#FBA834" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>내가 쓴 글</Text>
        </View>
        <View style={styles.headerRight}>
          <Ionicons name="notifications-outline" size={20} color="#FBA834" style={{ marginRight: 16 }} onPress={() => {navigation.navigate('mypage', { screen: 'Alam' })}}/>
          <Ionicons name="person-outline" size={20} color="#FBA834" onPress={() => {navigation.navigate('mypage', { screen: 'MyPageScreen' })}}/>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {posts.map((post) => (
          <TouchableOpacity
              key={post.communityId}
              style={styles.card}
              onPress={() =>
                navigation.navigate('PostDetail', {
                  communityType: post.communityType,
                  postId: post.communityId,
                  communityDiversity: post.communityDiversity,  // 이건 필요 시
                })
              }
            >
            <View style={styles.topRow}>
              <View style={styles.badgeContainer}>
                <View style={styles.badges}>
                  <Text style={styles.badgeGray}>{post.communityDiversity}</Text>
                  <Text
                    style={[
                      styles.badgeColored,
                      { backgroundColor: getLabelColor(post.communityType) },
                    ]}
                  >
                    {post.communityType}
                  </Text>
                </View>
                <Text style={styles.title}>{post.title}</Text>
              </View>
              {post.thumbnail ? (
                <Image source={post.thumbnail} style={styles.thumbnail} />
              ) : (
                <View style={styles.thumbnailPlaceholder} />
              )}
            </View>

            <View style={styles.meta}>
              <Text style={styles.author}>{post.writerNickName}</Text>
              {post.likeNum !== undefined && (
                <>
                  <Ionicons name="thumbs-up-outline" size={14} color="#555" />
                  <Text style={styles.iconText}>{post.likeNum}</Text>
                  <Ionicons name="chatbubble-outline" size={14} color="#555" style={{ marginLeft: 12 }} />
                  <Text style={styles.iconText}>{post.commentNum}</Text>
                  <Text style={styles.time}>{post.time}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#2F336A',
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 16, color:"#FBA834", fontWeight: 'bold' },
  content: { padding: 20 },
  card: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeContainer: {
    flex: 1,
    paddingRight: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  badgeGray: {
    backgroundColor: '#eee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    color: '#333',
  },
  badgeColored: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    color:"rgb(0, 0, 0)",
  },
  title: {
    fontSize: 14,
    color: '#222',
    flexWrap: 'wrap',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 60,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  author: { fontSize: 12, color: '#555', marginRight: 10 },
  iconText: { fontSize: 12, color: '#555' },
  time: { fontSize: 12, color: '#555', marginLeft: 12 },
});
