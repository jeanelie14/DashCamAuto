import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  textStyle,
  style,
  ...props
}) => {
  const {colors, spacing, borderRadius, typography} = useTheme();

  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.base,
      borderWidth: 1,
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      sm: {
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        minHeight: 32,
      },
      md: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        minHeight: 40,
      },
      lg: {
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[4],
        minHeight: 48,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: isDisabled ? colors.neutral[300] : colors.primary,
        borderColor: isDisabled ? colors.neutral[300] : colors.primary,
      },
      secondary: {
        backgroundColor: isDisabled ? colors.neutral[300] : colors.secondary,
        borderColor: isDisabled ? colors.neutral[300] : colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: isDisabled ? colors.neutral[300] : colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      danger: {
        backgroundColor: isDisabled ? colors.neutral[300] : colors.error,
        borderColor: isDisabled ? colors.neutral[300] : colors.error,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && {width: '100%'}),
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: typography.fontWeight.medium,
      textAlign: 'center',
    };

    // Size text styles
    const sizeTextStyles: Record<string, TextStyle> = {
      sm: {
        fontSize: typography.fontSize.sm,
      },
      md: {
        fontSize: typography.fontSize.base,
      },
      lg: {
        fontSize: typography.fontSize.lg,
      },
    };

    // Variant text styles
    const variantTextStyles: Record<string, TextStyle> = {
      primary: {
        color: isDisabled ? colors.neutral[500] : colors.textInverse,
      },
      secondary: {
        color: isDisabled ? colors.neutral[500] : colors.textInverse,
      },
      outline: {
        color: isDisabled ? colors.neutral[500] : colors.primary,
      },
      ghost: {
        color: isDisabled ? colors.neutral[500] : colors.primary,
      },
      danger: {
        color: isDisabled ? colors.neutral[500] : colors.textInverse,
      },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textInverse}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};
