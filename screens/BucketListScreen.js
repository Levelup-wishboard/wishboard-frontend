// screens/BucketListScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { getTagColor } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function BucketListScreen() {
  const navigation = useNavigation();
  const [bucketLists, setBucketLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBucketLists = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get('http://3.39.187.114:8080/api/bucketlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBucketLists(response.data);
    } catch (error) {
      console.error('버킷리스트 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchBucketLists);
    return unsubscribe;
  }, [navigation]);

  const handlePress = (item) => {
    navigation.navigate('BucketListDetailScreen', { bucketId: item.bucketId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#FFA726" style={{ marginTop: 50 }} />
        ) : (
          bucketLists.map((item) => (
            <TouchableOpacity
              key={item.bucketId}
              style={styles.card}
              onPress={() => handlePress(item)}
            >
              <Image
                source={item.image ? { uri: item.image } : require('../assets/images/default.png')}
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.dday}>{item.dday}</Text>
                <Text style={[styles.tag, { backgroundColor: getTagColor(item.category) }]}>
                  {item.category}
                </Text>
                <Text style={styles.title}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    padding: 15,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  textContainer: { flex: 1 },
  dday: { fontSize: 12, color: '#999' },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginVertical: 4,
    color: '#fff',
    fontSize: 12,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
});


