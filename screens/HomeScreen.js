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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTagColor, BOARD_COLORS } from '../constants/Colors';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 상단 영역 */}
        <View style={styles.header}>
          <View style={styles.topRow}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            <View style={styles.iconRow}>
              <Ionicons name="notifications-outline" size={24} color="#FBA834" style={styles.icon} />
              <Ionicons name="person-outline" size={24} color="#FBA834" style={styles.icon} />
            </View>
          </View>
          <Text style={styles.title}>레벨업 님의 WISHBOARD</Text>
          <Text style={styles.subtitle}>한 걸음씩 쌓아가는 도전, 함께 이루어가요!</Text>
          <View style={styles.challengeRow}>
            <View style={styles.challengeList}>
              {challengeItems.map((item, index) => (
                <View key={index} style={styles.challengeItem}>
                  <View style={styles.ddayRow}>
                    <Text style={styles.ddayText}>{item.dday}</Text>
                    <View style={[styles.tag, { backgroundColor: getTagColor(item.tag) }]}>
                      <Text style={styles.tagText}>{item.tag}</Text>
                    </View>
                  </View>
                  <View style={styles.profileRow}>
                    <Image source={item.image} style={styles.profileImage} />
                    <Text style={styles.challengeText}>{item.text}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.trophySection}>
              <View style={styles.trophyTextWrapper}>
                <Text style={styles.trophyScore}>2</Text>
                <Text style={styles.trophyTotal}>/10</Text>
              </View>
              <Image source={require('../assets/images/trophy.png')} style={styles.trophyImage} />
            </View>
          </View>
        </View>

        {/* 인기 버킷리스트 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>인기 버킷리스트</Text>
            <TouchableOpacity>
              <Text style={styles.moreButton}>더보기 &gt;</Text>
            </TouchableOpacity>
          </View>
          {popularBuckets.map((item, index) => (
            <View key={index} style={styles.bucketRow}>
              <View style={[styles.tag, { backgroundColor: getTagColor(item.tag) }]}>
                <Text style={styles.tagText}>{item.tag}</Text>
              </View>
              <Text style={styles.bucketText}>{item.text}</Text>
              <TouchableOpacity style={styles.plusButton}>
                <Ionicons name="add" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* 최근 커뮤니티 글 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최근 커뮤니티 글</Text>
          {recentPosts.map((item, index) => (
            <View key={index} style={styles.postCard}>
              <View style={styles.labelRow}>
                <View style={styles.labelBox}>
                  <Text style={styles.labelText}>{item.detail}</Text>
                </View>
                <View style={[styles.labelBox, { backgroundColor: BOARD_COLORS[item.board] }]}>
                  <Text style={styles.labelText}>{item.board}</Text>
                </View>
              </View>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postAuthor}>{item.author}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const challengeItems = [
  { dday: 'D-30', tag: '배우고싶다', image: require('../assets/images/profile1.png'), text: '드럼 배우기' },
  { dday: 'D-176', tag: '해보고싶다', image: require('../assets/images/profile2.png'), text: '스카이다이빙' },
  { dday: '언젠가', tag: '되고싶다', image: require('../assets/images/profile3.png'), text: '베스트셀러작가 되기' },
];

const popularBuckets = [
  { tag: '갖고싶다', text: '포르쉐 911 사기' },
  { tag: '가보고싶다', text: '북극으로의 크루즈 여행가기' },
];

const recentPosts = [
  { board: 'Q&A', detail: '번지점프', title: '우리나라에서 가장 높은 번지점프 어디인가요??', author: '안녕' },
  { board: 'Q&A', detail: '번지점프', title: '우리나라에서 가장 높은 번지점프 어디인가요??', author: '안녕' },
  { board: 'Q&A', detail: '번지점프', title: '우리나라에서 가장 높은 번지점프 어디인가요??', author: '안녕' },
];

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { paddingBottom: 20 },
  header: { backgroundColor: '#2F327D', paddingTop: 30, paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  iconRow: { flexDirection: 'row', gap: 16 },
  icon: { marginLeft: 12 },
  title: { color: '#FBA834', fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  subtitle: { color: '#ffffff', fontSize: 12, marginTop: 4 },
  challengeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  challengeList: { flex: 1 },
  challengeItem: { marginBottom: 8 },
  ddayRow: { flexDirection: 'row', alignItems: 'center' },
  ddayText: { color: '#000', backgroundColor: '#fff', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginRight: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  tagText: { color: '#000', fontSize: 10 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  profileImage: { width: 24, height: 24, borderRadius: 12, marginRight: 6 },
  challengeText: { color: '#fff', fontSize: 13 },
  trophySection: { alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  trophyTextWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  trophyScore: { fontSize: 28, fontWeight: 'bold', color: '#FBA834' },
  trophyTotal: { fontSize: 14, marginLeft: 4, color: '#ffffff' },
  trophyImage: { width: 90, height: 90, resizeMode: 'contain' },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  moreButton: { color: '#333', fontSize: 12 },
  bucketRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  bucketText: { flex: 1, marginLeft: 10, fontSize: 14, color: '#000' },
  plusButton: { backgroundColor: '#FBA834', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  postCard: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 12 },
  labelRow: { flexDirection: 'row', marginBottom: 6 },
  labelBox: { backgroundColor: '#ddd', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginRight: 6 },
  labelText: { fontSize: 10, color: '#000' },
  postTitle: { fontSize: 14, color: '#000', marginBottom: 4 },
  postAuthor: { fontSize: 12, color: '#666' },
});
