// screens/PostWriteScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  FlatList,
  Pressable,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PrizeImg from '../assets/images/prize.png';
import * as ImagePicker from 'expo-image-picker';
import { sampleTrophies } from '../mock/data';

export default function PostWriteScreen() {
  const navigation = useNavigation();
  const { 
    communityId, 
    communityTitle, 
    defaultBoardTab,
    mode,
    postData,
    onSave,
  } = useRoute().params;

  /* ---- 상태 ---- */
  const [board, setBoard] = useState(
    postData?.board  || defaultBoardTab?.replace('게시판', '') || '정보'
  );
  const [detail, setDetail] = useState(postData?.detail  || '');
  const [title, setTitle] = useState(postData?.title   || '');
  const [content, setContent] = useState(postData?.content || '');
  const [images, setImages] = useState(postData?.images  || []);              // {uri,...} 배열
  const [openChat, setOpenChat] = useState('');

   /* ---- 트로피 관련 ---- */
   const [selectedTrophy, setSelectedTrophy] = useState(null);
   const [trophyModalVisible, setTrophyModalVisible] = useState(false);

  /* ---- 사진 선택 (placeholder) ---- */
 /* ----- 이미지 선택 ----- */
const pickImage = async () => {
    try {
      // 권한
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('사진 접근 권한이 필요합니다!');
        return;
      }
  
      // 이미지 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: false,
        aspect: [4, 3],
      });
  
      if (!result.canceled) {
        const picked = result.assets[0]; // {uri,width,height,...}
  
        // 최대 6장
        setImages((prev) =>
          prev.length < 6 ? [...prev, picked] : prev
        );
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleRemoveImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));
  

  const handleTrophyImport = () => setTrophyModalVisible(true);

  const handleChooseTrophy = (trophy) => {
    setSelectedTrophy(trophy);
    setTrophyModalVisible(false);
  };


  /* ---- 저장 ---- */
  const handleSubmit = () => {
    console.log({
      communityId,
      board,
      detail,
      title,
      content,
      images,
      openChat,
      selectedTrophy,
    });
    const payload = { board, detail, title, content, images, openChat, selectedTrophy };
    if (mode === 'edit' && onSave){
      onSave(payload); 
    } else{
      console.log('새 글 저장', payload);
    }
    navigation.goBack();
  };

  /* ---- UI ---- */
  const isTrophy  = board === '트로피';
  const isRecruit = board === '인원모집';

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header showBackButton leftContent={mode === 'edit' ? '글 수정' : (communityTitle || '글쓰기')} />

      <ScrollView contentContainerStyle={styles.form}>
        {/* 게시판 선택 */}
        <Text style={styles.label}>게시판</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['정보', 'Q&A', '인원모집', '트로피'].map((b) => (
            <TouchableOpacity
              key={b}
              style={[styles.boardChip, board === b && styles.boardChipActive]}
              onPress={() => setBoard(b)}
            >
              <Text
                style={[
                  styles.boardChipText,
                  board === b && styles.boardChipTextActive,
                ]}
              >
                {b}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 분류, 제목, 본문 */}
        <Text style={styles.label}>분류</Text>
        <TextInput
          style={styles.input}
          placeholder="예) 수상 스키"
          value={detail}
          onChangeText={setDetail}
        />
        <Text style={styles.label}>제목</Text>
        <TextInput
          style={[styles.input, { fontWeight: '600' }]}
          placeholder="제목을 입력하세요"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>본문</Text>
        <TextInput
          style={[styles.input, { height: 160 }]}
          placeholder="내용을 입력하세요"
          value={content}
          onChangeText={setContent}
          multiline
        />

        {/* ---------- 트로피 전용 ---------- */}
        {isTrophy ? (
          <>
            <Text style={styles.label}>트로피 선택하기</Text>

            {selectedTrophy ? (
              /* 선택 완료된 트로피 카드 */
              <View style={styles.trophyCardSelected}>
                <Image source={PrizeImg} style={styles.trophyIcon} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.trophyCategory}>
                    {selectedTrophy.category}
                  </Text>
                  <Text style={styles.trophyTitle}>{selectedTrophy.title}</Text>
                  <Text style={styles.trophyDate}>
                    작성일: {selectedTrophy.createdAt}
                  </Text>
                  <Text style={styles.trophyDate}>
                    달성일: {selectedTrophy.achievedAt}
                  </Text>
                </View>
              </View>
            ) : null}

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
          /* ---------- 사진 전용 ---------- */
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
        {/* 오픈카톡 링크 (인원모집 전용) */}
        {isRecruit && (
          <>
            <Text style={styles.label}>오픈카톡방 링크</Text>
            <TextInput
              style={styles.input}
              placeholder="https://open.kakao.com/..."
              value={openChat}
              onChangeText={setOpenChat}
              autoCapitalize="none"
            />
          </>
        )}

        {/* 게시하기 버튼 */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>게시하기</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ------------- 트로피 선택 Modal ------------- */}
      <Modal
        visible={trophyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTrophyModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setTrophyModalVisible(false)}
        />

        <View style={styles.modalBox}>
          <FlatList
            data={sampleTrophies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.trophyCard}
                onPress={() => handleChooseTrophy(item)}
              >
                {/* <Ionicons name="trophy" size={36} color="#FBA834" /> */}
                <Image source={PrizeImg} style={styles.trophyIcon} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.trophyCategory}>{item.category}</Text>
                  <Text style={styles.trophyTitle}>{item.title}</Text>
                  <Text style={styles.trophyDate}>
                    작성일: {item.createdAt}
                  </Text>
                  <Text style={styles.trophyDate}>
                    달성일: {item.achievedAt}
                  </Text>
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
