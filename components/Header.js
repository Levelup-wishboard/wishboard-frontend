import React from 'react';
import { SafeAreaView, View, TouchableOpacity,Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = (props) => {
  const { leftContent } = props;
  // props.showBackButton이 undefined인 경우 false로 처리
  const showBackButton = props.showBackButton !== undefined ? props.showBackButton : false;
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {showBackButton && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back-outline" size={28} color="#FBA834" />
          </TouchableOpacity>
        )}
        {leftContent && (
          <View style={styles.leftContentContainer}>
            <Text style={styles.leftContentText}>{leftContent}</Text>
          </View>
        )}
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
  backButton: {
    padding: 8,
    marginLeft: -20,
  },
  leftContentContainer: {
    //width: 44, 
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  leftContentText: {
    color: '#FBA834',
    fontSize: 16,
  },
  placeholder: {
    width: 44,
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
