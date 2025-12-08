/**
 * 协作配置
 * 集中管理 WebSocket 服务器地址等配置
 * 注：项目部署在云服务器 194.238.27.79 上开发
 */

// WebSocket 服务器地址（云服务器）
const WS_URL = 'ws://194.238.27.79:1234';

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
