import chalk from 'chalk';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

class Logger {
  private level: LogLevel = 'info';
  private isDebugMode = false;

  setLevel(level: LogLevel) {
    this.level = level;
    this.isDebugMode = level === 'debug';
  }

  private shouldLog(messageLevel: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      success: 4,
    };

    return levels[messageLevel] >= levels[this.level];
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    let coloredPrefix: string;
    switch (level) {
      case 'debug':
        coloredPrefix = chalk.gray(prefix);
        break;
      case 'info':
        coloredPrefix = chalk.blue(prefix);
        break;
      case 'warn':
        coloredPrefix = chalk.yellow(prefix);
        break;
      case 'error':
        coloredPrefix = chalk.red(prefix);
        break;
      case 'success':
        coloredPrefix = chalk.green(prefix);
        break;
      default:
        coloredPrefix = prefix;
    }

    return `${coloredPrefix} ${message}`;
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message), ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, ...args: any[]) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args);
    }
  }

  success(message: string, ...args: any[]) {
    if (this.shouldLog('success')) {
      console.log(this.formatMessage('success', message), ...args);
    }
  }

  // Special methods for CLI output
  log(message: string) {
    console.log(message);
  }

  print(message: string) {
    console.log(message);
  }

  clear() {
    console.clear();
  }

  // Progress indicator
  startSpinner(text: string) {
    if (this.isDebugMode) {
      this.debug(`Starting: ${text}`);
    }
    return text;
  }

  stopSpinner(text: string) {
    if (this.isDebugMode) {
      this.debug(`Completed: ${text}`);
    }
  }
}

export const logger = new Logger();
