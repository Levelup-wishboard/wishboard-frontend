// screens/BucketListAddScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TAGS = ['해보고싶다', '되고싶다', '갖고싶다', '가보고싶다', '가지고싶다'];

export default function BucketListAddScreen() {
  const navigation = useNavigation();
  const [selectedTag, setSelectedTag] = useState('해보고싶다');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [someday, setSomeday] = useState(false);
  const [reason, setReason] = useState('');
  const [vow, setVow] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const payload = {
        title: content,
        category: selectedTag,
        targetDate: someday ? null : date.toISOString().split('T')[0],
        reason,
        resolution: vow,
        image: image || null
      };

      const response = await axios.post('http://3.39.187.114:8080/api/bucketlist', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('등록 완료', '버킷리스트가 등록되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '버킷리스트 등록에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>내용</Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="예: 번지점프 하기"
          style={styles.input}
        />

        <Text style={styles.label}>태그</Text>
        <View style={styles.tagContainer}>
          {TAGS.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, selectedTag === tag && styles.selectedTag]}
              onPress={() => setSelectedTag(tag)}
            >
              <Text style={selectedTag === tag ? styles.selectedTagText : styles.tagText}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>목표 날짜</Text>
        {!someday && (
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{date.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
        )}
        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
        )}
        <TouchableOpacity onPress={() => setSomeday(!someday)}>
          <Text style={styles.somedayText}>
            {someday ? '📅 날짜 선택' : '🌙 언젠가'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>사진</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Ionicons name="camera" size={32} color="gray" />
          )}
        </TouchableOpacity>

        <Text style={styles.label}>이유</Text>
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="이걸 꿈꾸게 된 계기를 적어주세요"
          style={styles.input}
        />

        <Text style={styles.label}>다짐</Text>
        <TextInput
          value={vow}
          onChangeText={setVow}
          placeholder="포기하지 않기 위한 다짐을 적어보세요"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>등록하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
  },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tag: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  selectedTag: { backgroundColor: '#FFA726', borderColor: '#FFA726' },
  tagText: { color: '#000' },
  selectedTagText: { color: '#fff' },
  dateText: { fontSize: 16, marginTop: 8 },
  somedayText: { color: '#007BFF', marginTop: 8 },
  imagePicker: {
    width: 100,
    height: 100,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 8,
  },
  image: { width: 100, height: 100, borderRadius: 8 },
  button: {
    backgroundColor: '#FFA726',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});


