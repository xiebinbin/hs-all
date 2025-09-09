import { Context, Next } from 'hono';
import { RpcErrors } from '@/rpc/constants/errors';
import { logger } from '@/utils/logger';

/**
 * RPC 参数处理中间件
 * 统一处理参数格式转换
 */
export async function rpcParamsMiddleware(c: Context, next: Next) {
  try {
    const data = await c.req.json();

    // 验证 JSON-RPC 格式
    if (!data.jsonrpc || data.jsonrpc !== '2.0') {
      return c.json({
        jsonrpc: '2.0',
        id: data.id || null,
        error: RpcErrors.invalidRequest('Invalid JSON-RPC version').toJSON(),
      }, 400);
    }

    if (!data.method) {
      return c.json({
        jsonrpc: '2.0',
        id: data.id || null,
        error: RpcErrors.invalidRequest('Method is required').toJSON(),
      }, 400);
    }

    // 参数标准化：将对象参数转换为数组
    if (data.params && typeof data.params === 'object' && !Array.isArray(data.params)) {
      data.params = Object.values(data.params);
    } else {
      data.params = [];
    }

    // 记录请求日志
    logger.debug(`RPC 请求: ${data.method}`, {
      id: data.id,
      paramsCount: data.params.length,
    });

    // 恢复请求数据供后续中间件使用
    c.req.json = () => Promise.resolve(data);

    return next();
  } catch (error) {
    logger.error('参数处理中间件错误:', error);

    // JSON 解析错误
    if (error instanceof SyntaxError) {
      return c.json({
        jsonrpc: '2.0',
        id: null,
        error: RpcErrors.parseError().toJSON(),
      }, 400);
    }

    return c.json({
      jsonrpc: '2.0',
      id: null,
      error: RpcErrors.internalError(error).toJSON(),
    }, 500);
  }
}