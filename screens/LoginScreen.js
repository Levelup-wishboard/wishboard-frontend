import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';

export default function LoginScreen({ setLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  

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

        <TouchableOpacity style={styles.loginButton} onPress={() => {navigation.navigate('Home', { screen: 'Mypage' })}}>
          <Text style={styles.buttonText}>로그인하기</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {navigation.navigate('Home', { screen: 'Register' })}}>
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
