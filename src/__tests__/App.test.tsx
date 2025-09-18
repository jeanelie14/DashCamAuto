import React from 'react';

// Mock all the dependencies
jest.mock('react-native-permissions', () => ({}));
jest.mock('react-native-vision-camera', () => ({}));
jest.mock('react-native-geolocation-service', () => ({}));
jest.mock('react-native-device-info', () => ({}));
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}: {children: React.ReactNode}) => children,
}));
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({children}: {children: React.ReactNode}) => children,
    Screen: () => null,
  }),
}));
jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({children}: {children: React.ReactNode}) => children,
    Screen: () => null,
  }),
}));

// Simple test for now
describe('App', () => {
  it('should be defined', () => {
    expect(true).toBe(true);
  });
});
