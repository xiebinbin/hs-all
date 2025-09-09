// 应用配置
export const appConfig = {
  // 服务配置
  port: Number(process.env.PORT || 3000),
  hostname: process.env.HOSTNAME || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // 数据库配置
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  // 认证配置
  auth: {
    secret: process.env.BETTER_AUTH_SECRET || '',
    url: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  },
  
  // CORS 配置
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    maxAge: Number(process.env.CORS_MAX_AGE || 600),
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
  },
  
  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
};

// 环境判断
export const isDevelopment = appConfig.nodeEnv === 'development';
export const isProduction = appConfig.nodeEnv === 'production';
export const isTesting = appConfig.nodeEnv === 'test';

// 验证必需的环境变量
export function validateConfig() {
  const required = [
    'DATABASE_URL',
    'BETTER_AUTH_SECRET',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`缺少必需的环境变量: ${missing.join(', ')}`);
  }
  
  // 验证 AUTH_SECRET 长度
  if (appConfig.auth.secret.length < 32) {
    throw new Error('BETTER_AUTH_SECRET 必须至少 32 个字符');
  }
}