// screens/BucketListDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getTagColor } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function BucketListDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const bucketId = route.params?.bucketId;

  const [bucket, setBucket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  const fetchDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`http://3.39.187.114:8080/api/bucketlist/${bucketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBucket(response.data);
    } catch (error) {
      console.error('상세 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.delete(`http://3.39.187.114:8080/api/bucketlist/${bucketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('삭제 완료', '버킷리스트가 삭제되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.post(`http://3.39.187.114:8080/api/bucketlist/${bucketId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowCongratsModal(true);
    } catch (error) {
      console.error('완료 처리 실패:', error);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  if (loading || !bucket) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FFA726" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={bucket.image ? { uri: bucket.image } : require('../assets/images/default.png')}
          style={styles.image}
        />
        <View style={styles.header}>
          <Text style={styles.dday}>{bucket.dday}</Text>
          <Text style={[styles.tag, { backgroundColor: getTagColor(bucket.category) }]}>
            {bucket.category}
          </Text>
          <Text style={styles.title}>{bucket.title}</Text>
        </View>

        <Text style={styles.sectionTitle}>이유</Text>
        <Text style={styles.sectionContent}>{bucket.reason || '없음'}</Text>

        <Text style={styles.sectionTitle}>다짐</Text>
        <Text style={styles.sectionContent}>{bucket.resolution || '없음'}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('BucketListAdd')}>
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => setShowConfirmModal(true)}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>삭제</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeText}>완료로 표시하기</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>정말 삭제하시겠습니까?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowConfirmModal(false)}>
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Text style={styles.confirmText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showCongratsModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>🎉 도전 완료! 축하합니다!</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 200 },
  header: { padding: 20 },
  dday: { fontSize: 14, color: '#888' },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginVertical: 6,
    color: '#fff',
    fontSize: 12,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, paddingHorizontal: 20 },
  sectionContent: { paddingHorizontal: 20, marginTop: 6, fontSize: 14 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  editButton: {
    backgroundColor: '#FFA726',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', marginLeft: 6 },
  completeButton: {
    backgroundColor: '#43A047',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-around',
  },
  cancelText: { color: '#888' },
  confirmText: { color: '#E53935', fontWeight: 'bold' },
});
