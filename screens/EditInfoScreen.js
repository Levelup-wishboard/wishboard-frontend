import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function EditInfoScreen() {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await axios.post(
        'http://3.39.187.114:8080/users/update',  //본인 pc ip주소로 바꿔줘야함.
        {
          nickName: nickname,
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('성공', '정보가 변경되었습니다.');
      navigation.goBack();
    } catch (err) {
      console.error('정보 변경 실패:', err);
      Alert.alert('오류', '정보 변경에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FBA834" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} >정보 변경</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.input}
          placeholder="닉네임"
          placeholderTextColor="#999"
          value={nickname}
          onChangeText={setNickname}
        />

        <Text style={styles.label}>새 비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="새 비밀번호"
          placeholderTextColor="#999"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="새 비밀번호 확인"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>저장하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#2F336A',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {},
  headerTitle: {
    fontSize: 16,
    color: '#FBA834',
    fontWeight: 'bold',
  },
  form: {
    padding: 24,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#FBA834',
    paddingVertical: 14,
    marginTop: 40,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
