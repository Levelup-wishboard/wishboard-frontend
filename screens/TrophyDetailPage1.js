import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function TropyDetailPage1({ route, navigation }) {
  const { trophy } = route.params;

  // 예시: DB에서 가져온 값
  const reason = "여행 중 열기구를 보고 꼭 타보고 싶었어요.여행 중 열기구를 보고 꼭 타보고 싶었어요.";
  const promise = "끝까지 도전해서 꼭 달성할 거예요!끝까지 도전해서 꼭 달성할 거예요!끝까지 도전해서 꼭 달성할 거예요!끝까지 도전해서 꼭 달성할 거예요!끝까지 도전해서 꼭 달성할 거예요!끝까지 도전해서 꼭 달성할 거예요!";
  const imageUri = require('../assets/images/trophy.png');

  return (
  <View style={styles.wrapper}>
    <View style={styles.header}>
    {/* 상단 back 버튼 - 상단 고정 */}
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
    </TouchableOpacity>

    {/* 아래는 수평 row */}
    <View style={styles.headerContent}>
      <Image source={require('../assets/images/trophy.png')} style={styles.trophy} />
      
      <View style={styles.headerText}>
        <View style={styles.badgeRow}>
          <Text style={[styles.badge, { backgroundColor: trophy.color }]}>{trophy.category}</Text>
          <Text style={styles.title}>{trophy.title}</Text>
        </View>
        <Text style={styles.date}>작성일: {trophy.createdAt}</Text>
        <Text style={styles.date}>달성일: {trophy.targetDate}</Text>
      </View>

      <Image source={require('../assets/images/share.png')} style={styles.share} />
    </View>
  </View>

      {/* 스크롤 콘텐츠 */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.dateLabel}>{trophy.createdAt}</Text>

        <View style={styles.imageBox}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
        <View style={styles.textBox}>
          <Text style={styles.inputLabel}>이 꿈을 꾸게 된 이유</Text>
          <Text style={styles.textContent}>{reason}</Text>

          <Text style={styles.inputLabel}>포기하지 않기 위한 나만의 다짐</Text>
          <Text style={styles.textContent}>{promise}</Text>
        </View>
      </ScrollView>

      {/* 고정 버튼 */}
      <TouchableOpacity style={styles.fixedButton} onPress={() => navigation.navigate('TropyDetailPage2', { trophy, index: 0 })}>
        <Text style={styles.buttonText}>다음 페이지 ▶</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    height: 120
  },
  container: {
    padding: 20,
    paddingBottom: 80, // 고정 버튼과 겹치지 않게
  },
  textBox:{
    padding: 20,
  },
  header: {
    backgroundColor: '#333A73',
    padding: 15,
    flexDirection: 'column', // 상하 정렬
    gap: 10,
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    color: '#000',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 10,
    marginRight: 8,
    height: 15,
    width: 62,
  },
  title: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  date: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  imageBox: {
    width: 240,
    height: 220,
    backgroundColor: '#eee',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  image: {
    width: '100%',
    height: '100%', 
    resizeMode: 'contain'
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  textContent: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderColor:'#DADADA',
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 14,

  },
  fixedButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FBA834',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    width:100,
    height:25,
    paddingHorizontal: 15,
    paddingVertical: 3
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:10
  },
  trophy: {
    width: 64,
    height: 64,
  },
  share: {
    width: 20,
    height: 20,
    marginTop: 20
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
});
