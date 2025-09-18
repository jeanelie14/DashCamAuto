import React from 'react';
import {Text, TextStyle} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

// Simple icon component using Unicode symbols
// In a real app, you'd use react-native-vector-icons or similar
export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

const iconMap: Record<string, string> = {
  // Navigation
  home: '🏠',
  camera: '📷',
  history: '📋',
  settings: '⚙️',

  // Actions
  play: '▶️',
  pause: '⏸️',
  stop: '⏹️',
  record: '🔴',
  recordStop: '⏹️',

  // UI
  chevronLeft: '◀️',
  chevronRight: '▶️',
  chevronUp: '▲',
  chevronDown: '▼',
  close: '✕',
  check: '✓',
  plus: '+',
  minus: '-',

  // Status
  success: '✅',
  warning: '⚠️',
  error: '❌',
  info: 'ℹ️',

  // Media
  video: '🎥',
  image: '🖼️',
  audio: '🔊',
  mute: '🔇',

  // Settings
  flash: '⚡',
  flashOff: '⚡',
  zoomIn: '🔍+',
  zoomOut: '🔍-',
  switch: '🔄',

  // Location
  location: '📍',
  gps: '🛰️',

  // Storage
  folder: '📁',
  download: '⬇️',
  upload: '⬆️',
  cloud: '☁️',

  // Time
  clock: '🕐',
  calendar: '📅',

  // Security
  lock: '🔒',
  unlock: '🔓',
  shield: '🛡️',

  // Communication
  share: '📤',
  export: '📤',
  import: '📥',

  // Arrows
  arrowLeft: '←',
  arrowRight: '→',
  arrowUp: '↑',
  arrowDown: '↓',

  // Other
  menu: '☰',
  more: '⋯',
  search: '🔍',
  filter: '🔽',
  sort: '⇅',
};

export const Icon: React.FC<IconProps> = ({name, size = 24, color, style}) => {
  const {colors} = useTheme();

  const iconStyle: TextStyle = {
    fontSize: size,
    color: color || colors.text,
    textAlign: 'center',
  };

  const iconSymbol = iconMap[name] || '?';

  return <Text style={[iconStyle, style]}>{iconSymbol}</Text>;
};

// Predefined icon components for common use cases
export const HomeIcon = (props: Omit<IconProps, 'name'>) => <Icon name="home" {...props} />;

export const CameraIcon = (props: Omit<IconProps, 'name'>) => <Icon name="camera" {...props} />;

export const HistoryIcon = (props: Omit<IconProps, 'name'>) => <Icon name="history" {...props} />;

export const SettingsIcon = (props: Omit<IconProps, 'name'>) => <Icon name="settings" {...props} />;

export const PlayIcon = (props: Omit<IconProps, 'name'>) => <Icon name="play" {...props} />;

export const PauseIcon = (props: Omit<IconProps, 'name'>) => <Icon name="pause" {...props} />;

export const RecordIcon = (props: Omit<IconProps, 'name'>) => <Icon name="record" {...props} />;

export const StopIcon = (props: Omit<IconProps, 'name'>) => <Icon name="stop" {...props} />;

export const ChevronLeftIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="chevronLeft" {...props} />
);

export const ChevronRightIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="chevronRight" {...props} />
);

export const CloseIcon = (props: Omit<IconProps, 'name'>) => <Icon name="close" {...props} />;

export const CheckIcon = (props: Omit<IconProps, 'name'>) => <Icon name="check" {...props} />;

export const PlusIcon = (props: Omit<IconProps, 'name'>) => <Icon name="plus" {...props} />;

export const MinusIcon = (props: Omit<IconProps, 'name'>) => <Icon name="minus" {...props} />;

export const SuccessIcon = (props: Omit<IconProps, 'name'>) => <Icon name="success" {...props} />;

export const WarningIcon = (props: Omit<IconProps, 'name'>) => <Icon name="warning" {...props} />;

export const ErrorIcon = (props: Omit<IconProps, 'name'>) => <Icon name="error" {...props} />;

export const InfoIcon = (props: Omit<IconProps, 'name'>) => <Icon name="info" {...props} />;
