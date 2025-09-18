import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {ThemeProvider} from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
