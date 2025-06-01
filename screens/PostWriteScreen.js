import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Image, Modal, FlatList, Pressable
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PrizeImg from '../assets/images/prize.png';
import * as ImagePicker from 'expo-image-picker';
import api from '../constants/api';    
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sampleTrophies } from '../mock/data';

export default function PostWriteScreen() {
  const navigation = useNavigation();
  const {
    mode,
    postId,
    postData = {},
    defaultBoardTab = '',
    diversity = '',
  } = useRoute().params || {};
  console.log('mode:', mode, 'postId:', postId, 'postData:', postData);

  // === 1. state 초기화 ===
  const [board, setBoard] = useState(
    postData.communityType || defaultBoardTab.replace('게시판', '') || '정보'
  );
  const [detail, setDetail] = useState(postData.type || '');
  const [title, setTitle] = useState(postData.title || '');
  const [content, setContent] = useState(postData.content || '');
  const [images, setImages] = useState(postData.images || []);
  const [openChat, setOpenChat] = useState(postData.openChat || '');
  const [bucketId, setBucketId] = useState(postData.bucketId || 1); // 추후 트로피 연동
  const [selectedTrophy, setSelectedTrophy] = useState(null);
  const [trophyModalVisible, setTrophyModalVisible] = useState(false);

  // === 2. 이미지 추가 ===
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('사진 접근 권한이 필요합니다!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: false,
        aspect: [4, 3],
      });
      if (!result.canceled) {
        const picked = result.assets[0];
        setImages((prev) => prev.length < 6 ? [...prev, picked] : prev);
      }
    } catch (e) {
      console.warn(e);
    }
  };
  const handleRemoveImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));
  
  // === 3. 트로피 선택 ===
  const handleTrophyImport = () => setTrophyModalVisible(true);
  const handleChooseTrophy = (trophy) => {
    setSelectedTrophy(trophy);
    setTrophyModalVisible(false);
    // setBucketId(trophy.bucketId); // 추후 구현
  };

  // === 4. 등록/수정 요청 ===
  // const handleSubmit = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('accessToken');
  //     if (!token) {
  //       alert('로그인 토큰이 없습니다. 다시 로그인 해주세요!');
  //       return;
  //     }

  //     // *** payload 정의 (서버 요구 포맷에 맞게) ***
  //     const payload = {
  //       type: detail,              // "분류" 입력값 (예: "시험", "일반")
  //       communityType: board,      // 게시판 탭명
  //       diversity,                 // 최상위 분류 (params)
  //       title,
  //       content,
  //       bucketId,
  //     };
  //     console.log('handleSubmit! mode:', mode, 'postId:', postId, 'payload:', payload);

  //     if (mode === 'edit' && postId) {
  //       // PATCH: 수정
  //       await api.patch(
  //         `/api/posts/${postId}`,
  //         payload,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             'Content-Type': 'application/json',
  //           }
  //         }
  //       );
  //       alert('글 수정 완료!');
  //       navigation.goBack();
  //     } else {
  //       // POST: 새 글 등록
  //       await api.post(
  //         '/api/posts',
  //         payload,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             'Content-Type': 'application/json',
  //           }
  //         }
  //       );
  //       alert('글 등록 성공!');
  //       navigation.goBack();
  //     }
  //   } catch (e) {
  //     console.warn('글 등록/수정 실패:', e?.response?.data || e.message);
  //     alert('글 등록/수정 실패: ' + (e?.response?.data?.message || e.message));
  //   }
  // };
