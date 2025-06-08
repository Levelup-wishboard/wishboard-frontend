// ChallengeRecordScreen.js (전체 수정 버전)

import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Image, TextInput,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTagColor } from '../constants/Colors';
import { ChallengeRecordContext } from '../context/ChallengeRecordContext';

export default function ChallengeRecordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const bucket = route.params?.bucket;

  const {
    getRecords,
    addRecord,
    updateRecord,
    getTodayDate,
  } = useContext(ChallengeRecordContext);

  const [records, setRecords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [image, setImage] = useState(null);
  const [recordText, setRecordText] = useState('');

  useEffect(() => {
    if (!bucket) return;
    const today = getTodayDate();
    const existingRecords = getRecords(bucket.id);
    const hasToday = existingRecords.some(r => r.date === today);

    if (!hasToday) {
      const newRecords = [...existingRecords, { date: today, image: null, text: '' }];
      setRecords(newRecords);
      setCurrentIndex(newRecords.length - 1);
      setImage(null);
      setRecordText('');
    } else {
      const sortedRecords = [...existingRecords].sort((a, b) => a.date.localeCompare(b.date));
      setRecords(sortedRecords);
      const index = sortedRecords.findIndex(r => r.date === today);
      const record = sortedRecords[index];
      setCurrentIndex(index);
      setImage(record.image);
      setRecordText(record.text);
    }
  }, [bucket]);

  if (!bucket) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>버킷리스트 정보를 불러올 수 없습니다.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.navText}>{'돌아가기'}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
      setImage(result.assets[0].uri);
    }
  };

  const handleNavigateRecord = (direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < records.length) {
      const record = records[newIndex];
      setCurrentIndex(newIndex);
      setImage(record.image);
      setRecordText(record.text);
    }
  };

  const handleSave = () => {
    const updated = {
      ...records[currentIndex],
      image,
      text: recordText,
    };
    updateRecord(bucket.id, updated);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>오늘의 도전 기록</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.bucketInfo}>
          <Image
            source={typeof bucket.image === 'string' ? { uri: bucket.image } : bucket.image || require('../assets/images/profile1.png')}
            style={styles.image}
          />
          <View>
            <Text style={styles.title}>{bucket.text || bucket.title}</Text>
            <View style={[styles.tagBox, { backgroundColor: getTagColor(bucket.tag) }]}>
              <Text style={styles.tagText}>{bucket.tag}</Text>
            </View>
          </View>
        </View>

        <View style={styles.dateBox}>
          <Text style={styles.dateText}>{records[currentIndex]?.date}</Text>
        </View>

        <TouchableOpacity style={styles.imageUploadBox} onPress={handleSelectImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imageUploadText}>사진 넣기</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>무엇을 했고 어떤 생각이 들었나요?</Text>
        <TextInput
          style={styles.textArea}
          multiline
          value={recordText}
          onChangeText={setRecordText}
          placeholder="오늘의 도전 내용을 기록해보세요."
        />

        <View style={styles.navigationRow}>
          <TouchableOpacity
            style={styles.navButton}
            disabled={currentIndex === 0}
            onPress={() => handleNavigateRecord(-1)}
          >
            <Text style={styles.navText}>{'< 이전'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            disabled={currentIndex === records.length - 1}
            onPress={() => handleNavigateRecord(1)}
          >
            <Text style={styles.navText}>{'다음 >'}</Text>
          </TouchableOpacity>
        </View>

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