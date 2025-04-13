// components/WriteButton.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function WriteButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <View style={styles.buttonContent}>
        <Ionicons name="pencil" size={20} color="#FBA834" style={styles.icon} />
        <Text style={styles.buttonText}>글쓰기</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',   // 화면 특정 위치에 고정
    bottom: 20,             // 화면 아래에서 20px 위로
    right: 20,              // 화면 오른쪽에서 20px 왼쪽으로
    backgroundColor: '#333A73',
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  buttonText: {
    color: '#FBA834',
    fontWeight: '600',
    fontSize: 16,
  },
});
