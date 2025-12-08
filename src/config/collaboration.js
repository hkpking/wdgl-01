/**
 * 协作配置
 * 集中管理 WebSocket 服务器地址等配置
 * 生产环境: bpm-auto.com (阿里云 120.79.181.206)
 */

// 根据页面协议自动选择 ws 或 wss
const getWebSocketUrl = () => {
    // 生产环境检测
    const isProduction = typeof window !== 'undefined' &&
        (window.location.hostname === 'bpm-auto.com' ||
            window.location.hostname === 'www.bpm-auto.com' ||
            window.location.hostname === '120.79.181.206');

    if (isProduction) {
        // 生产环境使用当前页面协议
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${protocol}//${window.location.host}/ws`;
    }

    // 开发环境
    return 'ws://localhost:1234';
};

const WS_URL = getWebSocketUrl();

export const collaborationConfig = {
    // WebSocket 服务器地址
    wsUrl: WS_URL,

    // 是否启用协作功能
    enabled: true,

    // 光标颜色池
    cursorColors: [
        '#F44336', '#E91E63', '#9C27B0', '#673AB7',
        '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
        '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
        '#FFC107', '#FF9800', '#FF5722'
    ],

    // 获取随机光标颜色
    getRandomColor() {
        return this.cursorColors[Math.floor(Math.random() * this.cursorColors.length)];
    }
};

export default collaborationConfig;
