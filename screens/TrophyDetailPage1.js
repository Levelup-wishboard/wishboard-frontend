// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const CATEGORY_COLORS = {
//   '해보고싶다': '#93DEFF',
//   '배우고싶다': '#FF9393',
//   '되고싶다': '#93FFC9',
//   '갖고싶다': '#FFFF93',
//   '가보고싶다': '#CC93FF',
// };

// export default function TropyDetailPage1({ route, navigation }) {

//     const formatDate = (dateStr) => {
//       if (!dateStr) return '';
//       return new Date(dateStr).toLocaleDateString('ko-KR', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//       });
//     };

//     const { trophy } = route.params;
//     const [reason, setReason] = useState('');
//     const [promise, setPromise] = useState('');
//     const [imageUri, setImageUri] = useState(null);
//     const [loading, setLoading] = useState(true);
  
//     useEffect(() => {
//   const fetchDetail = async () => {
  
//     if (trophy.reason && trophy.resolution && trophy.image) {
//       setReason(trophy.reason);
//       setPromise(trophy.resolution);
//       setImageUri(
//         typeof trophy.image === 'string'
//           ? { uri: trophy.image }
//           : trophy.image
//       );
//       setLoading(false);
//       return;
//     }


//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token) {
//         Alert.alert("로그인 필요", "다시 로그인 해주세요.");
//         return;
//       }

//       const response = await axios.get(
//         `http://3.39.187.114:8080/trophy/detail/${trophy.bucketId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = response.data;
//       setReason(data.reason);
//       setPromise(data.resolution);
//       setImageUri({ uri: data.image });
//     } catch (error) {
//       console.error('버킷리스트 상세 조회 실패:', error);
//       Alert.alert('오류', '버킷리스트 상세 정보를 불러오는 데 실패했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchDetail();
// }, [trophy]);
  

//   return (
//   <View style={styles.wrapper}>
//     <View style={styles.header}>
//     {/* 상단 back 버튼 - 상단 고정 */}
//     <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//       <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
//     </TouchableOpacity>

//     {/* 아래는 수평 row */}
//     <View style={styles.headerContent}>
//       <Image source={require('../assets/images/trophy.png')} style={styles.trophy} />
      
//       <View style={styles.headerText}>
//       <View style={styles.badgeRow}>
//         <Text style={[styles.badge, { backgroundColor: CATEGORY_COLORS[trophy.category] || '#ccc' }]}>
//           {trophy.category}
//         </Text>
//         <Text style={styles.title}>{trophy.title}</Text>
//       </View>
//         <Text style={styles.date}>작성일: {formatDate(trophy.createdAt)}</Text>
//         <Text style={styles.date}>달성일: {formatDate(trophy.achievedAt)}</Text>
//       </View>

//        <TouchableOpacity
//                         onPress={() =>
//                           navigation.navigate('PostWrite', {
//                             communityType: "트로피", 
//                             defaultBoardTab: '트로피',
//                           })
//                         }
//                       >
//                         <Image source={require('../assets/images/share.png')} style={styles.share} />
//       </TouchableOpacity>


//     </View>
//   </View>

//       {/* 스크롤 콘텐츠 */}
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.dateLabel}>{formatDate(trophy.createdAt)}</Text>

//         <View style={styles.imageBox}>
//           {imageUri ? (
//             <Image source={imageUri} style={styles.image} />
//           ) : (
//             <Text>이미지가 없습니다</Text>
//           )}
//         </View>

//         <View style={styles.textBox}>
//           <Text style={styles.inputLabel}>이 꿈을 꾸게 된 이유</Text>
//           <Text style={styles.textContent}>{reason}</Text>

//           <Text style={styles.inputLabel}>포기하지 않기 위한 나만의 다짐</Text>
//           <Text style={styles.textContent}>{promise}</Text>
//         </View>
//       </ScrollView>


//       {/* 고정 버튼 */}
//       <TouchableOpacity style={styles.fixedButton} onPress={() => navigation.navigate('TropyDetailPage2', { trophy, index: 0 })}>
//         <Text style={styles.buttonText}>{'다음 페이지 >'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORY_COLORS = {
  '해보고싶다': '#93DEFF',
  '배우고싶다': '#FF9393',
  '되고싶다': '#93FFC9',
  '갖고싶다': '#FFFF93',
  '가보고싶다': '#CC93FF',
};

export default function TropyDetailPage1({ route, navigation }) {
  const { trophy } = route.params;

  const [detail, setDetail] = useState({
    reason: trophy.reason || '',
    vow: trophy.resolution || trophy.vow || '',
    image: trophy.image || null,
  });

  const [loading, setLoading] = useState(!(trophy.reason && trophy.resolution && trophy.image));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert("로그인 필요", "다시 로그인 해주세요.");
          return;
        }

        const response = await axios.get(
          `http://3.39.187.114:8080/trophy/detail/${trophy.bucketId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data;
        setDetail({
          reason: data.reason || '',
          vow: data.resolution || '',
          image: data.image ? { uri: data.image } : null,
        });
      } catch (error) {
        console.error('트로피 상세 조회 실패:', error);
        Alert.alert('오류', '트로피 상세 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (loading) fetchDetail();
  }, []);

  const imageSource =
    typeof detail.image === 'string'
      ? { uri: detail.image }
      : detail.image;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Image source={require('../assets/images/trophy.png')} style={styles.trophy} />

          <View style={styles.headerText}>
            <View style={styles.badgeRow}>
              <Text style={[styles.badge, { backgroundColor: CATEGORY_COLORS[trophy.category] || '#ccc' }]}>
                {trophy.category}
              </Text>
              <Text style={styles.title}>{trophy.title}</Text>
            </View>
            <Text style={styles.date}>작성일: {formatDate(trophy.createdAt)}</Text>
            <Text style={styles.date}>달성일: {formatDate(trophy.achievedAt)}</Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PostWrite', {
                communityType: '트로피',
                defaultBoardTab: '트로피',
              })
            }
          >
            <Image source={require('../assets/images/share.png')} style={styles.share} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.dateLabel}>{formatDate(trophy.createdAt)}</Text>

        <View style={styles.imageBox}>
          {imageSource ? (
            <Image source={{ uri: imageSource}} style={styles.image} />            
          ) : (
            <Text>이미지가 없습니다</Text>
          )}
        </View>

        <View style={styles.textBox}>
          <Text style={styles.inputLabel}>이 꿈을 꾸게 된 이유</Text>
          <Text style={styles.textContent}>{detail.reason}</Text>

          <Text style={styles.inputLabel}>포기하지 않기 위한 나만의 다짐</Text>
          <Text style={styles.textContent}>{detail.vow}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fixedButton}
        onPress={() => navigation.navigate('TropyDetailPage2', { trophy, index: 0 })}
      >
       { <Text style={styles.buttonText}>{'다음 페이지 >'}</Text> }
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
    paddingTop:30,
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
    // paddingVertical: 2,
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
    // fontWeight: 'bold',
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
    paddingHorizontal: 10,
    // paddingVertical: 3
    paddingTop:2
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:12
  },
  trophy: {
    width: 64,
    height: 64,
  },
  share: {
    width: 25,
    height: 25,
    marginTop: 20,
    marginRight: 5
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
