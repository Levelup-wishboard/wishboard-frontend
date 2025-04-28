import React from 'react';
import { SafeAreaView, View, TouchableOpacity,Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({
  leftContent,
  showBackButton = false,
  showBookmark = false,
  isBookmarked = false,
  onBookmarkPress = () => {}
}) => {

  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* 왼쪽: 뒤로가기버튼 */}
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back-outline" size={28} color="#FBA834" />
            </TouchableOpacity>
          )}
          {leftContent ? (
            <Text style = {styles.leftContentText}>{leftContent}</Text>
          ) : (
            !showBackButton && <View style={styles.placeholder}/>
          )}
        </View>

        {/* 가운데: 북마크 아이콘 (커뮤니티 페이지용) */}
        {showBookmark && (
          <TouchableOpacity onPress={onBookmarkPress} style={styles.bookmarkButton}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color="#FBA834"
            />
          </TouchableOpacity>
        )}
        
        {/* 오른쪽: 알림, 마이페이지 버튼 */}
        <View style={styles.rightContainer}>
          <Ionicons name="notifications-outline" size={28} color="#FBA834" style={styles.icon} />
          <Ionicons name="person-outline" size={28} color="#FBA834" style={styles.icon} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#333A73',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#333A73',
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -20,
  },
  leftContentContainer: {
    width: 44, 
    justifyContent: 'center',
  },
  leftContentText: {
    color: '#FBA834',
    fontSize: 16,
  },
  placeholder: {
    width: 44,
  },
  bookmarkButton: {
    padding: 8,
    marginHorizontal: 8,
    marginLeft: -60,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
});

export default Header;