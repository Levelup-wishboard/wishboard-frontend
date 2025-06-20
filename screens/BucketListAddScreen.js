import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BucketListContext } from '../context/BucketListContext';

const TAGS = ['해보고싶다', '되고싶다', '갖고싶다', '가보고싶다', '배우고싶다'];

export default function BucketListAddScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const editingBucket = route.params?.bucket;
  const isEditing = route.params?.isEditMode ?? !!editingBucket;

  const { addBucketItem, updateBucketItem, deleteBucketItem } = useContext(BucketListContext);

  const [selectedTag, setSelectedTag] = useState(editingBucket?.tag || '해보고싶다');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [someday, setSomeday] = useState(editingBucket?.dday === '언젠가');
  const [reason, setReason] = useState(editingBucket?.reason || '');
  const [vow, setVow] = useState(editingBucket?.vow || '');
  const [content, setContent] = useState(editingBucket?.title || editingBucket?.text || '');
  const [image, setImage] = useState(
    editingBucket?.image
      ? typeof editingBucket.image === 'string'
        ? editingBucket.image
        : editingBucket.image.uri
      : null
  );

  useEffect(() => {
    if (editingBucket && editingBucket.dday && editingBucket.dday !== '언젠가') {
      const ddayMatch = editingBucket.dday.match(/D-(\d+)/);
      if (ddayMatch) {
        const days = parseInt(ddayMatch[1], 10);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        setDate(targetDate);
      }
    }
  }, [editingBucket]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('사진 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObj.getDate()).slice(-2);
    return `${year}.${month}.${day}`;
  };

  const handleSubmit = () => {
    const dday = someday
      ? '언젠가'
      : `D-${Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24))}`;

    const bucketData = {
      id: editingBucket?.id ?? Date.now().toString(),
      dday,
      tag: selectedTag,
      image: image ? { uri: image } : require('../assets/images/profile1.png'),
      text: content,
      reason,
      vow,
    };

    if (isEditing) {
      updateBucketItem(bucketData.id, bucketData);
    } else {
      addBucketItem(bucketData);
    }

    navigation.navigate('BucketListHome');
  };

  const handleDelete = () => {
    Alert.alert('삭제 확인', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제', style: 'destructive', onPress: () => {
          deleteBucketItem(editingBucket.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBarSticky}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>버킷리스트 작성</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="당신의 버킷리스트를 적어주세요"
          value={content}
          onChangeText={setContent}
        />

        <View style={styles.tagContainer}>
          {TAGS.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[styles.tagButton, selectedTag === tag && styles.tagButtonActive]}
              onPress={() => setSelectedTag(tag)}
            >
              <Text style={selectedTag === tag ? styles.tagTextActive : styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>목표날짜</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={[styles.dateBox, !someday && styles.dateActive]}
            onPress={() => {
              setSomeday(false);
              setShowDatePicker(true);
            }}
          >
            <Text style={[styles.dateText, !someday && styles.dateTextActive]}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dateBox, someday && styles.dateActive]}
            onPress={() => setSomeday(true)}
          >
            <Text style={[styles.dateText, someday && styles.dateTextActive]}>언젠가</Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        <TouchableOpacity style={styles.imageUploadBox} onPress={handleSelectImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text style={{ color: '#888' }}>사진 넣기</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="이 꿈을 꾸게 된 이유"
          value={reason}
          onChangeText={setReason}
        />

        <TextInput
          style={styles.input}
          placeholder="포기하지 않기 위한 나만의 다짐"
          value={vow}
          onChangeText={setVow}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>저장하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  headerBarSticky: {
    backgroundColor: '#2F327D',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerTitle: {
    color: '#FBA834',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  tagButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagButtonActive: {
    borderColor: '#FBA834',
    backgroundColor: '#FBA834',
  },
  tagText: { color: '#333' },
  tagTextActive: { color: '#fff', fontWeight: 'bold' },
  label: { fontSize: 12, marginBottom: 6 },
  dateRow: { flexDirection: 'row', marginBottom: 16 },
  dateBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  dateActive: {
    borderColor: '#FBA834',
    backgroundColor: '#FBA834',
  },
  dateText: { color: '#666' },
  dateTextActive: { color: '#fff', fontWeight: 'bold' },
  imageUploadBox: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: '#FBA834',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});