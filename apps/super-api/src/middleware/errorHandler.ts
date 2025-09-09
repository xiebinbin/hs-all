import { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import { RpcError, RpcErrors } from '@/rpc/constants/errors';
import { logger } from '@/utils/logger';

/**
 * 全局错误处理器
 */
export function errorHandler(error: Error, c: Context) {
  logger.error('全局错误处理:', error);
  
  // 如果是 RPC 错误，直接返回
  if (error instanceof RpcError) {
    c.status(getHttpStatusFromRpcError(error));
    return c.json({
      jsonrpc: '2.0',
      id: null,
      error: error.toJSON(),
    });
  }
  
  // 其他错误作为内部错误处理
  c.status(500);
  return c.json({
    jsonrpc: '2.0',
    id: null,
    error: RpcErrors.internalError(error).toJSON(),
  });
}

/**
 * 将 RPC 错误码映射到 HTTP 状态码
 */
function getHttpStatusFromRpcError(error: RpcError): StatusCode {
  const codeMap: Record<number, StatusCode> = {
    [-32700]: 400, // Parse error
    [-32600]: 400, // Invalid Request
    [-32601]: 404, // Method not found
    [-32602]: 400, // Invalid params
    [-32603]: 500, // Internal error
    [-32001]: 401, // Unauthorized
    [-32002]: 403, // Forbidden
    [-32003]: 404, // Not found
    [-32004]: 422, // Validation error
    [-32005]: 429, // Rate limit
    [-32006]: 503, // Service unavailable
    [-32007]: 504, // Timeout
    [-32008]: 409, // Conflict
  };
  
  return (codeMap[error.code] || 500) as StatusCode;
}