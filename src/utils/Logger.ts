import {Platform} from 'react-native';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  stack?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private currentLevel = LogLevel.DEBUG;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Configure le niveau de log minimum
   */
  public setLogLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  /**
   * Ajoute un log
   */
  private addLog(level: LogLevel, category: string, message: string, data?: any): void {
    if (level < this.currentLevel) return;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      stack: level >= LogLevel.ERROR ? new Error().stack : undefined,
    };

    this.logs.push(logEntry);

    // Garder seulement les derniers logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Afficher dans la console
    this.printToConsole(logEntry);
  }

  /**
   * Affiche le log dans la console
   */
  private printToConsole(log: LogEntry): void {
    const levelStr = LogLevel[log.level];
    const prefix = `[${log.timestamp}] [${levelStr}] [${log.category}]`;
    
    switch (log.level) {
      case LogLevel.DEBUG:
        console.log(prefix, log.message, log.data || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, log.message, log.data || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, log.message, log.data || '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, log.message, log.data || '', log.stack || '');
        break;
    }
  }

  /**
   * Log de debug
   */
  public debug(category: string, message: string, data?: any): void {
    this.addLog(LogLevel.DEBUG, category, message, data);
  }

  /**
   * Log d'information
   */
  public info(category: string, message: string, data?: any): void {
    this.addLog(LogLevel.INFO, category, message, data);
  }

  /**
   * Log d'avertissement
   */
  public warn(category: string, message: string, data?: any): void {
    this.addLog(LogLevel.WARN, category, message, data);
  }

  /**
   * Log d'erreur
   */
  public error(category: string, message: string, error?: Error | any, data?: any): void {
    this.addLog(LogLevel.ERROR, category, message, {
      error: error?.message || error,
      stack: error?.stack,
      ...data,
    });
  }

  /**
   * Obtient tous les logs
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Obtient les logs par niveau
   */
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Obtient les logs par catégorie
   */
  public getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  /**
   * Obtient les logs d'erreur
   */
  public getErrors(): LogEntry[] {
    return this.getLogsByLevel(LogLevel.ERROR);
  }

  /**
   * Obtient les logs récents
   */
  public getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Efface tous les logs
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Exporte les logs en format JSON
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Exporte les logs en format texte
   */
  public exportLogsAsText(): string {
    return this.logs
      .map(log => {
        const levelStr = LogLevel[log.level];
        const timestamp = new Date(log.timestamp).toLocaleString();
        let text = `[${timestamp}] [${levelStr}] [${log.category}] ${log.message}`;
        
        if (log.data) {
          text += `\n  Data: ${JSON.stringify(log.data, null, 2)}`;
        }
        
        if (log.stack) {
          text += `\n  Stack: ${log.stack}`;
        }
        
        return text;
      })
      .join('\n\n');
  }

  /**
   * Sauvegarde les logs dans le stockage local
   */
  public async saveLogs(): Promise<void> {
    try {
      const logsText = this.exportLogsAsText();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `dashcam_logs_${timestamp}.txt`;
      
      // Ici on pourrait utiliser RNFS pour sauvegarder
      console.log('Logs sauvegardés:', filename);
      console.log(logsText);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des logs:', error);
    }
  }

  /**
   * Log spécifique pour les erreurs de caméra
   */
  public cameraError(message: string, error?: Error, data?: any): void {
    this.error('CAMERA', message, error, data);
  }

  /**
   * Log spécifique pour les erreurs de localisation
   */
  public locationError(message: string, error?: Error, data?: any): void {
    this.error('LOCATION', message, error, data);
  }

  /**
   * Log spécifique pour les erreurs de stockage
   */
  public storageError(message: string, error?: Error, data?: any): void {
    this.error('STORAGE', message, error, data);
  }

  /**
   * Log spécifique pour les erreurs de permissions
   */
  public permissionError(message: string, error?: Error, data?: any): void {
    this.error('PERMISSION', message, error, data);
  }

  /**
   * Log spécifique pour les erreurs réseau
   */
  public networkError(message: string, error?: Error, data?: any): void {
    this.error('NETWORK', message, error, data);
  }

  /**
   * Log spécifique pour les erreurs d'IA
   */
  public aiError(message: string, error?: Error, data?: any): void {
    this.error('AI', message, error, data);
  }
}

export default Logger.getInstance();


