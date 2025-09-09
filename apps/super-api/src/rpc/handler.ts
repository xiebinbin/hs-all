import { Context } from 'hono';
import { rpcRegistry } from './registry';
import { RpcError, RpcErrors } from './constants/errors';
import { logger } from '@/utils/logger';
import { JSONRPCRequest, RpcContext } from '@/types/jsonrpc';


/**
 * 主处理器 - 处理经过中间件验证的请求
 */
export async function rpcHandler(c: Context): Promise<Response> {
  try {
    // 获取经过中间件处理的请求数据
    const request: JSONRPCRequest = await c.req.json();
    
    // 创建上下文（用户信息由认证中间件设置）
    const context: RpcContext = {
      user: c.get('user'),
      session: c.get('session'),
    };
    
    // 检查方法是否存在
    if (!rpcRegistry.hasMethod(request.method)) {
      return c.json({
        jsonrpc: '2.0',
        id: request.id ?? null,
        error: RpcErrors.methodNotFound(request.method).toJSON(),
      });
    }
    
    // 调用方法
    const result = await rpcRegistry.invoke(
      request.method,
      request.params,
      context
    );
    
    // 返回成功响应
    return c.json({
      jsonrpc: '2.0',
      id: request.id ?? null,
      result,
    });
    
  } catch (error) {
    logger.error('RPC 方法调用失败:', error);
    
    // 构造错误响应
    if (error instanceof RpcError) {
      return c.json({
        jsonrpc: '2.0',
        id: null,
        error: error.toJSON(),
      });
    }
    
    // 未知错误
    return c.json({
      jsonrpc: '2.0',
      id: null,
      error: RpcErrors.internalError(error).toJSON(),
    });
  }
}