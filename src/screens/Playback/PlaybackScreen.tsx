import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// Version simplifiée pour éviter les erreurs de dépendances
const PlaybackScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Playback Screen</Text>
      <Text style={styles.subtitle}>Écran de lecture vidéo</Text>
      <Text style={styles.info}>Fonctionnalités à implémenter</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#0f0',
    marginBottom: 15,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
});

export default PlaybackScreen;
