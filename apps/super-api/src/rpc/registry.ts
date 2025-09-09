/**
 * RPC 方法注册中心
 * 统一管理所有 RPC 方法的注册、发现和调用
 */

import { METHOD_METADATA, PUBLIC_METHODS, ADMIN_METHODS } from './constants/methods';
import { RpcError, RpcErrors } from './constants/errors';
import { logger } from '@/utils/logger';
import { RpcContext } from '@/types/jsonrpc';


export type RpcHandler = (params: any[], context: RpcContext) => Promise<any>;

export interface RpcMethodDefinition {
  method: string;
  handler: RpcHandler;
  metadata?: {
    description?: string;
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
    deprecated?: boolean;
    version?: string;
  };
}

/**
 * RPC 方法注册中心
 */
export class RpcRegistry {
  private static instance: RpcRegistry;
  private methods: Map<string, RpcMethodDefinition> = new Map();
  
  private constructor() {}
  
  /**
   * 获取单例实例
   */
  static getInstance(): RpcRegistry {
    if (!RpcRegistry.instance) {
      RpcRegistry.instance = new RpcRegistry();
    }
    return RpcRegistry.instance;
  }
  
  /**
   * 注册方法
   */
  register(definition: RpcMethodDefinition): void {
    const { method, handler, metadata } = definition;
    
    if (this.methods.has(method)) {
      logger.warn(`方法 ${method} 已存在，将被覆盖`);
    }
    
    this.methods.set(method, {
      method,
      handler,
      metadata: {
        ...METHOD_METADATA[method],
        ...metadata,
      },
    });
    
    logger.debug(`注册 RPC 方法: ${method}`);
  }
  
  /**
   * 批量注册方法
   */
  registerBatch(definitions: RpcMethodDefinition[]): void {
    definitions.forEach(def => this.register(def));
  }
  
  /**
   * 注册服务类的所有方法
   */
  registerService(service: any, prefix: string): void {
    const prototype = Object.getPrototypeOf(service);
    const methodNames = Object.getOwnPropertyNames(prototype)
      .filter(name => name !== 'constructor' && typeof prototype[name] === 'function');
    
    methodNames.forEach(methodName => {
      const fullMethodName = `${prefix}.${methodName}`;
      
      this.register({
        method: fullMethodName,
        handler: async (params: any[], context: RpcContext) => {
          return service[methodName].apply(service, [...params, context]);
        },
      });
    });
  }
  
  /**
   * 获取方法定义
   */
  getMethod(method: string): RpcMethodDefinition | undefined {
    return this.methods.get(method);
  }
  
  /**
   * 检查方法是否存在
   */
  hasMethod(method: string): boolean {
    return this.methods.has(method);
  }
  
  /**
   * 检查方法是否需要认证
   */
  requiresAuth(method: string): boolean {
    return !PUBLIC_METHODS.has(method);
  }
  
  /**
   * 检查方法是否需要管理员权限
   */
  requiresAdmin(method: string): boolean {
    return ADMIN_METHODS.has(method);
  }
  
  /**
   * 调用方法
   */
  async invoke(method: string, params: any[], context: RpcContext): Promise<any> {
    const definition = this.methods.get(method);
    
    if (!definition) {
      throw RpcErrors.methodNotFound(method);
    }
    
    // 权限检查
    if (this.requiresAuth(method) && !context.session) {
      throw RpcErrors.unauthorized();
    }
    
    if (this.requiresAdmin(method) && context.user?.role !== 'admin') {
      throw RpcErrors.forbidden('Admin access required');
    }
    
    try {
      logger.debug(`调用 RPC 方法: ${method}`, { params: params.length });
      const result = await definition.handler(params, context);
      return result;
    } catch (error) {
      logger.error(`RPC 方法调用失败: ${method}`, error);
      
      if (error instanceof RpcError) {
        throw error;
      }
      
      throw RpcErrors.internalError(error);
    }
  }
  
  /**
   * 获取所有注册的方法
   */
  getAllMethods(): string[] {
    return Array.from(this.methods.keys());
  }
  
  /**
   * 获取方法元数据
   */
  getMethodsMetadata(): Record<string, any> {
    const metadata: Record<string, any> = {};
    
    this.methods.forEach((def, method) => {
      metadata[method] = {
        method,
        ...def.metadata,
      };
    });
    
    return metadata;
  }
  
  /**
   * 获取方法发现信息
   */
  getDiscoveryInfo() {
    const methods = this.getAllMethods();
    const publicMethods = methods.filter(m => !this.requiresAuth(m));
    const adminMethods = methods.filter(m => this.requiresAdmin(m));
    
    return {
      jsonrpc: '2.0',
      methods: methods.sort(),
      metadata: this.getMethodsMetadata(),
      statistics: {
        total: methods.length,
        public: publicMethods.length,
        authenticated: methods.length - publicMethods.length,
        admin: adminMethods.length,
      },
      server: {
        name: 'Babel Panel API',
        version: '1.0.0',
        protocol: 'JSON-RPC 2.0',
      },
    };
  }
  
  /**
   * 清空注册表
   */
  clear(): void {
    this.methods.clear();
    logger.info('RPC 注册表已清空');
  }
}

// 导出单例
export const rpcRegistry = RpcRegistry.getInstance();