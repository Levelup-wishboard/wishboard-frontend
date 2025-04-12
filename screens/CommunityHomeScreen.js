// screens/CommunityHomeScreen.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CommunityHomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 검색 영역 */}
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="게시판을 입력해주세요"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* 콘텐츠 영역 (스크롤) */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* 즐겨찾기 커뮤니티 */}
        <Text style={styles.sectionTitle}>즐겨찾기 커뮤니티</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="bookmark-outline" size={20} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>익스트림 스포츠</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="bookmark-outline" size={20} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>실내활동</Text>
          </TouchableOpacity>
        </View>

        {/* 알림 키워드 */}
        <Text style={styles.sectionTitle}>알림 키워드</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="star" size={20} color="#FBA834" style={styles.menuIcon} />
            <Text style={styles.menuText}>스카이다이빙</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="star" size={20} color="#FBA834" style={styles.menuIcon} />
            <Text style={styles.menuText}>피아노</Text>
          </TouchableOpacity>
        </View>

        {/* 관제 커뮤니티 */}
        <Text style={styles.sectionTitle}>관제 커뮤니티</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="people-outline" size={20} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>익스트림 스포츠</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="people-outline" size={20} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>실내활동</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="people-outline" size={20} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>학업</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="people-outline" size={20} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>피트니스·건강</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#333A73', // 상단 영역 배경색 (예시)
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: '#000',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    // 그림자 효과 (iOS 전용), 안드로이드는 elevation 사용
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // 안드로이드 그림자
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuIcon: {
    marginRight: 8,
  },
  menuText: {
    fontSize: 14,
    color: '#333',
  },
});

export default CommunityHomeScreen;