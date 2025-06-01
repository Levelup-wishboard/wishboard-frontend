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
import { Ionicons } from '@expo/vector-icons'; // 뒤로가기 아이콘용
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const navigation = useNavigation();

  
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post('http://3.39.187.114:8080/users/user', {  //본인 pc ip주소로 바꿔줘야함.
        userId: username,
        password: password,
        nickName: nickname,
      });

      Alert.alert('성공', '회원가입성공');
      navigation.goBack(); // 로그인 페이지로 이동
    } catch (error) {
      console.error(error);
      Alert.alert('회원가입 실패', error.response?.data?.message || '서버 오류 발생');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="#F7A938"/>
      </TouchableOpacity>

      <View style={styles.form}>
        {/* 아이디 */}
        <Text style={styles.label}>아이디</Text>
        <View style={styles.row}>
          <TextInput
            placeholder="아이디"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TouchableOpacity style={styles.checkButton}>
            <Text style={styles.checkButtonText}>중복확인</Text>
          </TouchableOpacity>
        </View>

        {/* 비밀번호 */}
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          placeholder="비밀번호"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.inputFull}
        />
        <TextInput
          placeholder="비밀번호 확인"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.inputFull}
        />

        {/* 닉네임 */}
        <Text style={styles.label}>닉네임</Text>
        <View style={styles.row}>
          <TextInput
            placeholder="닉네임"
            placeholderTextColor="#999"
            value={nickname}
            onChangeText={setNickname}
            style={styles.input}
          />
          <TouchableOpacity style={styles.checkButton}>
            <Text style={styles.checkButtonText}>중복확인</Text>
          </TouchableOpacity>
        </View>

        {/* 가입하기 버튼 */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F336A',
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 16,
  },
  form: {
    marginTop: 20,
    paddingHorizontal: 20, // <-- 가로 여백 추가
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    marginTop: 16,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  
  inputFull: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  checkButton: {
    backgroundColor: '#F7A938',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  checkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#F7A938',
    marginTop: 40,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
