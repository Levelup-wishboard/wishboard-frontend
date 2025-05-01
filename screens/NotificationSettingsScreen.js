import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function NotificationSettingsScreen() {
  const navigation = useNavigation();
  const [switches, setSwitches] = useState([
    { id: 1, title: '버스킹 해보기', tag: '해보고싶다', on: true },
    { id: 2, title: '버스킹 해보기', tag: '해보고싶다', on: true },
  ]);

  const toggleSwitch = (index) => {
    const updated = [...switches];
    updated[index].on = !updated[index].on;
    setSwitches(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FBA834" />
        </TouchableOpacity>
        <Text style={styles.headerText}>알림 설정</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {switches.map((item, index) => (
          <View key={item.id} style={styles.itemContainer}>
            <View>
              <View style={styles.labelRow}>
                <Text style={styles.tag}>D-{item.id}</Text>
                <Text style={styles.label}>{item.tag}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
            </View>

            <TouchableOpacity onPress={() => toggleSwitch(index)}>
              <Image
                source={
                  item.on
                    ? require('../assets/images/toggle1.png')
                    : require('../assets/images/toggle2.png')
                }
                style={styles.toggleImage}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#2F336A',
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  content: { paddingHorizontal: 0, paddingTop: 10 },

  itemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },

  tag: {
    backgroundColor: '#F0F0F0', // 연회색
    color: '#555',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '500',
  },

  label: {
    backgroundColor: '#FBA834', // 오렌지
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },

  toggleImage: {
    width: 48,
    height: 28,
    resizeMode: 'contain',
    marginTop: 8,
  },
});
