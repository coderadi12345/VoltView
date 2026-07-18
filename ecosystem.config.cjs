module.exports = {
  apps: [
    {
      name: 'voltview-api',
      cwd: './server',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      max_memory_restart: '512M',
      time: true
    }
  ]
};
