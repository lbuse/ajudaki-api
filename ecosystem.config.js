module.exports = {
  apps : [{
    name: 'ajudaki-api',
    script: './bin/www',
    node_args: '-r esm -r dotenv/config.js',
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch : ['node_modules', 'public'],
    max_memory_restart: '512M'
  }]
};
