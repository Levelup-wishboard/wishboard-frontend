import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert  } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORY_COLORS = {
  '해보고싶다': '#93DEFF',
  '배우고싶다': '#FF9393',
  '되고싶다': '#93FFC9',
  '갖고싶다': '#FFFF93',
  '가보고싶다': '#CC93FF',
};

export default function TropyDetailPage2({ route, navigation }) {
  const { trophy, index } = route.params;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert("로그인 필요", "다시 로그인 해주세요.");
          return;
        }
        const response = await axios.get(`http://3.39.187.114:8080/trophy/logs/${trophy.bucketId}`, {  //본인 pc ip주소로 바꿔줘야함.
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLogs(response.data);
      } catch (error) {
        console.error("로그 데이터를 불러오지 못했습니다.", error);
        Alert.alert("오류", "로그 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading || !logs.length || !logs[index]) {
    return (
      <View style={styles.wrapper}>
        <Text style={{ padding: 20, textAlign: 'center' }}>로딩 중입니다...</Text>
      </View>
    );
  }
  const entry = logs[index];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <View style={styles.wrapper}>
      {/* 상단 영역 */}
      <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.navigate('TrophyScreen')}
        style={styles.backButton}
      >
        <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
      </TouchableOpacity>

        <View style={styles.headerContent}>
          <Image source={require('../assets/images/trophy.png')} style={styles.trophy} />

          <View style={styles.headerText}>
            <View style={styles.badgeRow}>
              <Text style={[styles.badge, { backgroundColor: CATEGORY_COLORS[entry.category] || '#ccc' }]}>{entry.category}</Text>
              <Text style={styles.title}>{entry.title}</Text>
            </View>
            <Text style={styles.date}>작성일: {formatDate(entry.bucketCreatedAt)}</Text>
            <Text style={styles.date}>달성일: {formatDate(entry.achievedAt)}</Text>
          </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('PostWrite', {
                      communityType: "트로피", 
                      defaultBoardTab: '트로피',
                    })
                  }
                >
                  <Image source={require('../assets/images/share.png')} style={styles.share} />
                </TouchableOpacity>
        </View>
      </View>

      {/* 본문 스크롤 */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.dateLabel}>{formatDate(entry.logCreatedAt)}</Text>

        <View style={styles.imageBox}>
          {entry.image ? (
            <Image source={{ uri: entry.image }} style={styles.image} />
          ) : (
            <Text>이미지가 없습니다</Text>
          )}
        </View>

        <Text style={styles.textContent}>{entry.content}</Text>
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
          disabled={index === logs.length - 1}
          style={[styles.navButton, index === logs.length - 1 && styles.disabled]}
          onPress={() => navigation.push('TropyDetailPage2', { trophy, index: index + 1 })}
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
    paddingTop:30,
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
    fontWeight: 'bold' 
    },
  date: { 
    color: '#fff', 
    fontSize: 12,
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
  share: { 
    width: 25, 
    height: 25, 
    marginTop: 20,
    marginRight: 5
},
});
