import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert
} from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
  
      const response = await axios.post(
<<<<<<< HEAD
        'http://3.39.187.114:8080/login',  //본인 pc ip주소로 바꿔줘야함.
=======
        'http://192.168.0.41:8080/login',  //본인 pc ip주소로 바꿔줘야함.
>>>>>>> b8ce1280b644c845139b3ddc4d8a1691cd77dfab
        formData.toString(), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
<<<<<<< HEAD
      
=======

>>>>>>> b8ce1280b644c845139b3ddc4d8a1691cd77dfab
      const token = response.data.token;
      await AsyncStorage.setItem('accessToken', token);

      navigation.replace('AppTabs', {
        screen: 'mypage',
        params: { screen: 'MyPageHome' }
      });

    } catch (error) {
      console.error('로그인 실패:', error);
      Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
    }
  };

<<<<<<< HEAD


=======
>>>>>>> b8ce1280b644c845139b3ddc4d8a1691cd77dfab
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.centerContent}>
        <Image
          source={require('../assets/images/login.png')} // 로고 이미지
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>WISHBOARD</Text>
        <Text style={styles.subtitle}>로그인</Text>

        <View style={styles.inputBox}>
          <TextInput
            placeholder="아이디"
            placeholderTextColor="#999"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputBox}>
          <TextInput
            placeholder="비밀번호"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인하기</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
      <Text style={styles.registerText}>회원가입</Text>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F7A938',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 24,
  },
  inputBox: {
    width: '80%', // 기존 100% → 80% 로 변경
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    fontSize: 16,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#F7A938',
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  registerText: {
    color: '#ccc',
    marginTop: 16,
    fontSize: 14,
  },
});
