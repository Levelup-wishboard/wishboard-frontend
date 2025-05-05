// screens/CommunityCreateScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

export default function CommunityCreateScreen() {
  const navigation = useNavigation();

  const [communityTitle, setCommunityTitle] = useState('');
  const [communityDesc, setCommunityDesc] = useState('');

  const handleCreate = () => {
    if (!communityTitle.trim()) {
      Alert.alert('제목을 입력해 주세요');
      return;
    }

    // TODO: 서버 연동 전이므로 일단 콘솔에만 출력
    console.log('🏗️ 새 커뮤니티:', { communityTitle, communityDesc });

    Alert.alert('커뮤니티가 생성되었습니다!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header showBackButton leftContent="커뮤니티 개설" />

      <Text style={styles.label}>커뮤니티 이름 (대분류)</Text>
      <TextInput
        style={styles.input}
        placeholder="예) 익스트림 스포츠"
        value={communityTitle}
        onChangeText={setCommunityTitle}
      />

      <Text style={styles.label}>(선택) 설명</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="커뮤니티를 소개해 주세요"
        multiline
        value={communityDesc}
        onChangeText={setCommunityDesc}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
        <Text style={styles.submitText}>개설하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    width: '100%', 
    backgroundColor: '#FFF', 
    paddingHorizontal: 0, 
    paddingTop: 0, 
},
  label: { fontSize: 14, fontWeight: '600', marginTop: 24, marginBottom: 6, marginHorizontal: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#FFF',
    marginHorizontal: 16
  },
  submitBtn: {
    marginTop: 40,
    backgroundColor: '#0A185B',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16
  },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
