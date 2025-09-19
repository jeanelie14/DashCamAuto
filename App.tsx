import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {ThemeProvider} from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

const ErrorFallback: React.FC<{error: Error}> = ({error}) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTitle}>Erreur de l'application</Text>
    <Text style={styles.errorMessage}>{error.message}</Text>
    <Text style={styles.errorDetails}>
      Veuillez redémarrer l'application. Si le problème persiste, contactez le support.
    </Text>
  </View>
);

const App: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Gestionnaire d'erreurs global
    const errorHandler = (error: Error, isFatal: boolean) => {
      console.error('Erreur globale:', error);
      setError(error);
      setHasError(true);
      
      if (isFatal) {
        Alert.alert(
          'Erreur fatale',
          'L\'application a rencontré une erreur fatale et va se fermer.',
          [{text: 'OK', onPress: () => {}}]
        );
      }
    };

    // Enregistrer le gestionnaire d'erreurs
    if (global.ErrorUtils) {
      global.ErrorUtils.setGlobalHandler(errorHandler);
    }

    return () => {
      if (global.ErrorUtils) {
        global.ErrorUtils.setGlobalHandler(null);
      }
    };
  }, []);

  if (hasError && error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorDetails: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default App;
