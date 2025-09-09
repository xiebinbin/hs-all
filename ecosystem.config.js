module.exports = {
  apps: [
    {
      name: 'member-web',
      script: 'bun',
      args: 'dev',
      cwd: './apps/member-web',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      }
    }
  ]
};