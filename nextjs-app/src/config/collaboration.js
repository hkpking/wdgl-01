/**
 * 协作功能配置
 * 控制实时协作的开关和连接参数
 */

// 随机颜色生成（用于协作用户光标）
const COLLABORATION_COLORS = [
    '#F87171', // red
    '#FB923C', // orange
    '#FBBF24', // amber
    '#34D399', // emerald
    '#22D3EE', // cyan
    '#60A5FA', // blue
    '#A78BFA', // violet
    '#F472B6', // pink
];

// WebSocket 端口
const WS_PORT = 1234;

const collaborationConfig = {
    // 协作功能开关 - 已修复初始化问题
    enabled: true,

    // 动态获取 WebSocket 服务器地址
    // 根据浏览器访问的地址自动适配 localhost 或外网 IP
    get wsUrl() {
        // 服务端渲染时使用环境变量或默认值
        if (typeof window === 'undefined') {
            return process.env.NEXT_PUBLIC_COLLABORATION_WS_URL || 'wss://demos.yjs.dev';
        }

        // 客户端：根据当前访问的 hostname 动态生成 WebSocket URL
        const hostname = window.location.hostname;
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

        // 如果有环境变量配置，优先使用
        if (process.env.NEXT_PUBLIC_COLLABORATION_WS_URL) {
            return process.env.NEXT_PUBLIC_COLLABORATION_WS_URL;
        }

        // 动态生成：使用当前 hostname + WebSocket 端口
        return `${protocol}//${hostname}:${WS_PORT}`;
    },

    // 获取随机协作颜色（已弃用，推荐使用 getColorByUserId）
    getRandomColor: () => {
        return COLLABORATION_COLORS[Math.floor(Math.random() * COLLABORATION_COLORS.length)];
    },

    // 基于用户 ID 生成固定颜色（确保同一用户在不同设备/会话中颜色一致）
    getColorByUserId: (userId) => {
        if (!userId) {
            return COLLABORATION_COLORS[0];
        }
        // 简单哈希算法：将用户 ID 转换为数字索引
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        const index = Math.abs(hash) % COLLABORATION_COLORS.length;
        return COLLABORATION_COLORS[index];
    },

    // 重同步间隔（毫秒）
    resyncInterval: 3000,

    // 最大重连尝试次数
    maxReconnectAttempts: 5,
};

export default collaborationConfig;
