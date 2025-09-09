/**
 * RPC 方法定义中心
 * 所有的 RPC 方法都在这里统一定义和管理
 */

export enum RpcMethod {
  // ============ 系统服务 ============
  // 系统健康检查
  SYSTEM_HEALTH = 'system.health',
  // 获取系统信息
  SYSTEM_INFO = 'system.info',
  // ============ 认证服务 ============
  AUTH_LOGIN = 'auth.login',
  AUTH_LOGOUT = 'auth.logout',
  AUTH_GET_SESSION = 'auth.getSession',
  AUTH_REFRESH_TOKEN = 'auth.refreshToken',
  // 获取自己的信息
  AUTH_GET_ME = 'auth.getMe',
  // 更新自己的信息
  AUTH_UPDATE_ME = 'auth.updateMe',
  // 改变密码
  AUTH_CHANGE_PASSWORD = 'auth.changePassword',
  // ============ 用户服务 ============
  // 获取用户列表
  USER_LIST = 'user.list',
  // 获取用户详情
  USER_GET_BY_ID = 'user.getById',
  // 删除用户
  USER_DELETE = 'user.delete',
  // 获取用户统计信息
  USER_GET_STATS = 'user.getStats',
  // 创建用户
  USER_CREATE = 'user.create',
  // 更新用户
  USER_UPDATE = 'user.update',
  // 重置密码
  USER_RESET_PASSWORD = 'user.resetPassword',
  // ============ 医院服务 ============
  // 获取医院列表
  HOSPITAL_LIST = 'hospital.list',
  // 获取医院详情
  HOSPITAL_GET_BY_ID = 'hospital.getById',
  // 创建医院
  HOSPITAL_CREATE = 'hospital.create',
  // 更新医院
  HOSPITAL_UPDATE = 'hospital.update',
  // 删除医院
  HOSPITAL_DELETE = 'hospital.delete',

}
/**
 * 不需要认证的公开方法
 */
export const PUBLIC_METHODS = new Set<string>([
  RpcMethod.AUTH_LOGIN,
]);

/**
 * 方法元数据定义
 */
export interface MethodMetadata {
  name: string;
  description: string;
  requiresAuth: boolean;
  requiresAdmin?: boolean;
  deprecated?: boolean;
  version?: string;
}

/**
 * 所有方法的元数据
 */
export const METHOD_METADATA: Record<string, MethodMetadata> = {
  [RpcMethod.AUTH_LOGIN]: {
    name: RpcMethod.AUTH_LOGIN,
    description: '用户登录（支持邮箱和手机号）',
    requiresAuth: false,
  },
  [RpcMethod.AUTH_LOGOUT]: {
    name: RpcMethod.AUTH_LOGOUT,
    description: '用户登出',
    requiresAuth: true,
  },
  [RpcMethod.AUTH_GET_SESSION]: {
    name: RpcMethod.AUTH_GET_SESSION,
    description: '获取当前会话信息',
    requiresAuth: true,
  },
  [RpcMethod.AUTH_REFRESH_TOKEN]: {
    name: RpcMethod.AUTH_REFRESH_TOKEN,
    description: '刷新访问令牌',
    requiresAuth: false,
  },
  [RpcMethod.AUTH_GET_ME]: {
    name: RpcMethod.AUTH_GET_ME,
    description: '获取当前用户信息',
    requiresAuth: true,
  },
  [RpcMethod.AUTH_UPDATE_ME]: {
    name: RpcMethod.AUTH_UPDATE_ME,
    description: '更新当前用户信息',
    requiresAuth: true,
  },
  [RpcMethod.AUTH_CHANGE_PASSWORD]: {
    name: RpcMethod.AUTH_CHANGE_PASSWORD,
    description: '改变密码',
    requiresAuth: true,
  },
  [RpcMethod.USER_LIST]: {
    name: RpcMethod.USER_LIST,
    description: '获取用户列表',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [RpcMethod.USER_GET_BY_ID]: {
    name: RpcMethod.USER_GET_BY_ID,
    description: '获取用户详情',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [RpcMethod.USER_DELETE]: {
    name: RpcMethod.USER_DELETE,
    description: '删除用户',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [RpcMethod.USER_GET_STATS]: {
    name: RpcMethod.USER_GET_STATS,
    description: '获取用户统计信息',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [RpcMethod.USER_CREATE]: {
    name: RpcMethod.USER_CREATE,
    description: '创建用户',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [RpcMethod.USER_UPDATE]: {
    name: RpcMethod.USER_UPDATE,
    description: '更新用户',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [RpcMethod.USER_RESET_PASSWORD]: {
    name: RpcMethod.USER_RESET_PASSWORD,
    description: '重置密码',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [RpcMethod.HOSPITAL_LIST]: {
    name: RpcMethod.HOSPITAL_LIST,
    description: '获取医院列表',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [RpcMethod.HOSPITAL_GET_BY_ID]: {
    name: RpcMethod.HOSPITAL_GET_BY_ID,
    description: '获取医院详情',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [RpcMethod.HOSPITAL_CREATE]: {
    name: RpcMethod.HOSPITAL_CREATE,
    description: '创建医院',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [RpcMethod.HOSPITAL_UPDATE]: {
    name: RpcMethod.HOSPITAL_UPDATE,
    description: '更新医院',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [RpcMethod.HOSPITAL_DELETE]: {
    name: RpcMethod.HOSPITAL_DELETE,
    description: '删除医院',
    requiresAuth: true,
    requiresAdmin: true,
  },
};