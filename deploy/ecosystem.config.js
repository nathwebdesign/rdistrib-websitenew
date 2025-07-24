module.exports = {
  apps: [{
    name: 'rdistrib-website',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/rdistrib',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/rdistrib-error.log',
    out_file: '/var/log/pm2/rdistrib-out.log',
    log_file: '/var/log/pm2/rdistrib-combined.log',
    time: true
  }]
};