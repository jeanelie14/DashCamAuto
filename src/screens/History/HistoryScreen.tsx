import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {Incident} from '../../store/slices/incidentSlice';

const HistoryScreen: React.FC = () => {
  const {incidents} = useSelector((state: RootState) => state.incident);
  const {theme} = useSelector((state: RootState) => state.settings);

  const renderIncident = ({item}: {item: Incident}) => (
    <TouchableOpacity style={styles.incidentItem}>
      <View style={styles.incidentHeader}>
        <Text style={styles.incidentType}>{item.type}</Text>
        <Text style={styles.incidentSeverity}>{item.severity}</Text>
      </View>
      <Text style={styles.incidentTime}>{new Date(item.timestamp).toLocaleString()}</Text>
      <Text style={styles.incidentLocation}>
        {item.location.address ||
          `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`}
      </Text>
      <View style={styles.incidentFooter}>
        <Text style={styles.incidentStatus}>{item.isUploaded ? 'Uploaded' : 'Local only'}</Text>
        {item.isProtected && <Text style={styles.protectedBadge}>Protected</Text>}
      </View>
    </TouchableOpacity>
  );

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Incident History</Text>
        <Text style={styles.subtitle}>
          {incidents.length} incident{incidents.length !== 1 ? 's' : ''} recorded
        </Text>
      </View>

      {incidents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No incidents recorded yet</Text>
          <Text style={styles.emptySubtext}>
            Incidents will appear here when detected or manually recorded
          </Text>
        </View>
      ) : (
        <FlatList
          data={incidents}
          renderItem={renderIncident}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (theme: 'light' | 'dark' | 'auto') => {
  const isDark = theme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#f5f5f5',
    },
    header: {
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#000000',
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#cccccc' : '#666666',
      marginTop: 5,
    },
    listContainer: {
      padding: 20,
    },
    incidentItem: {
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    incidentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    incidentType: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      textTransform: 'capitalize',
    },
    incidentSeverity: {
      fontSize: 14,
      fontWeight: '500',
      color: '#007AFF',
      textTransform: 'uppercase',
    },
    incidentTime: {
      fontSize: 14,
      color: isDark ? '#999999' : '#666666',
      marginBottom: 5,
    },
    incidentLocation: {
      fontSize: 14,
      color: isDark ? '#cccccc' : '#333333',
      marginBottom: 10,
    },
    incidentFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    incidentStatus: {
      fontSize: 12,
      color: isDark ? '#999999' : '#666666',
    },
    protectedBadge: {
      fontSize: 12,
      color: '#FF9500',
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 10,
    },
    emptySubtext: {
      fontSize: 16,
      color: isDark ? '#999999' : '#666666',
      textAlign: 'center',
      lineHeight: 24,
    },
  });
};

export default HistoryScreen;
