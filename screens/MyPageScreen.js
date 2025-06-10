// screens/MyPageScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 메뉴 아이템 컴포넌트 (딱 1번만 선언)
function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={20} color="white" style={{ marginRight: 12 }} />
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function MyPageScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [nickname, setNickname] = useState('');
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;
  
        const response = await axios.get('http://3.39.187.114:8080/users/mypage', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setNickname(response.data.nickname);
      } catch (err) {
        console.error('닉네임 불러오기 실패', err);
      }
    };
  
    fetchNickname();
  }, []);
  
  

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'LoginScreen' }] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="chevron-back" size={28} color="#FBA834" />
          </TouchableOpacity>
          <View style={styles.greetingContainer}>
            <Text style={styles.headerText}>환영합니다</Text>
            <Text style={styles.nameText}>{nickname}</Text>
          </View>
          <View style={{ width: 28 }} />
        </View>
      </View>

      {/* 모달 */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>로그아웃</Text>
            <Text style={styles.modalMessage}>정말 로그아웃 하시겠습니까?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalYes} onPress={handleLogout}>
                <Text style={styles.modalYesText}>예</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalNo} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalNoText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 메뉴 리스트 */}
      <ScrollView contentContainerStyle={styles.content}>
        
        
        <MenuItem
          icon="chatbubble-ellipses-outline"
          label="댓글 단 글"
          onPress={() => navigation.navigate('CommentPost')}
        />
        <MenuItem
          icon="thumbs-up-outline"
          label="좋아요 단 글"
          onPress={() => navigation.navigate('LikedPosts')}
        />
        <MenuItem
          icon="document-text-outline"
          label="내가 쓴 글"
          onPress={() => navigation.navigate('MyPosts')}
        />
        <MenuItem
          icon="trophy-outline"
          label="진행중인 버킷리스트"
          onPress={() => navigation.navigate('OngoingBucketList')}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#2F336A',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    position: 'relative',
  },
  backButton: { position: 'absolute', left: 24, top: 48 },
 greetingContainer: {
  alignItems: 'center',
  marginTop: -8, // 원하는 만큼 숫자 조절
},
  headerText: { color: 'white', fontSize: 14 },
  nameText: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  content: { paddingHorizontal: 24, paddingVertical: 20 },
  menuItem: {
    backgroundColor: '#2F336A',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  menuText: { color: 'white', fontSize: 16 },
  logoutButton: {
    backgroundColor: '#FBA834',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },

  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '75%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#000',
  },
  modalMessage: {
    fontSize: 14,
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalYes: {
    backgroundColor: '#FBA834',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modalYesText: { color: '#fff', fontWeight: 'bold' },
  modalNo: {
    backgroundColor: '#eee',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modalNoText: { color: '#333', fontWeight: 'bold' },
});
