import { Context, Next } from 'hono';
import { logger } from '@/utils/logger';

/**
 * 请求日志中间件
 */
export async function loggingMiddleware(c: Context, next: Next) {
  const start = Date.now();
  const path = c.req.path;
  const method = c.req.method;
  
  try {
    await next();
    
    const duration = Date.now() - start;
    const status = c.res.status;
    
    // 记录请求日志
    logger.request(method, path, status, duration);
    
    // 添加响应头
    c.header('X-Response-Time', `${duration}ms`);
    c.header('X-Request-ID', generateRequestId());
    
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`${method} ${path} 失败 (${duration}ms)`, error);
    throw error;
  }
}

/**
 * 生成请求 ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}