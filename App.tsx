import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';

// Version ultra-simple pour tester - SANS dépendances externes
const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Text style={styles.title}>🎉 DashCam Auto 🎉</Text>
      <Text style={styles.subtitle}>Application lancée avec succès !</Text>
      <Text style={styles.info}>React Native 0.81.4 + react-native-camera</Text>
      <Text style={styles.status}>✅ Android 14 compatible</Text>
      <Text style={styles.debug}>Debug: Pas d'erreur JavaScript</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#0f0',
    marginBottom: 15,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    color: '#0ff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  debug: {
    fontSize: 14,
    color: '#ff0',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default App;
