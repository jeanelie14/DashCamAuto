import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
} from 'react-native';
import {useThemedStyles} from '../../context/ThemeContext';
import {Button, Icon} from '../ui';
import Logger, {LogLevel, LogEntry} from '../../utils/Logger';

interface LogViewerProps {
  visible: boolean;
  onClose: () => void;
}

const LogViewer: React.FC<LogViewerProps> = ({visible, onClose}) => {
  const styles = useThemedStyles(createStyles);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [searchText, setSearchText] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (visible) {
      refreshLogs();
    }
  }, [visible]);

  useEffect(() => {
    filterLogs();
  }, [logs, selectedLevel, searchText]);

  const refreshLogs = () => {
    const allLogs = Logger.getLogs();
    setLogs(allLogs);
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Filtrer par niveau
    if (selectedLevel !== 'ALL') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    // Filtrer par texte de recherche
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        log =>
          log.message.toLowerCase().includes(searchLower) ||
          log.category.toLowerCase().includes(searchLower),
      );
    }

    setFilteredLogs(filtered);
  };

  const clearLogs = () => {
    Alert.alert(
      'Effacer les logs',
      'Êtes-vous sûr de vouloir effacer tous les logs ?',
      [
        {text: 'Annuler', style: 'cancel'},
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: () => {
            Logger.clearLogs();
            setLogs([]);
            setFilteredLogs([]);
          },
        },
      ],
    );
  };

  const exportLogs = async () => {
    try {
      const logsText = Logger.exportLogsAsText();
      await Share.share({
        message: logsText,
        title: 'DashCamAuto Logs',
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter les logs');
    }
  };

  const saveLogs = async () => {
    try {
      await Logger.saveLogs();
      Alert.alert('Succès', 'Logs sauvegardés');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les logs');
    }
  };

  const getLevelColor = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG:
        return '#6B7280';
      case LogLevel.INFO:
        return '#3B82F6';
      case LogLevel.WARN:
        return '#F59E0B';
      case LogLevel.ERROR:
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getLevelIcon = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'bug';
      case LogLevel.INFO:
        return 'info';
      case LogLevel.WARN:
        return 'warning';
      case LogLevel.ERROR:
        return 'error';
      default:
        return 'help';
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Logs de l'application</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.filterRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher dans les logs..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={styles.searchInput.color}
          />
          <TouchableOpacity onPress={refreshLogs} style={styles.refreshButton}>
            <Icon name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelFilter}>
          {['ALL', 'DEBUG', 'INFO', 'WARN', 'ERROR'].map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                selectedLevel === level && styles.levelButtonActive,
              ]}
              onPress={() => setSelectedLevel(level as LogLevel | 'ALL')}>
              <Text
                style={[
                  styles.levelButtonText,
                  selectedLevel === level && styles.levelButtonTextActive,
                ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.actionButtons}>
          <Button
            title="Effacer"
            onPress={clearLogs}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Exporter"
            onPress={exportLogs}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Sauvegarder"
            onPress={saveLogs}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </View>

      {/* Logs List */}
      <ScrollView style={styles.logsContainer} showsVerticalScrollIndicator={false}>
        {filteredLogs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="fileText" size={48} color={styles.emptyIcon.color} />
            <Text style={styles.emptyText}>Aucun log trouvé</Text>
          </View>
        ) : (
          filteredLogs.map((log, index) => (
            <View key={index} style={styles.logEntry}>
              <View style={styles.logHeader}>
                <View style={styles.logLevelContainer}>
                  <Icon
                    name={getLevelIcon(log.level)}
                    size={16}
                    color={getLevelColor(log.level)}
                  />
                  <Text style={[styles.logLevel, {color: getLevelColor(log.level)}]}>
                    {LogLevel[log.level]}
                  </Text>
                </View>
                <Text style={styles.logTimestamp}>{formatTimestamp(log.timestamp)}</Text>
              </View>

              <View style={styles.logContent}>
                <Text style={styles.logCategory}>[{log.category}]</Text>
                <Text style={styles.logMessage}>{log.message}</Text>
                {log.data && (
                  <Text style={styles.logData}>
                    {JSON.stringify(log.data, null, 2)}
                  </Text>
                )}
                {log.stack && (
                  <Text style={styles.logStack}>{log.stack}</Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background,
      zIndex: 1000,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing[4],
      backgroundColor: theme.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: 'white',
    },
    closeButton: {
      padding: theme.spacing[2],
    },
    controls: {
      padding: theme.spacing[4],
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
    },
    searchInput: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing[3],
      marginRight: theme.spacing[2],
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
    refreshButton: {
      padding: theme.spacing[2],
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
    },
    levelFilter: {
      marginBottom: theme.spacing[3],
    },
    levelButton: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      marginRight: theme.spacing[2],
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    levelButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    levelButtonText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text,
    },
    levelButtonTextActive: {
      color: 'white',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    actionButton: {
      flex: 1,
      marginHorizontal: theme.spacing[1],
    },
    logsContainer: {
      flex: 1,
      padding: theme.spacing[2],
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing[8],
    },
    emptyIcon: {
      color: theme.colors.textSecondary,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.lg,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing[4],
    },
    logEntry: {
      marginBottom: theme.spacing[3],
      padding: theme.spacing[3],
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.border,
    },
    logHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[2],
    },
    logLevelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logLevel: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      marginLeft: theme.spacing[1],
    },
    logTimestamp: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
    },
    logContent: {
      flex: 1,
    },
    logCategory: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.primary,
      marginBottom: theme.spacing[1],
    },
    logMessage: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      marginBottom: theme.spacing[1],
    },
    logData: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      fontFamily: 'monospace',
      backgroundColor: theme.colors.background,
      padding: theme.spacing[2],
      borderRadius: theme.borderRadius.sm,
      marginTop: theme.spacing[1],
    },
    logStack: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.error,
      fontFamily: 'monospace',
      backgroundColor: theme.colors.background,
      padding: theme.spacing[2],
      borderRadius: theme.borderRadius.sm,
      marginTop: theme.spacing[1],
    },
  });

export default LogViewer;


