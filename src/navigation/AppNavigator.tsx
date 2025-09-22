import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// Version simplifiée sans navigation pour tester
const AppNavigator = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DashCam Auto</Text>
      <Text style={styles.subtitle}>Application lancée avec succès !</Text>
      <Text style={styles.info}>React Native 0.81.4 + react-native-camera</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#0f0',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#ccc',
  },
});

export default AppNavigator;
