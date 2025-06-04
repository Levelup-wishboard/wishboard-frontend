import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Image, TextInput,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTagColor } from '../constants/Colors';

export default function ChallengeRecordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const bucket = route.params?.bucket;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [image, setImage] = useState(null);
  const [recordText, setRecordText] = useState('1일차 기록입니다.');

  // 샘플 기록
  const records = [
    { date: '2025.05.01', image: null, text: '1일차 기록입니다.' },
    { date: '2025.04.30', image: null, text: '2일차 기록입니다.' },
    { date: '2025.04.29', image: null, text: '3일차 기록입니다.' },
  ];

  const record = records[currentIndex];

  const handleSelectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('사진 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });
    if (!result.canceled) {
      records[currentIndex].image = result.assets[0].uri;
      setImage(result.assets[0].uri);
    }
  };

  const handleNavigateRecord = (direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < records.length) {
      setCurrentIndex(newIndex);
      setRecordText(records[newIndex].text);
      setImage(records[newIndex].image);
    }
  };

  const handleSave = () => {
    records[currentIndex].text = recordText;
    navigation.navigate('BucketListDetail', { bucket });
  };

  const handleGoBackToList = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'BucketListHome' }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBackToList}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>오늘의 도전 기록</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* 버킷리스트 정보 */}
        <View style={styles.bucketInfo}>
          <Image
            source={typeof bucket.image === 'string' ? { uri: bucket.image } : bucket.image}
            style={styles.image}
          />
          <View>
            <Text style={styles.title}>{bucket.title}</Text>
            <View style={[styles.tagBox, { backgroundColor: getTagColor(bucket.tag) }]}>
              <Text style={styles.tagText}>{bucket.tag}</Text>
            </View>
          </View>
        </View>

        {/* 날짜 */}
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>{record.date}</Text>
        </View>

        {/* 사진 */}
        <TouchableOpacity style={styles.imageUploadBox} onPress={handleSelectImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imageUploadText}>사진 넣기</Text>
          )}
        </TouchableOpacity>

        {/* 텍스트 입력 */}
        <Text style={styles.label}>어떤 걸 했는지, 어떤 생각이 들었는지 기록해보세요</Text>
        <TextInput
          style={styles.textArea}
          multiline
          placeholder="여기에 작성하세요..."
          value={recordText}
          onChangeText={setRecordText}
        />

        {/* 이전/다음 */}
        <View style={styles.navigationRow}>
          <TouchableOpacity
            style={styles.navButton}
            disabled={currentIndex === 0}
            onPress={() => handleNavigateRecord(-1)}
          >
            <Text style={styles.navText}>{'< 이전 기록'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            disabled={currentIndex === records.length - 1}
            onPress={() => handleNavigateRecord(1)}
          >
            <Text style={styles.navText}>{'다음 기록 >'}</Text>
          </TouchableOpacity>
        </View>

        {/* 저장 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>저장하기</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerTitle: { color: '#FBA834', fontSize: 16, fontWeight: 'bold' },
  container: { padding: 20 },
  bucketInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  image: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  tagBox: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  tagText: { fontSize: 10, color: '#000' },
  dateBox: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, alignItems: 'center', marginBottom: 16,
  },
  dateText: { fontSize: 14, color: '#000' },
  imageUploadBox: {
    width: '100%', aspectRatio: 1, borderWidth: 1, borderColor: '#ccc',
    backgroundColor: '#f2f2f2', borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  imagePreview: { width: '100%', height: '100%', borderRadius: 8, resizeMode: 'cover' },
  imageUploadText: { color: '#888' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#000' },
  textArea: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, textAlignVertical: 'top', marginBottom: 20,
  },
  navigationRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20,
  },
  navButton: { paddingHorizontal: 12, paddingVertical: 8 },
  navText: { fontSize: 14, color: '#555' },
  saveButton: {
    backgroundColor: '#FBA834', paddingVertical: 14,
    borderRadius: 24, alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});