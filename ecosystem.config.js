module.exports = {
  apps: [{
    name: 'livestream-backend',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'uploads'],
    // Auto restart on crash
    autorestart: true,
    // Restart delay
    restart_delay: 4000,
    // Max restart attempts
    max_restarts: 10,
    // Min uptime before considering app started
    min_uptime: '10s'
  }]
}; 