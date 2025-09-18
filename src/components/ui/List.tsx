import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {Icon} from './Icon';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightText?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  rightText,
  onPress,
  disabled = false,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const {colors, spacing, typography} = useTheme();

  const getContainerStyle = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTitleStyle = (): TextStyle => {
    return {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: colors.text,
      flex: 1,
    };
  };

  const getSubtitleStyle = (): TextStyle => {
    return {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      marginTop: spacing[1],
    };
  };

  const getRightTextStyle = (): TextStyle => {
    return {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      marginRight: spacing[2],
    };
  };

  const content = (
    <View style={[getContainerStyle(), style]}>
      {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

      <View style={styles.contentContainer}>
        <Text style={[getTitleStyle(), titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[getSubtitleStyle(), subtitleStyle]} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightText && <Text style={getRightTextStyle()}>{rightText}</Text>}
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        {onPress && !disabled && <Icon name="chevronRight" size={16} color={colors.textTertiary} />}
      </View>
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.touchableContainer}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export interface ListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const List: React.FC<ListProps> = ({children, style}) => {
  const {colors, borderRadius} = useTheme();

  return (
    <View
      style={[
        styles.listContainer,
        {
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    backgroundColor: 'transparent',
  },
  leftIconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIconContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    overflow: 'hidden',
  },
});
