import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 상단 헤더 영역 */}
        <View style={styles.header}>
          <Text style={styles.title}>레벨업 님의 WISHBOARD</Text>
          <Text style={styles.subtitle}>한 걸음씩 쌓아가는 도전, 함께 이루어가요!</Text>

          {/* 트로피 영역 */}
          <View style={styles.trophySection}>
            <View style={styles.trophyTextWrapper}>
              <Text style={styles.trophyScore}>2</Text>
              <Text style={styles.trophyTotal}>/10</Text>
            </View>
            <Image
              source={require('../assets/images/trophy.png')}
              style={styles.trophyImage}
            />
          </View>
        </View>

        {/* 도전중인 버킷리스트 카드 리스트 placeholder */}
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>[도전중인 버킷리스트 카드 리스트 자리]</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#2F327D',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    color: '#FBA834',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 5,
  },
  trophySection: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  trophyTextWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  trophyScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  trophyTotal: {
    fontSize: 14,
    marginLeft: 4,
    color: '#ffffff',
  },
  trophyImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginTop: 4,
  },
  placeholder: {
    marginTop: 30,
    marginHorizontal: 20,
    height: 120,
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
  },
});
