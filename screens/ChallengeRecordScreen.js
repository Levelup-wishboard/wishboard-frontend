import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Image, TextInput,
  ScrollView, Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTagColor } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';

export default function ChallengeRecordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const bucket = route.params?.bucket;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [recordText, setRecordText] = useState('');

  const formattedDate = moment(selectedDate).format('YYYY-MM-DD');

  const fetchRecord = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(
        `http://3.39.187.114:8080/api/bucketlist-log?bucketId=${bucket.id}&date=${formattedDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { imageUrl, content } = response.data;
      setImage(imageUrl || null);
      setRecordText(content || '');
    } catch (error) {
      console.log('기록 없음 또는 불러오기 실패');
      setImage(null);
      setRecordText('');
    }
  };

  useEffect(() => {
    fetchRecord();
  }, [selectedDate]);

  const changeDate = (days) => {
    const newDate = moment(selectedDate).add(days, 'days').toDate();
    setSelectedDate(newDate);
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

  const saveRecord = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const payload = {
        bucketId: bucket.id,
        date: formattedDate,
        content: recordText,
        image: image || null,
      };
      await axios.post('http://3.39.187.114:8080/api/bucketlist-log', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('저장 완료', '기록이 저장되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('저장 실패:', error);
      Alert.alert('오류', '기록 저장에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.dateText}>{moment(selectedDate).format('YYYY.MM.DD')}</Text>

        <View style={styles.navButtons}>
          <TouchableOpacity onPress={() => changeDate(-1)} style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color="#444" />
            <Text>이전 기록</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeDate(1)} style={styles.navButton}>
            <Text>다음 기록</Text>
            <Ionicons name="chevron-forward" size={24} color="#444" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Ionicons name="camera-outline" size={40} color="#ccc" />
          )}
        </TouchableOpacity>

        <TextInput
          value={recordText}
          onChangeText={setRecordText}
          placeholder="오늘의 도전 내용을 기록해보세요!"
          style={styles.textArea}
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveRecord}>
          <Text style={styles.saveButtonText}>저장하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  dateText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginVertical: 10,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  imageBox: {
    width: 200,
    height: 200,
    backgroundColor: '#eee',
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    height: 160,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FFA726',
    marginHorizontal: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

