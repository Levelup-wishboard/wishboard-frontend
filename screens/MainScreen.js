import React, { useState } from 'react';
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
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';

export default function MainScreen() {
  const [started, setStarted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleNavigationStateChange = () => {
    // 네비게이션 상태 변경 시 처리할 로직 (필요 시 구현)
  };

  if (!started) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Image
            source={require('../assets/images/login.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>WISH{'\n'}BOARD</Text>
          <Text style={styles.subtitle}>당신의 꿈을 응원합니다</Text>

          <TouchableOpacity style={styles.button} onPress={() => setStarted(true)}>
            <Text style={styles.buttonText}>시작하기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!loggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Image
            source={require('../assets/images/login.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>WISHBOARD</Text>
          <Text style={styles.loginText}>로그인</Text>

          <View style={styles.inputBox}>
            <TextInput
              placeholder="아이디"
              placeholderTextColor="#999"
              style={styles.input}
            />
          </View>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="비밀번호"
              placeholderTextColor="#999"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={() => setLoggedIn(true)}>
            <Text style={styles.buttonText}>로그인하기</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.registerText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer onStateChange={handleNavigationStateChange}>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F336A',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  title: {
    color: '#F7A938',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 24,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#F7A938',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 32,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputBox: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    height: 40,
    color: '#000',
  },
  registerText: {
    marginTop: 16,
    color: '#ccc',
    fontSize: 14,
  },
});
