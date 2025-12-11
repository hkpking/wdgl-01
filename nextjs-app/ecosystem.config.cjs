module.exports = {
    apps: [
        {
            name: 'wdgl-nextjs',
            script: 'npm',
            args: 'start -- -p 3001',
            cwd: '/var/www/wdgl-01/nextjs-app',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
            },
            error_file: '/var/www/wdgl-01/logs/nextjs-error.log',
            out_file: '/var/www/wdgl-01/logs/nextjs-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
        },
        {
            name: 'wdgl-collab',
            script: './server.js',
            cwd: '/var/www/wdgl-01/backend',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '512M',
            env: {
                NODE_ENV: 'production',
                PORT: 1234,
            },
            error_file: '/var/www/wdgl-01/logs/collab-error.log',
            out_file: '/var/www/wdgl-01/logs/collab-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
        },
    ],
};
