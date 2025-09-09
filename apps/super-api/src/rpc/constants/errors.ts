/**
 * JSON-RPC 2.0 标准错误码
 */
export enum RpcErrorCode {
  // 标准错误码
  PARSE_ERROR = -32700,
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,

  // 自定义错误码 (-32000 到 -32099)
  UNAUTHORIZED = -32001,
  FORBIDDEN = -32002,
  NOT_FOUND = -32003,
  VALIDATION_ERROR = -32004,
  RATE_LIMIT = -32005,
  SERVICE_UNAVAILABLE = -32006,
  TIMEOUT = -32007,
  CONFLICT = -32008,
  PRECONDITION_FAILED = -32009,
}

/**
 * RPC 错误类
 */
export class RpcError extends Error {
  constructor(
    public code: RpcErrorCode,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'RpcError';
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      ...(this.data && { data: this.data }),
    };
  }
}

/**
 * 错误工厂函数
 */
export const RpcErrors = {
  parseError: (data?: any) =>
    new RpcError(RpcErrorCode.PARSE_ERROR, 'Parse error', data),

  invalidRequest: (data?: any) =>
    new RpcError(RpcErrorCode.INVALID_REQUEST, 'Invalid Request', data),

  methodNotFound: (method: string) =>
    new RpcError(RpcErrorCode.METHOD_NOT_FOUND, `Method '${method}' not found`, { method }),

  invalidParams: (details?: any) =>
    new RpcError(RpcErrorCode.INVALID_PARAMS, 'Invalid params', details),

  internalError: (error?: any) =>
    new RpcError(
      RpcErrorCode.INTERNAL_ERROR,
      'Internal error',
      error instanceof Error ? error.message : error
    ),

  unauthorized: (message = 'Unauthorized') => new RpcError(RpcErrorCode.UNAUTHORIZED, message),

  forbidden: (message = 'Forbidden') =>
    new RpcError(RpcErrorCode.FORBIDDEN, message),

  notFound: (resource?: string) =>
    new RpcError(RpcErrorCode.NOT_FOUND, `${resource || 'Resource'} not found`),

  validationError: (errors: any) =>
    new RpcError(RpcErrorCode.VALIDATION_ERROR, 'Validation error', errors),

  rateLimit: (retryAfter?: number) =>
    new RpcError(RpcErrorCode.RATE_LIMIT, 'Rate limit exceeded', { retryAfter }),

  serviceUnavailable: (service?: string) =>
    new RpcError(RpcErrorCode.SERVICE_UNAVAILABLE, `Service ${service || ''} unavailable`),

  timeout: (operation?: string) =>
    new RpcError(RpcErrorCode.TIMEOUT, `Operation ${operation || ''} timed out`),

  conflict: (details?: any) =>
    new RpcError(RpcErrorCode.CONFLICT, 'Conflict', details),
};