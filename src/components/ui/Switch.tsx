import React from 'react';
import {TouchableOpacity, StyleSheet, Animated, ViewStyle} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  style?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'md',
  color,
  style,
}) => {
  const {colors} = useTheme();
  const [animatedValue] = React.useState(new Animated.Value(value ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const getSizeConfig = () => {
    const configs = {
      sm: {
        width: 36,
        height: 20,
        thumbSize: 16,
        padding: 2,
      },
      md: {
        width: 44,
        height: 24,
        thumbSize: 20,
        padding: 2,
      },
      lg: {
        width: 52,
        height: 28,
        thumbSize: 24,
        padding: 2,
      },
    };
    return configs[size];
  };

  const sizeConfig = getSizeConfig();
  const switchColor = color || colors.primary;
  const isDisabled = disabled;

  const handlePress = () => {
    if (!isDisabled) {
      onValueChange(!value);
    }
  };

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [sizeConfig.padding, sizeConfig.width - sizeConfig.thumbSize - sizeConfig.padding],
  });

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.neutral[300], switchColor],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.track,
          {
            width: sizeConfig.width,
            height: sizeConfig.height,
            backgroundColor: trackColor,
            opacity: isDisabled ? 0.5 : 1,
          },
        ]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              width: sizeConfig.thumbSize,
              height: sizeConfig.thumbSize,
              transform: [{translateX: thumbTranslateX}],
              backgroundColor: colors.background,
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    borderRadius: 12,
    justifyContent: 'center',
  },
  thumb: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
