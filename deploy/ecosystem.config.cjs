/**
 * PM2 配置文件
 * 用于管理 y-websocket 协作服务器
 * 
 * 使用方法:
 *   pm2 start deploy/ecosystem.config.js
 *   pm2 restart wdgl-collab
 *   pm2 logs wdgl-collab
 *   pm2 stop wdgl-collab
 */

module.exports = {
    apps: [
        {
            name: 'wdgl-collab',
            script: 'ws-server.js',
            cwd: './backend',

            // 实例配置
            instances: 1,  // WebSocket 通常不适合多实例，除非有 Redis 适配器
            exec_mode: 'fork',

            // 环境变量
            env: {
                NODE_ENV: 'production',
                PORT: 1234
            },

            // 日志配置
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            error_file: './logs/wdgl-collab-error.log',
            out_file: './logs/wdgl-collab-out.log',
            merge_logs: true,

            // 重启策略
            max_restarts: 10,
            min_uptime: '10s',
            restart_delay: 5000,
            autorestart: true,

            // 监控配置
            max_memory_restart: '500M',

            // 文件监控 (生产环境通常关闭)
            watch: false,
            ignore_watch: ['node_modules', 'logs'],
        }
    ],

    // 部署配置 (可选，用于 pm2 deploy)
    deploy: {
        production: {
            user: 'dev',
            host: 'your-server-ip',
            ref: 'origin/main',
            repo: 'git@github.com:your-username/wdgl-01.git',
            path: '/var/www/wdgl',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && npm run build && cd backend && npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
};
