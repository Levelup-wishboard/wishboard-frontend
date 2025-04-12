// components/Header.js
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Header({
  showBack = false,
  onBack,
  placeholder = '게시판을 입력해주세요',
  onSearch,
  onPressNotification,
  onPressProfile,
}) {
  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={onBack}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}

      <View style={styles.searchBox}>
        <Icon name="search" size={20} color="#888" />
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
      </View>

      <TouchableOpacity style={styles.icon} onPress={onPressNotification}>
        <Icon name="notifications-none" size={24} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={onPressProfile}>
        <Icon name="person-outline" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 36,
  },
  input: {
    flex: 1,
    marginLeft: 4,
    fontSize: 14,
  },
  icon: {
    marginLeft: 12,
  },
});
