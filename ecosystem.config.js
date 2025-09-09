module.exports = {
  apps: [
    {
      name: 'member-web',
      script: 'bun',
      args: 'start',
      cwd: './apps/member-web',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
    }
  ]
};