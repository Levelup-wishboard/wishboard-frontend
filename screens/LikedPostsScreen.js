import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LikedPostsScreen({ navigation }) {
  const posts = [
    {
      id: 1,
      category: '스카이다이빙',
      label: '인원모집',
      title: '스카이다이빙 함께할 멤버 모집합니다! (초보자도 환영)',
      author: '나나',
      likes: 10,
      comments: 10,
      time: '18:30',
      thumbnail: require('../assets/images/sky.png')
    },
    {
      id: 2,
      category: '수상스키',
      label: '정보',
      title: '수상스키 시작을 위한 필수 준비물',
      author: '키키',
    },
    {
      id: 3,
      category: '번지점프',
      label: 'Q&A',
      title: '우리나라에서 가장 높은 번지점프 어디인가요??',
      author: '안농',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FBA834" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>댓글 단 글</Text>
        <View style={{ width: 24 }} /> {/* 오른쪽 아이콘 여백 */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {posts.map((post) => (
          <View key={post.id} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.badges}>
                <Text style={styles.badgeGray}>{post.category}</Text>
                <Text style={styles.badgeRedOrBlue}>{post.label}</Text>
              </View>

              {post.thumbnail && (
                <Image source={post.thumbnail} style={styles.thumbnail} />
              )}
            </View>

            <Text style={styles.title}>{post.title}</Text>
            <View style={styles.meta}>
              <Text style={styles.author}>{post.author}</Text>
              {post.likes !== undefined && (
                <>
                  <Ionicons name="heart-outline" size={14} color="#555" />
                  <Text style={styles.iconText}>{post.likes}</Text>
                  <Ionicons name="chatbubble-outline" size={14} color="#555" />
                  <Text style={styles.iconText}>{post.comments}</Text>
                  <Text style={styles.time}>{post.time}</Text>
                </>
              )}
            </View>
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  content: { padding: 20 },
  card: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  badges: { flexDirection: 'row', gap: 6 },
  badgeGray: {
    backgroundColor: '#eee',
    paddingHorizontal: 6,
    borderRadius: 6,
    fontSize: 10,
    color: '#333',
  },
  badgeRedOrBlue: {
    backgroundColor: '#FBA834', // or '#D8F3FF'
    paddingHorizontal: 6,
    borderRadius: 6,
    fontSize: 10,
    color: '#fff', // or '#007A9E'
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  title: {
    fontSize: 14,
    marginTop: 6,
    color: '#222',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  author: { fontSize: 12, color: '#555', marginRight: 6 },
  iconText: { fontSize: 12, color: '#555' },
  time: { fontSize: 12, color: '#555' },
});
