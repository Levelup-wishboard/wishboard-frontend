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
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useRoute } from '@react-navigation/native';

const CommunityHomeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // 클릭 시 detail로 이동
  const goDetail = (id, title) => {
    navigation.navigate('CommunityDetail', { communityId: id, title });
  };

  const onAddKeyword = () => {
    // TODO: 키워드 추가 로직 (모달 열기 등)
    console.log('알림 키워드 추가');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header leftContent=''/>
      {/* 검색 영역 */}
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 즐겨찾기 커뮤니티 */}
        <Text style={styles.sectionTitle}>즐겨찾기 커뮤니티</Text>
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => goDetail('extreme-sports', '익스트림 스포츠')}
          >
            <Ionicons name="bookmark" size={20} color="#FBA834" style={styles.menuIcon} />
            <Text style={styles.menuText}>익스트림 스포츠</Text>
          </TouchableOpacity>
        </View>

        {/* 알림 키워드 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>알림 키워드</Text>
          <TouchableOpacity onPress={onAddKeyword} style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color="#FBA834" />
          </TouchableOpacity>
        </View>
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

        {/* 전체 커뮤니티 */}
        <Text style={styles.sectionTitle}>전체 커뮤니티</Text>
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => goDetail('extreme-sports', '익스트림 스포츠')}
          >
            <Ionicons name="people-outline" size={20} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>익스트림 스포츠</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => goDetail('indoor-activities', '실내활동')}
          >
            <Ionicons name="people-outline" size={20} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>실내활동</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => goDetail('study', '학업')}
          >
            <Ionicons name="people-outline" size={20} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>학업</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => goDetail('health', '피트니스•건강')}
          >
            <Ionicons name="people-outline" size={20} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>피트니스•건강</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { paddingHorizontal: 16, paddingVertical: 16 },
  header: {
    backgroundColor: '#333A73', 
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    marginTop: -2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  searchInput: {
    flex: 1,
    color: '#000',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  addButton: {
    padding: 4,
    marginBottom: -17,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, 
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