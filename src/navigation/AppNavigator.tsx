import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList, TabParamList} from '../types/navigation';
import {useTheme} from '../context/ThemeContext';
import {HomeIcon, CameraIcon, HistoryIcon, SettingsIcon} from '../components/ui';

// Import screens (we'll create these next)
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import CameraScreen from '../screens/Camera/CameraScreen';
import HomeCameraScreen from '../screens/Camera/HomeCameraScreen';
import HistoryScreen from '../screens/History/HistoryScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import PlaybackScreen from '../screens/Playback/PlaybackScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  const {colors} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none', // Masquer la barre de navigation
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeCameraScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => <CameraIcon size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({color, size}) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarLabel: 'Camera',
          tabBarIcon: ({color, size}) => <CameraIcon size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({color, size}) => <HistoryIcon size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color, size}) => <SettingsIcon size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="Playback"
          component={PlaybackScreen}
          options={{
            headerShown: true,
            title: 'Playback',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
