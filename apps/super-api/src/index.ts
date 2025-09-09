import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from '@/lib/auth';
import { appConfig, validateConfig } from './config';
import { logger } from './utils/logger';

// RPC 相关导入
import { rpcHandler } from './rpc/handler';
import { rpcRegistry } from './rpc/registry';
import { bootstrapRpcServices } from './rpc/bootstrap';

// 中间件导入
import { loggingMiddleware } from './middleware/logging';
import { rpcAuthMiddleware } from './middleware/auth';
import { rpcParamsMiddleware } from './middleware/params';
import { errorHandler } from './middleware/errorHandler';

// 验证配置
try {
  validateConfig();
  logger.info('✅ 配置验证成功');
} catch (error) {
  logger.error('❌ 配置验证失败:', error);
  process.exit(1);
}

// 初始化 RPC 服务
bootstrapRpcServices();

// 创建应用实例
const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null,
    session: typeof auth.$Infer.Session.session | null,
  }
}>();

// 全局中间件
app.use('*', loggingMiddleware);

// 错误处理
app.onError(errorHandler);

// ============ Better Auth 路由 ============
app.on(['POST', 'GET'], '/api/auth/*',
  cors(appConfig.cors),
  (c) => auth.handler(c.req.raw)
);

// ============ JSON-RPC 核心路由 ============

/**
 * JSON-RPC 主处理器
 * 处理单个请求
 */
app.post('/json-rpc',
  rpcParamsMiddleware,    // 参数验证和标准化
  rpcAuthMiddleware,      // 认证检查
  rpcHandler              // RPC 处理
);

/**
 * RPC 方法发现接口
 * 返回所有可用的方法信息
 */
app.get('/json-rpc', (c) => {
  const discoveryInfo = rpcRegistry.getDiscoveryInfo();
  return c.json(discoveryInfo);
});

// ============ 系统路由 ============

/**
 * 健康检查接口
 */
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: appConfig.nodeEnv,
    rpc: {
      methods: rpcRegistry.getAllMethods().length,
    },
  });
});

/**
 * API 信息接口
 */
app.get('/', (c) => {
  return c.json({
    name: 'Babel Panel API',
    version: '1.0.0',
    description: 'Enterprise-grade JSON-RPC 2.0 API Server',
    environment: appConfig.nodeEnv,
    features: [
      'JSON-RPC 2.0 Protocol',
      'Type-safe Method Registry',
      'Enterprise Authentication',
      'Batch Request Support',
      'Real-time Logging',
      'Health Monitoring',
    ],
    endpoints: {
      rpc: '/json-rpc',
      discovery: 'GET /json-rpc',
      health: '/health',
      auth: '/api/auth/*',
    },
    documentation: {
      methods: rpcRegistry.getAllMethods().length,
      public_methods: rpcRegistry.getAllMethods()
        .filter(method => !rpcRegistry.requiresAuth(method)).length,
      admin_methods: rpcRegistry.getAllMethods()
        .filter(method => rpcRegistry.requiresAdmin(method)).length,
    },
  });
});

/**
 * 404 处理
 */
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    available_endpoints: [
      'POST /json-rpc - Main RPC endpoint',
      'GET /json-rpc - Method discovery',
      'GET /health - Health check',
      'GET / - API information',
    ],
  }, 404);
});

// ============ 服务器配置 ============
const server = {
  hostname: appConfig.hostname,
  port: appConfig.port,
  fetch: app.fetch,
};

// 启动日志
logger.info(`🚀 Babel Panel API 服务器启动`);
logger.info(`📍 地址: http://${appConfig.hostname}:${appConfig.port}`);
logger.info(`🌍 环境: ${appConfig.nodeEnv}`);
logger.info(`📊 注册方法: ${rpcRegistry.getAllMethods().length} 个`);
logger.info(`🔧 可用端点:`);
logger.info(`   • POST /json-rpc - 主要 RPC 接口`);
logger.info(`   • GET /json-rpc - 方法发现接口`);
logger.info(`   • GET /health - 健康检查`);
logger.info(`   • GET / - API 信息`);

export default server;