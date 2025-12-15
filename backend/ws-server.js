#!/usr/bin/env node
/**
 * y-websocket 服务器 (已适配 y-websocket@3.0.0)
 * 用于 Tiptap 实时协作
 * 
 * 启动命令: node backend/ws-server.js
 * 或: PORT=1234 node backend/ws-server.js
 */

import { WebSocketServer } from 'ws';
import http from 'http';
import { setupWSConnection } from '@y/websocket-server/utils';

const PORT = process.env.PORT || 1234;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('y-websocket server running\n');
});

const wss = new WebSocketServer({ noServer: true });

// 处理 WebSocket 升级请求
server.on('upgrade', (request, socket, head) => {
    // 从 URL 中获取房间名 (文档 ID)
    const docName = request.url?.slice(1).split('?')[0] || 'default';
    console.log(`[${new Date().toISOString()}] Client connecting to room: ${docName}`);

    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// WebSocket 连接处理
wss.on('connection', (conn, req) => {
    const docName = req.url?.slice(1).split('?')[0] || 'default';
    console.log(`[${new Date().toISOString()}] ✅ Connection established for room: ${docName}`);

    try {
        // 使用 @y/websocket-server 提供的连接处理函数
        setupWSConnection(conn, req);
        console.log(`[${new Date().toISOString()}] ✅ setupWSConnection completed for room: ${docName}`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ setupWSConnection error:`, error);
    }

    conn.on('error', (error) => {
        console.error(`[${new Date().toISOString()}] ❌ WebSocket error in room ${docName}:`, error);
    });

    conn.on('close', (code, reason) => {
        console.log(`[${new Date().toISOString()}] Client disconnected from room: ${docName}, code: ${code}, reason: ${reason || 'none'}`);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║   y-websocket 协作服务器已启动 (v3.0.0)            ║
╠════════════════════════════════════════════════════╣
║   地址: ws://${HOST}:${PORT}                        
║   文档访问: ws://${HOST}:${PORT}/<documentId>       
╚════════════════════════════════════════════════════╝
    `);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    wss.clients.forEach(client => client.close());
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});
