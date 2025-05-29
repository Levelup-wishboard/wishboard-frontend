import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AlamScreen({ navigation }) {
  const notifications = [
    { id: 1, type: 'deadline', text: 'D-7 스카이다이빙 하기', subText: '마감일이 7일 남았습니다' },
    { id: 2, type: 'like', text: '수룡이님이 회원님의 게시글에 좋아요를 눌렀습니다' },
    { id: 3, type: 'comment', text: '수룡이님이 회원님의 게시글에 댓글을 달았습니다' },
    { id: 4, type: 'deadline', text: 'D-1 스카이다이빙 하기', subText: '마감일이 1일 남았습니다' },
    { id: 5, type: 'deadline', text: 'D-30 스카이다이빙 하기', subText: '마감일이 30일 남았습니다' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FBA834" />
        </TouchableOpacity>
        <Text style={styles.headerText}>알림</Text>
        <View style={{ width: 28 }} /> {/* for right alignment */}
      </View>
    

      {/* Body */}
      <ScrollView contentContainerStyle={styles.content}>
        {notifications.map((item) => (
          <View key={item.id} style={styles.card}>
            {item.type === 'deadline' ? (
              <View style={styles.deadlineBox}>
                <Ionicons name="notifications" size={24} color="#FBA834" style={{ marginRight: 12 }} />
                <View>
                  <Text style={styles.deadlineText}>{item.text}</Text>
                  <Text style={styles.subText}>{item.subText}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.textBox}>
                <Text style={styles.text}>{item.text}</Text>
                <TouchableOpacity>
                  <Text style={styles.link}>바로가기</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
      backgroundColor: '#2F336A',
      paddingTop: 48,
      paddingBottom: 16,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerText: {
      color: '#FBA834',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 12,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 60,
    },
    card: {
      backgroundColor: '#2F336A',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    deadlineBox: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    deadlineText: {
      fontWeight: 'bold',
      color: '#FBA834',
      fontSize: 14,
      marginBottom: 4,
    },
    subText: {
      color: '#fff',
      fontSize: 12,
    },
    text: {
      color: '#FBA834',
      fontSize: 13,
      flex: 1,
    },
    linkButton: {
      marginTop: 10,
      alignItems: 'flex-end',
    },
    link: {
      color: '#FBA834',
      fontSize: 12,
    },
  });