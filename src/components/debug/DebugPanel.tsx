import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useThemedStyles} from '../../context/ThemeContext';
import {Button, Icon} from '../ui';
import LogViewer from './LogViewer';
import Logger from '../../utils/Logger';

interface DebugPanelProps {
  visible: boolean;
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({visible, onClose}) => {
  const styles = useThemedStyles(createStyles);
  const [showLogs, setShowLogs] = useState(false);

  if (!visible) return null;

  const handleTestError = () => {
    try {
      throw new Error('Test error for debugging');
    } catch (error) {
      Logger.error('DEBUG', 'Test error triggered', error);
    }
  };

  const handleTestWarning = () => {
    Logger.warn('DEBUG', 'Test warning message', {testData: 'This is a test warning'});
  };

  const handleTestInfo = () => {
    Logger.info('DEBUG', 'Test info message', {testData: 'This is a test info'});
  };

  const handleClearLogs = () => {
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
            Alert.alert('Succès', 'Logs effacés');
          },
        },
      ],
    );
  };

  const handleExportLogs = async () => {
    try {
      const logsText = Logger.exportLogsAsText();
      console.log('=== DASHCAM LOGS ===');
      console.log(logsText);
      console.log('=== END LOGS ===');
      Alert.alert('Succès', 'Logs exportés dans la console');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter les logs');
    }
  };

  const getLogStats = () => {
    const allLogs = Logger.getLogs();
    const errors = Logger.getErrors();
    const warnings = Logger.getLogsByLevel(2); // WARN
    const infos = Logger.getLogsByLevel(1); // INFO
    const debugs = Logger.getLogsByLevel(0); // DEBUG

    return {
      total: allLogs.length,
      errors: errors.length,
      warnings: warnings.length,
      infos: infos.length,
      debugs: debugs.length,
    };
  };

  const stats = getLogStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panneau de débogage</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Logs Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques des logs</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: '#EF4444'}]}>{stats.errors}</Text>
              <Text style={styles.statLabel}>Erreurs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: '#F59E0B'}]}>{stats.warnings}</Text>
              <Text style={styles.statLabel}>Avertissements</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: '#3B82F6'}]}>{stats.infos}</Text>
              <Text style={styles.statLabel}>Infos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: '#6B7280'}]}>{stats.debugs}</Text>
              <Text style={styles.statLabel}>Debug</Text>
            </View>
          </View>
        </View>

        {/* Test Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tests de logs</Text>
          <View style={styles.buttonRow}>
            <Button
              title="Test Erreur"
              onPress={handleTestError}
              variant="outline"
              style={[styles.testButton, {borderColor: '#EF4444'}]}
            />
            <Button
              title="Test Warning"
              onPress={handleTestWarning}
              variant="outline"
              style={[styles.testButton, {borderColor: '#F59E0B'}]}
            />
            <Button
              title="Test Info"
              onPress={handleTestInfo}
              variant="outline"
              style={[styles.testButton, {borderColor: '#3B82F6'}]}
            />
          </View>
        </View>

        {/* Log Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestion des logs</Text>
          <View style={styles.buttonRow}>
            <Button
              title="Voir les logs"
              onPress={() => setShowLogs(true)}
              style={styles.actionButton}
            />
            <Button
              title="Exporter"
              onPress={handleExportLogs}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Effacer"
              onPress={handleClearLogs}
              variant="outline"
              style={[styles.actionButton, {borderColor: '#EF4444'}]}
            />
          </View>
        </View>

        {/* System Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations système</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Plateforme: {require('react-native').Platform.OS}
            </Text>
            <Text style={styles.infoText}>
              Version: {require('react-native').Platform.Version}
            </Text>
            <Text style={styles.infoText}>
              Logs max: 1000
            </Text>
            <Text style={styles.infoText}>
              Niveau actuel: DEBUG
            </Text>
          </View>
        </View>
      </View>

      {/* Log Viewer Modal */}
      <LogViewer
        visible={showLogs}
        onClose={() => setShowLogs(false)}
      />
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
    content: {
      flex: 1,
      padding: theme.spacing[4],
    },
    section: {
      marginBottom: theme.spacing[6],
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing[3],
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing[1],
    },
    buttonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    testButton: {
      flex: 1,
      marginHorizontal: theme.spacing[1],
      marginBottom: theme.spacing[2],
    },
    actionButton: {
      flex: 1,
      marginHorizontal: theme.spacing[1],
      marginBottom: theme.spacing[2],
    },
    infoContainer: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
    },
    infoText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      marginBottom: theme.spacing[2],
    },
  });

export default DebugPanel;


