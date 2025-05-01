// screens/AIRecommend.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const bucketListData = [
  {
    id: '1',
    image: require('../assets/images/good.png'),
    title: '해외 열기구 페스티벌 참가하기',
    author: '나나',
    likes: 10,
    comments: 10,
    time: '18:30',
  },
  {
    id: '2',
    image: require('../assets/images/good.png'),
    title: '해외 열기구 페스티벌 참가하기',
    author: '나나',
    likes: 10,
    comments: 10,
    time: '18:30',
  },
];

const AIRecommend = ({ navigation }) => {
  const renderItem = ({ item }) => (
    // 이동페이지 수정해야함.
    <TouchableOpacity style={styles.card} onPress={() =>
      navigation.navigate('HallOfFameDetailScreen', {
        name: item.author,
        userId: item.id,
        postId: item.id, 
        origin: 'ai', 
      })
    }>
      <Image source={item.image} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>해보고싶다</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <View style={styles.metaInfo}>
          <FontAwesome name="thumbs-o-up" size={14} color="gray" />
          <Text style={styles.metaText}>{item.likes}</Text>
          <MaterialCommunityIcons name="comment-outline" size={14} color="gray" style={styles.metaIcon} />
          <Text style={styles.metaText}>{item.comments}</Text>
          <Text style={styles.metaText}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconBox}>
          <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          레벨업님, 한 걸음 더 나아갈까요?{'\n'}다음 버킷리스트를 추천드려요
        </Text>
      </View>

      <FlatList
        data={bucketListData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#333A73',
    paddingVertical: 20,
    paddingHorizontal: 15,
    paddingTop: 40, // status bar 고려
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIconBox: {
    marginRight: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  thumbnail: {
    width: 70,
    height: 70,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F3FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  tagText: {
    color: '#93DEFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: 'gray',
    marginHorizontal: 4,
  },
  metaIcon: {
    marginLeft: 8,
  },
});

export default AIRecommend;
