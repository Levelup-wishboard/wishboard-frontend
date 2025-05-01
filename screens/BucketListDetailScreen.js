import React, { useState } from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getTagColor } from '../constants/Colors';

export default function BucketListDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const bucket = route.params?.bucket || {
    id: 1,
    dday: 'D-30',
    tag: '배우고싶다',
    title: '드럼 배우기',
    reason: '드럼 소리에 매료되어 직접 해보고 싶어짐',
    vow: '매주 1회 학원 가기',
    image: require('../assets/images/profile1.png'),
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  const handleEdit = () => {
    navigation.navigate('BucketListAdd');
  };

  const handleDelete = () => {
    Alert.alert('삭제 확인', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', onPress: () => navigation.goBack() },
    ]);
  };

  const handleCompletePress = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmComplete = () => {
    setShowConfirmModal(false);
    setShowCongratsModal(true);
  };

  const handleTrophyNavigate = () => {
    setShowCongratsModal(false);
    navigation.navigate('Trophy');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.rowTop}>
            <Text style={styles.dday}>{bucket.dday}</Text>
            <View style={[styles.tagBox, { backgroundColor: getTagColor(bucket.tag) }]}>
              <Text style={styles.tagText}>{bucket.tag}</Text>
            </View>
          </View>
          <View style={styles.rowMid}>
            <Image source={bucket.image} style={styles.image} />
            <Text style={styles.title}>{bucket.title}</Text>
          </View>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleEdit}>
            <Ionicons name="pencil-outline" size={22} color="#FBA834" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={22} color="#FBA834" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <Text style={styles.label}>이 꿈을 꾸게 된 이유</Text>
        <View style={styles.textBox}>
          <Text>{bucket.reason}</Text>
        </View>

        <Text style={styles.label}>포기하지 않기 위한 나만의 다짐</Text>
        <View style={styles.textBox}>
          <Text>{bucket.vow}</Text>
        </View>

        <TouchableOpacity style={styles.recordButton}>
          <Text style={styles.buttonText}>오늘의 도전 기록하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.completeButton} onPress={handleCompletePress}>
          <Text style={styles.buttonText}>달성 완료</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 1차 확인 모달 */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalWrapper}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>달성완료</Text>
            <Text style={styles.modalText}>버킷리스트를 달성하셨나요?</Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleConfirmComplete}
              >
                <Text style={styles.modalButtonText}>예</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 축하 모달 */}
      <Modal visible={showCongratsModal} transparent animationType="fade">
        <View style={styles.modalWrapper}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>버킷리스트 달성을 축하해요!</Text>
            <Image
              source={require('../assets/images/trophy.png')}
              style={{ width: 64, height: 64, marginVertical: 16 }}
            />
            <TouchableOpacity
              style={styles.trophyButton}
              onPress={handleTrophyNavigate}
            >
              <Text style={styles.buttonText}>트로피 보러가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#2F327D',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  rowMid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dday: {
    color: '#000',
    fontSize: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagBox: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    color: '#000',
  },
  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    marginLeft: 8,
  },
  contentWrapper: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
    color: '#000',
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
  },
  recordButton: {
    backgroundColor: '#FBA834',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 30,
  },
  completeButton: {
    backgroundColor: '#FBA834',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: 280,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalConfirmButton: {
    backgroundColor: '#FBA834',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  modalCancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  trophyButton: {
    backgroundColor: '#FBA834',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
