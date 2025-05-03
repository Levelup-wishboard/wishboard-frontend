// screens/TrophyScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const Trophys = [
  {
    id: 1,
    category: '해보고싶다',
    color: '#93DEFF',
    title: '열기구 타기',
    createdAt: '2024.04.21',
    targetDate: '2025.02.14',
  },
  {
    id: 2,
    category: '배우고싶다',
    color: '#FF9393',
    title: '일본어 자격증따기',
    createdAt: '2024.01.17',
    targetDate: '2025.01.24',
  },{
    id: 3,
    category: '배우고싶다',
    color: '#FF9393',
    title: '일본어 자격증따기',
    createdAt: '2024.01.17',
    targetDate: '2025.01.24',
  },{
    id: 4,
    category: '배우고싶다',
    color: '#FF9393',
    title: '일본어 자격증따기',
    createdAt: '2024.01.17',
    targetDate: '2025.01.24',
  },{
    id: 5,
    category: '배우고싶다',
    color: '#FF9393',
    title: '일본어 자격증따기',
    createdAt: '2024.01.17',
    targetDate: '2025.01.24',
  },{
    id: 6,
    category: '배우고싶다',
    color: '#FF9393',
    title: '일본어 자격증따기',
    createdAt: '2024.01.17',
    targetDate: '2025.01.24',
  },{
    id: 7,
    category: '배우고싶다',
    color: '#FF9393',
    title: '일본어 자격증따기',
    createdAt: '2024.01.17',
    targetDate: '2025.01.24',
  },{
    id: 8,
    category: '배우고싶다',
    color: '#FF9393',
    title: '일본어 자격증따기',
    createdAt: '2024.01.17',
    targetDate: '2025.01.24',
  },
];

export default function TrophyScreen({ navigation }) {
  return (
    <View style={styles.container1}>
      {/* 상단 진행도 */}
      <View style={styles.topSection}>
        <View style={styles.box}>
            {/* DB에서 가져오기 */}
            <Text style={styles.progressText}>2/10</Text>  
            <Image
            source={require('../assets/images/trophy.png')}
            style={styles.trophy}
            />
        </View>
        <View style={styles.box}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HallOfFameScreen')}>
                <Image
                source={require('../assets/images/trophys.png')}
                style={styles.trophys}
                />
                <Text style={styles.buttonText }>
                  명예의 전당 보러가기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AIRecommend')}>
                <Image
                source={require('../assets/images/good.png')}
                style={styles.good}
                />
                <Text style={styles.buttonText}>버킷리스트 추천받기</Text>
            </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.container2}>
      {/* 트로피 리스트 Db에서 가져오기*/}
        {Trophys.map(Trophy => (
            <TouchableOpacity key={Trophy.id} style={styles.card} onPress={() => navigation.navigate('TrophyDetailPage1', { trophy: Trophy })}>
            <Image
                source={require('../assets/images/trophy.png')}
                style={styles.cardTrophy}
            />
            <View style={styles.cardContent}>
                {/* 세부페이지만들어야함함 */}
                <View style={styles.row}>
                  <Text style={[styles.badge, { backgroundColor: Trophy.color }]}>
                    {Trophy.category}
                  </Text>
                  <Text style={styles.title}>{Trophy.title}</Text>
                </View>
                <Text style={styles.date}>작성일: {Trophy.createdAt}</Text>
                <Text style={styles.date}>달성일: {Trophy.targetDate}</Text>
            </View>
            </TouchableOpacity>
        ))}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: 
  { flex: 1, 
    backgroundColor: '#333A73', 
    height: 174
  },
  box: 
  {alignItems: 'center'
  },
  container2: 
  { flex: 1, 
    backgroundColor: 'white'
  },
  topSection: 
  { alignItems: 'center', 
    marginBottom: 10, 
    marginTop: 10, 
    flexDirection: 'row', 
    paddingLeft:30
  },
  trophy: 
  { width: 84, 
    height: 84,
     marginBottom: 8 
  },
  progressText: 
  { textAlign: 'center', 
    width: 84, 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 3, 
    color: 'white'
  },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#434B8C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 10,
    width: 230,
    height: 62,
    marginLeft:30 
  },
  buttonText: 
  { color:'rgb(255, 255, 255)', 
    textAlign: 'center', 
    fontSize: 12, 
    marginLeft: 10
  },
  card: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'flex-start',
  },
  cardTrophy: 
  { width: 84, 
    height: 84, 
    marginRight: 12, 
    marginTop: 4 
  },
  cardContent: 
  { flex: 1 

  },
  badge: {
    color:'rgb(0, 0, 0)',
    // paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    fontSize: 10,
    height: 15,
    width:62,
    textAlign: 'center', 
    fontWeight: 'bold',
    marginTop:5
  },
  title: 
  { fontSize: 14, 
    // fontWeight: 'bold',
     marginBottom: 4, 
     marginLeft: 10
    },
  date: 
  { fontSize: 14,
    marginTop: 5

  },
  trophys:
  {width: 67, 
    height: 28
  },
  good: 
  {width: 44, 
  height: 44
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
});
