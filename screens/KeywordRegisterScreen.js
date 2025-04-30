import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

const STORAGE_KEY = '@alert_keywords';   // AsyncStorage key

export default function KeywordRegisterScreen() {
  const navigation = useNavigation();
  const { communityId } = useRoute().params || {};

  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState([]);

  /* ---------- 최초 로드 ---------- */
  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setKeywords(JSON.parse(raw));
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  /* ---------- 저장 ---------- */
  const saveKeywords = async (list) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setKeywords(list);
    } catch (e) {
      console.warn(e);
    }
  };

  const addKeyword = () => {
    const word = keyword.trim();
    if (!word) return;
    if (keywords.includes(word)) {
      alert('이미 등록된 키워드입니다.');
      return;
    }
    const next = [...keywords, word];
    saveKeywords(next);
    setKeyword('');
  };

  const removeKeyword = (word) => {
    saveKeywords(keywords.filter((k) => k !== word));
  };

  /* ---------- UI ---------- */
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header showBackButton leftContent="알림 키워드" />

      <View style={styles.container}>
        <Text style={styles.label}>새 키워드</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="예) 스카이다이빙"
            value={keyword}
            onChangeText={setKeyword}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addKeyword}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: 20 }]}>등록된 키워드</Text>
        <FlatList
          data={keywords}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.keywordItem}>
              <Text style={styles.keywordText}>{item}</Text>
              <TouchableOpacity onPress={() => removeKeyword(item)}>
                <Ionicons name="trash-outline" size={18} color="#C00" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: '#777', marginTop: 8 }}>
              아직 키워드가 없습니다.
            </Text>
          }
        />

        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.doneText}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ------------ 스타일 ------------ */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  addBtn: {
    marginLeft: 8,
    backgroundColor: '#FBA834',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keywordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  keywordText: { fontSize: 14, color: '#333' },
  doneBtn: {
    marginTop: 24,
    backgroundColor: '#0A185B',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
