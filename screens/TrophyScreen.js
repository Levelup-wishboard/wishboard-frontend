import axios from "axios";
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { TrophyContext } from '../context/TrophyContext';

const CATEGORY_COLORS = {
  '해보고싶다': '#93DEFF',
  '배우고싶다': '#FF9393',
  '되고싶다': '#93FFC9',
  '갖고싶다': '#FFFF93',
  '가보고싶다': '#CC93FF',
};

const TROPHY_IMAGES = {
  normal: require('../assets/images/trophy.png'),
  silver: require('../assets/images/silver_trophy.png'),
  bronze: require('../assets/images/bronze_trophy.png'),
  gold: require('../assets/images/gold_trophy.png'),
};

export default function TrophyScreen({ navigation }) {
  const isFocused = useIsFocused();
  const { customTrophies } = useContext(TrophyContext);
  const [serverTrophies, setServerTrophies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 날짜 포맷
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // API에서 서버 트로피만 가져오기
  useEffect(() => {
    const fetchServerTrophies = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert("로그인 필요", "다시 로그인 해주세요.");
          return;
        }
        const response = await axios.get(
          'http://3.39.187.114:8080/trophy/trophies',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServerTrophies(response.data || []);
      } catch (error) {
        console.error("트로피 데이터를 불러오지 못했습니다.", error);
        Alert.alert("오류", "트로피 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchServerTrophies();
    }
  }, [isFocused]);

  // 서버 트로피 + 커스텀 트로피 합치기
  const displayTrophies = React.useMemo(() => {
    const existingIds = new Set(serverTrophies.map(t => String(t.bucketId)));
    const filteredCustom = customTrophies.filter(
      ct => !existingIds.has(String(ct.bucketId))
    );
    const merged = [...serverTrophies, ...filteredCustom];
    // 달성일 내림차순 정렬
    return merged.sort((a, b) => new Date(b.achievedAt) - new Date(a.achievedAt));
  }, [serverTrophies, customTrophies]);

  return (
    <View style={styles.container1}>
      <View style={styles.topSection}>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.trophyText}>{displayTrophies.length}</Text>
            
          </View>
          <Image
            source={require('../assets/images/trophy.png')}
            style={styles.cardTrophy}
          />
        </View>
        <View style={styles.box}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HallOfFameScreen')}
          >
            <Image
              source={require('../assets/images/trophys.png')}
              style={styles.trophys}
            />
            <Text style={styles.buttonText}>명예의 전당 보러가기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AIRecommend')}
          >
            <Image source={require('../assets/images/good.png')} style={styles.good} />
            <Text style={styles.buttonText}>버킷리스트 추천받기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container2}>
        {displayTrophies.map((trophy) => (
          <TouchableOpacity
            key={trophy.bucketId}
            style={styles.card}
            onPress={() =>
  navigation.navigate('TrophyDetailPage1', {
    trophy: {
      ...trophy,
      reason: trophy.reason,
      resolution: trophy.vow, // 이름 맞춰줌
      image: trophy.image
    }
  })
}
          >
            <Image
              source={TROPHY_IMAGES[trophy.trophy] || TROPHY_IMAGES.normal}
              style={styles.cardTrophy}
            />
            <View style={styles.cardContent}>
              <View style={styles.row}>
                <Text
                  style={[ styles.badge, { backgroundColor: CATEGORY_COLORS[trophy.category] || '#ccc' } ]}
                >
                  {trophy.category}
                </Text>
                <Text style={styles.title}>{trophy.title}</Text>
              </View>
              <Text style={styles.date}>작성일: {formatDate(trophy.createdAt)}</Text>
              <Text style={styles.date}>달성일: {formatDate(trophy.achievedAt)}</Text>
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
    marginTop: 30, 
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
    marginLeft: 4
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
  trophyText: {
    fontSize: 30, fontWeight: 'bold', color: '#FBA834',
    marginBottom: 10
  },
  row: {
  flexDirection: 'row',
  alignItems: 'center', // 수직 정렬
  },

});