const handleSubmit = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      alert('로그인 토큰이 없습니다. 다시 로그인 해주세요!');
      return;
    }

    const payload = {
      type: detail,
      communityType: board,
      diversity,
      title,
      content,
      bucketId,
    };

     console.log('handleSubmit! mode:', mode, 'postId:', postId, 'payload:', payload);

    // 무조건 POST (새 글 등록)
    await api.post(
      '/api/posts',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    alert('글 작성(수정) 완료');
    navigation.goBack();
  } catch (e) {
    console.warn('글 등록/수정 실패:', e?.response?.data || e.message);
    alert('글 등록/수정 실패: ' + (e?.response?.data?.message || e.message));
  }
};

  const isTrophy = board === '트로피';
  const isRecruit = board === '인원모집';

  // === 5. UI ===
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header showBackButton leftContent={mode === 'edit' ? '글 수정' : '글쓰기'} />
      <ScrollView contentContainerStyle={styles.form}>
        {/* 게시판 */}
        <Text style={styles.label}>게시판</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['정보', 'Q&A', '인원모집', '트로피'].map((b) => (
            <TouchableOpacity
              key={b}
              style={[styles.boardChip, board === b && styles.boardChipActive]}
              onPress={() => setBoard(b)}
            >
              <Text style={[
                styles.boardChipText,
                board === b && styles.boardChipTextActive,
              ]}>
                {b}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* 분류 */}
        <Text style={styles.label}>분류</Text>
        <TextInput
          style={styles.input}
          placeholder="예) 수상 스키, 시험, 일상"
          value={detail}
          onChangeText={setDetail}
        />
        {/* 제목 */}
        <Text style={styles.label}>제목</Text>
        <TextInput
          style={[styles.input, { fontWeight: '600' }]}
          placeholder="제목을 입력하세요"
          value={title}
          onChangeText={setTitle}
        />
        {/* 본문 */}
        <Text style={styles.label}>본문</Text>
        <TextInput
          style={[styles.input, { height: 160 }]}
          placeholder="내용을 입력하세요"
          value={content}
          onChangeText={setContent}
          multiline
        />
        {/* 트로피 전용 UI */}
        {isTrophy ? (
          <>
            <Text style={styles.label}>트로피 선택하기</Text>
            {selectedTrophy && (
              <View style={styles.trophyCardSelected}>
                <Image source={PrizeImg} style={styles.trophyIcon} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.trophyCategory}>{selectedTrophy.category}</Text>
                  <Text style={styles.trophyTitle}>{selectedTrophy.title}</Text>
                  <Text style={styles.trophyDate}>작성일: {selectedTrophy.createdAt}</Text>
                  <Text style={styles.trophyDate}>달성일: {selectedTrophy.achievedAt}</Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={styles.trophyBtn}
              onPress={handleTrophyImport}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.trophyText}>
                {selectedTrophy ? '다시 선택' : '트로피 가져오기'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>사진 추가 (최대 6장)</Text>
            <View style={styles.imageGrid}>
              {Array.from({ length: 6 }).map((_, idx) => {
                const img = images[idx];
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.imageCell}
                    onPress={img ? () => handleRemoveImage(idx) : pickImage}
                    onLongPress={img ? () => handleRemoveImage(idx) : undefined}
                  >
                    {img ? (
                      <Image source={{ uri: img.uri }} style={styles.imageThumb} />
                    ) : (
                      <Ionicons name="add" size={24} color="#666" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
        
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>게시하기</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* 트로피 선택 모달 */}
      <Modal
        visible={trophyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTrophyModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setTrophyModalVisible(false)} />
        <View style={styles.modalBox}>
          <FlatList
            data={sampleTrophies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.trophyCard}
                onPress={() => handleChooseTrophy(item)}
              >
                <Image source={PrizeImg} style={styles.trophyIcon} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.trophyCategory}>{item.category}</Text>
                  <Text style={styles.trophyTitle}>{item.title}</Text>
                  <Text style={styles.trophyDate}>작성일: {item.createdAt}</Text>
                  <Text style={styles.trophyDate}>달성일: {item.achievedAt}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}


/* ---------------- 스타일 ---------------- */
const styles = StyleSheet.create({
  form: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#FFF',
  },

  /* Chip */
  boardChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 4,
  },
  boardChipActive: { backgroundColor: '#FBA834', borderColor: '#FBA834' },
  boardChipText: { fontSize: 13, color: '#333' },
  boardChipTextActive: { color: '#FFF' },

  /* 이미지 그리드 */
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  imageCell: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#F1F1F1',
  },
  imageThumb: { width: '100%', height: '100%', borderRadius: 6 },

  /* 트로피 버튼 */
  trophyBtn: {
    marginTop: 12,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FBA834',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyText: { color: '#FFF', fontWeight: '600', marginLeft: 6 },
  /* 트로피 카드 (목록용) */
  trophyCard: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  trophyCardSelected: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FFE4B8',
    borderRadius: 12,
  },
  trophyCategory: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0288D1',
    marginBottom: 2,
  },
  trophyTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  trophyDate: { fontSize: 11, color: '#555' },


  /* 등록 버튼 */
  submitBtn: {
    marginTop: 32,
    backgroundColor: '#0A185B',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  /* Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalBox: {
    position: 'absolute',
    top: '25%',
    left: 20,
    right: 20,
    maxHeight: '50%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 6,
  },
});
