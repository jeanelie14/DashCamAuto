import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useThemedStyles} from '../../context/ThemeContext';

interface SettingsButtonProps {
  onPress: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({onPress}) => {
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚙️</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 60,
      right: 20,
      zIndex: 10,
    },
    iconContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 25,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    icon: {
      fontSize: 24,
      color: '#FFFFFF',
    },
  });

export default SettingsButton;
