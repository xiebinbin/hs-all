# PM2 部署指南

本项目使用 PM2 进行进程管理，支持多个应用的同时运行。

## 安装 PM2

```bash
npm install -g pm2
```

## 使用方法

### 启动所有应用

```bash
# 启动所有应用（生产环境）
pm2 start ecosystem.config.js

# 启动所有应用（开发环境）
pm2 start ecosystem.config.js --env development
```

### 启动单个应用

```bash
# 启动指定应用
pm2 start ecosystem.config.js --only member-web
pm2 start ecosystem.config.js --only doctor-web
pm2 start ecosystem.config.js --only hispital-web
pm2 start ecosystem.config.js --only super-web
pm2 start ecosystem.config.js --only hospital-api
pm2 start ecosystem.config.js --only super-api
```

### 管理应用

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs
pm2 logs member-web

# 重启应用
pm2 restart all
pm2 restart member-web

# 停止应用
pm2 stop all
pm2 stop member-web

# 删除应用
pm2 delete all
pm2 delete member-web

# 重新加载配置
pm2 reload ecosystem.config.js
```

### 监控

```bash
# 实时监控
pm2 monit

# 查看详细信息
pm2 show member-web
```

## 应用端口分配

| 应用名称 | 端口 | 描述 |
|---------|------|------|
| member-web | 3000 | 患者端网站 |
| doctor-web | 3001 | 医生端网站 |
| hispital-web | 3002 | 医院端网站 |
| super-web | 3003 | 管理端网站 |
| hospital-api | 4000 | 医院API服务 |
| super-api | 4001 | 管理API服务 |

## 部署前准备

1. 确保所有应用都已构建：
```bash
npm run build
```

2. 确保所有依赖已安装：
```bash
npm install
```

## 注意事项

- 生产环境建议使用 `NODE_ENV=production`
- 可根据服务器配置调整 `instances` 数量
- 内存限制可根据实际需求调整
- 日志文件会自动生成在 `~/.pm2/logs/` 目录下