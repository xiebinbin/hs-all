import { appConfig, isDevelopment } from '@/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };
  
  private currentLevel: LogLevel;
  
  constructor() {
    this.currentLevel = (appConfig.logging?.level as LogLevel) || 'info';
  }
  
  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.currentLevel];
  }
  
  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    
    if (isDevelopment) {
      // 开发环境使用彩色输出
      const colors: Record<LogLevel, string> = {
        debug: '\x1b[36m', // 青色
        info: '\x1b[32m',  // 绿色
        warn: '\x1b[33m',  // 黄色
        error: '\x1b[31m', // 红色
      };
      const reset = '\x1b[0m';
      const color = colors[level];
      
      return `${color}[${timestamp}] [${level.toUpperCase()}]${reset} ${message}`;
    }
    
    // 生产环境使用 JSON 格式
    const log = {
      timestamp,
      level,
      message,
      ...(data && { data }),
    };
    
    return JSON.stringify(log);
  }
  
  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, data));
      if (data && isDevelopment) {
        console.log(data);
      }
    }
  }
  
  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, data));
      if (data && isDevelopment) {
        console.log(data);
      }
    }
  }
  
  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, data));
      if (data && isDevelopment) {
        console.warn(data);
      }
    }
  }
  
  error(message: string, error?: any) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, error));
      if (error) {
        if (isDevelopment) {
          console.error(error);
        } else {
          // 生产环境记录错误堆栈
          const errorData = {
            message: error.message || error,
            stack: error.stack,
            ...(error.code && { code: error.code }),
          };
          console.error(JSON.stringify(errorData));
        }
      }
    }
  }
  
  // HTTP 请求日志
  request(method: string, path: string, statusCode?: number, duration?: number) {
    const message = `${method} ${path}${statusCode ? ` ${statusCode}` : ''}${duration ? ` ${duration}ms` : ''}`;
    
    if (statusCode && statusCode >= 400) {
      this.error(message);
    } else {
      this.info(message);
    }
  }
}

export const logger = new Logger();