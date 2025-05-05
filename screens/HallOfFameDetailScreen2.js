import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const diaryData = [
  {
    date: '2024.04.21',
    image: require('../assets/images/bungee.png'),
    message: '파이팅',
  },
  {
    date: '2024.04.22',
    image: require('../assets/images/bungee.png'),
    message: '오늘 잘 해냈다!',
  },
  {
    date: '2024.04.23',
    image: require('../assets/images/bungee.png'),
    message: '아자아자---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------!',
  },
];

export default function HallOfFameDetailScreen2({ route, navigation }) {
  const { origin, name, trophy, index = 0 } = route.params;
  const entry = diaryData[index];

  return (
    <View style={styles.wrapper}>
      {/* 상단 영역 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
            <Image source={require('../assets/images/trophy.png')} style={styles.trophy} />

            <View style={styles.headerText}>
                <Text style={styles.firstLine}>{name}님이 달성한 버킷리스트</Text>
                <View style={styles.badgeRow}>
                    <Text style={[styles.badge, { backgroundColor: trophy.color }]}>{trophy.category}</Text>
                    <Text style={styles.title}>{trophy.title}</Text>
                </View>
                <Text style={styles.date}>작성일: {trophy.createdAt}</Text>
                <View style={styles.bottomBox}>
                    <Text style={styles.date}>달성일: {trophy.targetDate}</Text>
                        {origin === 'ai' && (
                    <TouchableOpacity style={styles.aiButton} onPress={() => console.log('AI 버튼 눌림')}>
                        <Text style={styles.aiButtonText}>목표 추가하기</Text>
                      </TouchableOpacity>
                  )}
                </View>
            </View>
        </View>
      </View>

      {/* 본문 스크롤 */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.dateLabel}>{entry.date}</Text>

        <View style={styles.imageBox}>
          <Image source={entry.image} style={styles.image} />
        </View>

        <Text style={styles.textContent}>{entry.message}</Text>
      </ScrollView>

      {/* 하단 버튼 고정 */}
      <View style={styles.buttonRow}>
      <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.goBack()}
            >
            <Text style={styles.navButtonText}>{'< 이전 페이지'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={index === diaryData.length - 1}
          style={[styles.navButton, index === diaryData.length - 1 && styles.disabled]}
          onPress={() => navigation.push('HallOfFameDetailScreen2', { origin, name, trophy, index: index + 1 })}
        >
          <Text style={styles.navButtonText}>{'다음 페이지 >'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { 
    flex: 1, 
    backgroundColor: '#fff' 
},
  container: { 
    padding: 20, 
    paddingBottom: 100 
},
  header: {
    backgroundColor: '#333A73',
    padding: 15,
    flexDirection: 'column',
    gap: 10,
  },
headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
backButton: { 
    alignSelf: 'flex-start' 
},
  backIcon: { 
    width: 20, 
    height: 20 
},
  headerText: { 
    flex: 1, 
    marginLeft: 10 
},
  badgeRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 6 
},
badge: {
  color: '#000',
  // paddingVertical: 2,
  paddingHorizontal: 8,
  borderRadius: 8,
  fontSize: 10,
  marginRight: 8,
  height: 15,
  width: 62,
},
title: {
  fontSize: 14,
  color: '#fff',
  // fontWeight: 'bold',
},
  date: { 
    color: '#fff', 
    fontSize: 14,
     marginTop: 2 
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
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'contain' 
},
  textContent: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  navButton: {
    backgroundColor: '#FBA834',
    // paddingVertical: 8,
    paddingTop:2,
    paddingHorizontal: 10,
    borderRadius: 8,
    width:100,
    height:25,
  },
  navButtonText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  trophy: {
     width: 64, 
     height: 64 
    },
    firstLine: {
      color: 'white',
      fontSize: 14,
      marginBottom: 4,
    },
    aiButton: {
      backgroundColor: '#FBA834',
      marginLeft: 70,
      borderRadius: 8,
      alignItems: 'center',
      width:100,
      height:25,
      justifyContent: 'center',
      alignItems: 'center', 
    },
    aiButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    bottomBox:{
      flexDirection: 'row',
    },
});
