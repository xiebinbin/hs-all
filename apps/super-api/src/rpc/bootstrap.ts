/**
 * RPC 服务启动器
 * 注册所有 RPC 方法到注册中心
 */

import { rpcRegistry } from './registry';
import { RpcMethod } from './constants/methods';
import { authService } from './services/auth';
import { userService } from './services/user';
import { logger } from '../utils/logger';

/**
 * 注册所有 RPC 服务
 */
export function bootstrapRpcServices() {
  logger.info('开始注册 RPC 服务...');
  
  // ============ 注册认证服务 ============
  rpcRegistry.register({
    method: RpcMethod.AUTH_LOGIN,
    handler: async (params) => authService.login(params[0], params[1]),
  });
  
  rpcRegistry.register({
    method: RpcMethod.AUTH_LOGOUT,
    handler: async (_, context) => authService.logout(context),
  });
  
  rpcRegistry.register({
    method: RpcMethod.AUTH_GET_SESSION,
    handler: async (_, context) => authService.getSession(context),
  });
  
  rpcRegistry.register({
    method: RpcMethod.AUTH_SEND_EMAIL_OTP,
    handler: async (params) => authService.sendEmailOTP(params[0]),
  });
  
  rpcRegistry.register({
    method: RpcMethod.AUTH_SEND_PHONE_OTP,
    handler: async (params) => authService.sendPhoneNumberOTP(params[0], params[1]),
  });
  
  rpcRegistry.register({
    method: RpcMethod.AUTH_REFRESH_TOKEN,
    handler: async (params) => authService.refreshToken(params[0]),
  });
  
  // ============ 注册系统服务 ============
  rpcRegistry.register({
    method: RpcMethod.SYSTEM_HEALTH,
    handler: async () => ({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    }),
  });
  
  rpcRegistry.register({
    method: RpcMethod.SYSTEM_INFO,
    handler: async () => ({
      name: 'Babel Panel API',
      version: '1.0.0',
      node: process.version,
      platform: process.platform,
      arch: process.arch,
    }),
  });
  
  // ============ 注册用户管理服务 ============
  rpcRegistry.register({
    method: RpcMethod.USER_CREATE,
    handler: async (params) => userService.createUser(params[0]),
  });

  rpcRegistry.register({
    method: RpcMethod.USER_UPDATE,
    handler: async (params) => userService.updateUser(params[0], params[1]),
  });

  rpcRegistry.register({
    method: RpcMethod.USER_RESET_PASSWORD,
    handler: async (params) => userService.resetPassword(params[0], params[1]),
  });

  rpcRegistry.register({
    method: RpcMethod.USER_GET_BY_ID,
    handler: async (params) => userService.getUserById(params[0]),
  });

  rpcRegistry.register({
    method: RpcMethod.USER_LIST,
    handler: async (params) => userService.getUserList(params[0] || {}),
  });

  // ============ 注册套餐服务 ============
  rpcRegistry.register({
    method: RpcMethod.PLAN_LIST,
    handler: async () => {
      // TODO: 实现套餐列表逻辑
      return {
        plans: [],
        total: 0,
      };
    },
  });
  
  const registeredMethods = rpcRegistry.getAllMethods();
  logger.info(`RPC 服务注册完成，共注册 ${registeredMethods.length} 个方法`);
  
  return registeredMethods;
}