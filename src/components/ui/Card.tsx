import React from 'react';
import {View, ViewStyle, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

export interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  margin?: 'none' | 'sm' | 'md' | 'lg';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  pressable?: boolean;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'md',
  margin = 'none',
  borderRadius: borderRadiusVariant = 'md',
  pressable = false,
  style,
  ...props
}) => {
  const {colors, spacing, borderRadius, shadows} = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.surface,
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      elevated: {
        ...shadows.base,
      },
      outlined: {
        borderWidth: 1,
        borderColor: colors.border,
      },
      filled: {
        backgroundColor: colors.surfaceVariant,
      },
    };

    // Padding styles
    const paddingStyles: Record<string, ViewStyle> = {
      none: {},
      sm: {padding: spacing[3]},
      md: {padding: spacing[4]},
      lg: {padding: spacing[6]},
    };

    // Margin styles
    const marginStyles: Record<string, ViewStyle> = {
      none: {},
      sm: {margin: spacing[2]},
      md: {margin: spacing[4]},
      lg: {margin: spacing[6]},
    };

    // Border radius styles
    const borderRadiusStyles: Record<string, ViewStyle> = {
      none: {borderRadius: 0},
      sm: {borderRadius: borderRadius.sm},
      md: {borderRadius: borderRadius.md},
      lg: {borderRadius: borderRadius.lg},
      xl: {borderRadius: borderRadius.xl},
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...marginStyles[margin],
      ...borderRadiusStyles[borderRadiusVariant],
    };
  };

  if (pressable) {
    return (
      <TouchableOpacity style={[getCardStyle(), style]} activeOpacity={0.7} {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};
