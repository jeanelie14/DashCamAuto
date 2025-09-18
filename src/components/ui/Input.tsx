import React, {useState, forwardRef} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconPress,
      variant = 'outlined',
      size = 'md',
      fullWidth = false,
      containerStyle,
      labelStyle,
      inputStyle,
      style,
      ...props
    },
    ref,
  ) => {
    const {colors, spacing, borderRadius, typography} = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const hasError = !!error;
    const hasHelperText = !!helperText || !!error;

    const getContainerStyle = (): ViewStyle => {
      const baseStyle: ViewStyle = {
        flexDirection: 'column',
      };

      // Size styles
      const sizeStyles: Record<string, ViewStyle> = {
        sm: {marginBottom: spacing[2]},
        md: {marginBottom: spacing[3]},
        lg: {marginBottom: spacing[4]},
      };

      return {
        ...baseStyle,
        ...sizeStyles[size],
        ...(fullWidth && {width: '100%'}),
      };
    };

    const getInputContainerStyle = (): ViewStyle => {
      const baseStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
      };

      // Variant styles
      const variantStyles: Record<string, ViewStyle> = {
        outlined: {
          borderRadius: borderRadius.base,
          borderColor: hasError ? colors.error : isFocused ? colors.primary : colors.border,
          backgroundColor: colors.background,
        },
        filled: {
          borderRadius: borderRadius.base,
          borderColor: 'transparent',
          backgroundColor: colors.surfaceVariant,
          borderBottomWidth: 2,
          borderBottomColor: hasError ? colors.error : isFocused ? colors.primary : colors.border,
        },
        underlined: {
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderBottomWidth: 2,
          borderBottomColor: hasError ? colors.error : isFocused ? colors.primary : colors.border,
          backgroundColor: 'transparent',
          borderRadius: 0,
        },
      };

      // Size styles
      const sizeStyles: Record<string, ViewStyle> = {
        sm: {
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2],
          minHeight: 36,
        },
        md: {
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          minHeight: 44,
        },
        lg: {
          paddingHorizontal: spacing[5],
          paddingVertical: spacing[4],
          minHeight: 52,
        },
      };

      return {
        ...baseStyle,
        ...variantStyles[variant],
        ...sizeStyles[size],
      };
    };

    const getInputStyle = (): TextStyle => {
      const baseStyle: TextStyle = {
        flex: 1,
        fontSize: typography.fontSize.base,
        color: colors.text,
      };

      // Size styles
      const sizeStyles: Record<string, TextStyle> = {
        sm: {fontSize: typography.fontSize.sm},
        md: {fontSize: typography.fontSize.base},
        lg: {fontSize: typography.fontSize.lg},
      };

      return {
        ...baseStyle,
        ...sizeStyles[size],
      };
    };

    const getLabelStyle = (): TextStyle => {
      return {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: hasError ? colors.error : colors.textSecondary,
        marginBottom: spacing[1],
      };
    };

    const getHelperTextStyle = (): TextStyle => {
      return {
        fontSize: typography.fontSize.xs,
        color: hasError ? colors.error : colors.textTertiary,
        marginTop: spacing[1],
      };
    };

    return (
      <View style={[getContainerStyle(), containerStyle]}>
        {label && <Text style={[getLabelStyle(), labelStyle]}>{label}</Text>}

        <View style={getInputContainerStyle()}>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={[getInputStyle(), inputStyle, style]}
            placeholderTextColor={colors.textTertiary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {rightIcon && (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={onRightIconPress}
              disabled={!onRightIconPress}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

        {hasHelperText && <Text style={getHelperTextStyle()}>{error || helperText}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  iconContainer: {
    marginHorizontal: 8,
  },
});
