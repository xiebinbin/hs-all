import { Context, Next } from 'hono';
import { auth } from '@/lib/auth';
import { rpcRegistry } from '@/rpc/registry';
import { RpcErrors } from '@/rpc/constants/errors';
import { logger } from '@/utils/logger';

/**
 * RPC 认证中间件
 * 检查 RPC 方法是否需要认证，并验证用户身份
 */
export async function rpcAuthMiddleware(c: Context, next: Next) {
  try {
    const data = await c.req.json();
    const method = data.method;
    
    if (!method) {
      return c.json({
        jsonrpc: '2.0',
        id: data.id || null,
        error: RpcErrors.invalidRequest('Method is required').toJSON(),
      }, 400);
    }
    
    // 检查方法是否需要认证
    if (rpcRegistry.requiresAuth(method)) {
      const session = await auth.api.getSession({ 
        headers: c.req.raw.headers 
      });
      
      if (!session) {
        logger.warn(`未授权访问: ${method}`);
        return c.json({
          jsonrpc: '2.0',
          id: data.id || null,
          error: RpcErrors.unauthorized().toJSON(),
        }, 401);
      }
      
      // 检查管理员权限
      if (rpcRegistry.requiresAdmin(method) && session.user.role !== 'admin') {
        logger.warn(`权限不足: ${method}, 用户: ${session.user.id}`);
        return c.json({
          jsonrpc: '2.0',
          id: data.id || null,
          error: RpcErrors.forbidden('Admin access required').toJSON(),
        }, 403);
      }
      
      // 设置用户上下文
      c.set('user', session.user);
      c.set('session', session.session);
    }
    
    // 恢复请求数据供后续中间件使用
    c.req.json = () => Promise.resolve(data);
    
    return next();
  } catch (error) {
    logger.error('认证中间件错误:', error);
    return c.json({
      jsonrpc: '2.0',
      id: null,
      error: RpcErrors.internalError(error).toJSON(),
    }, 500);
  }
}