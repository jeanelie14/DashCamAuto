import React from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store/store';
import {
  setTheme,
  updateNotifications,
  updateStorage,
  updatePrivacy,
  updateAdvanced,
} from '../../store/slices/settingsSlice';
import {useThemedStyles} from '../../context/ThemeContext';
import {Button, Card, List, ListItem, Switch} from '../../components/ui';

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    dispatch(setTheme(theme));
  };

  const handleNotificationChange = (key: keyof typeof settings.notifications, value: boolean) => {
    dispatch(updateNotifications({[key]: value}));
  };

  const handleStorageChange = (key: keyof typeof settings.storage, value: any) => {
    dispatch(updateStorage({[key]: value}));
  };

  const handlePrivacyChange = (key: keyof typeof settings.privacy, value: boolean) => {
    dispatch(updatePrivacy({[key]: value}));
  };

  const handleAdvancedChange = (key: keyof typeof settings.advanced, value: any) => {
    dispatch(updateAdvanced({[key]: value}));
  };

  const styles = useThemedStyles(createStyles);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {/* Theme Settings */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Theme</Text>
            <View style={styles.themeButtons}>
              {(['light', 'dark', 'auto'] as const).map(theme => (
                <Button
                  key={theme}
                  title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                  variant={settings.theme === theme ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => handleThemeChange(theme)}
                />
              ))}
            </View>
          </View>
        </Card>

        {/* Notifications */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <List>
            <ListItem
              title="Enable Notifications"
              rightIcon={
                <Switch
                  value={settings.notifications.enabled}
                  onValueChange={value => handleNotificationChange('enabled', value)}
                />
              }
            />
            <ListItem
              title="Sound"
              rightIcon={
                <Switch
                  value={settings.notifications.sound}
                  onValueChange={value => handleNotificationChange('sound', value)}
                  disabled={!settings.notifications.enabled}
                />
              }
            />
            <ListItem
              title="Vibration"
              rightIcon={
                <Switch
                  value={settings.notifications.vibration}
                  onValueChange={value => handleNotificationChange('vibration', value)}
                  disabled={!settings.notifications.enabled}
                />
              }
            />
            <ListItem
              title="Incident Alerts"
              rightIcon={
                <Switch
                  value={settings.notifications.incidentAlerts}
                  onValueChange={value => handleNotificationChange('incidentAlerts', value)}
                  disabled={!settings.notifications.enabled}
                />
              }
            />
          </List>
        </Card>

        {/* Storage */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Max Storage: {settings.storage.maxSizeGB}GB</Text>
            <View style={styles.storageButtons}>
              {[1, 3, 5, 10].map(size => (
                <Button
                  key={size}
                  title={`${size}GB`}
                  variant={settings.storage.maxSizeGB === size ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => handleStorageChange('maxSizeGB', size)}
                />
              ))}
            </View>
          </View>
          <ListItem
            title="Auto Delete Old Files"
            rightIcon={
              <Switch
                value={settings.storage.autoDelete}
                onValueChange={value => handleStorageChange('autoDelete', value)}
              />
            }
          />
        </Card>

        {/* Privacy */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <List>
            <ListItem
              title="Location Tracking"
              rightIcon={
                <Switch
                  value={settings.privacy.locationTracking}
                  onValueChange={value => handlePrivacyChange('locationTracking', value)}
                />
              }
            />
            <ListItem
              title="Data Collection"
              rightIcon={
                <Switch
                  value={settings.privacy.dataCollection}
                  onValueChange={value => handlePrivacyChange('dataCollection', value)}
                />
              }
            />
            <ListItem
              title="Crash Reporting"
              rightIcon={
                <Switch
                  value={settings.privacy.crashReporting}
                  onValueChange={value => handlePrivacyChange('crashReporting', value)}
                />
              }
            />
          </List>
        </Card>

        {/* Advanced */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced</Text>
          <List>
            <ListItem
              title="Debug Mode"
              rightIcon={
                <Switch
                  value={settings.advanced.debugMode}
                  onValueChange={value => handleAdvancedChange('debugMode', value)}
                />
              }
            />
            <ListItem
              title="Performance Monitoring"
              rightIcon={
                <Switch
                  value={settings.advanced.performanceMonitoring}
                  onValueChange={value => handleAdvancedChange('performanceMonitoring', value)}
                />
              }
            />
          </List>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing[5],
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      textAlign: 'center',
      marginBottom: theme.spacing[8],
      color: theme.colors.text,
    },
    section: {
      marginBottom: theme.spacing[5],
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.semiBold,
      marginBottom: theme.spacing[4],
      color: theme.colors.text,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing[3],
      marginBottom: theme.spacing[2],
    },
    settingLabel: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      flex: 1,
    },
    themeButtons: {
      flexDirection: 'row',
      gap: theme.spacing[2],
    },
    storageButtons: {
      flexDirection: 'row',
      gap: theme.spacing[2],
      marginTop: theme.spacing[2],
    },
  });

export default SettingsScreen;
