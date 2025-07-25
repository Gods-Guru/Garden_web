// PM2 ecosystem configuration for production deployment
module.exports = {
  apps: [
    {
      name: 'garden-management-api',
      script: 'server.js',
      cwd: '/path/to/garden-backend',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        MONGO_URI: 'mongodb+srv://username:password@cluster.mongodb.net/garden-management',
        JWT_SECRET: 'your-super-secure-production-jwt-secret',
        LOG_LEVEL: 'error'
      },
      
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 5001,
        MONGO_URI: 'mongodb+srv://username:password@staging-cluster.mongodb.net/garden-management-staging',
        JWT_SECRET: 'your-staging-jwt-secret',
        LOG_LEVEL: 'info'
      },
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart policy
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Memory and CPU limits
      max_memory_restart: '1G',
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Auto restart on file changes (development only)
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      
      // Advanced options
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Source map support
      source_map_support: true,
      
      // Graceful shutdown
      shutdown_with_message: true,
      
      // Merge logs
      merge_logs: true,
      
      // Time zone
      time: true
    }
  ],
  
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-production-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/garden-management.git',
      path: '/var/www/garden-management',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    },
    
    staging: {
      user: 'deploy',
      host: ['your-staging-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:yourusername/garden-management.git',
      path: '/var/www/garden-management-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      'ssh_options': 'StrictHostKeyChecking=no'
    }
  }
};
