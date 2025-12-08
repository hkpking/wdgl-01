#!/usr/bin/env node
/**
 * y-websocket 服务器
 * 用于 Tiptap 实时协作
 * 
 * 启动命令: node backend/ws-server.js
 * 或: PORT=1234 node backend/ws-server.js
 */

const WebSocket = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');

const PORT = process.env.PORT || 1234;

const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('y-websocket server running\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => {
    // 从 URL 中获取房间名 (文档 ID)
    const docName = req.url.slice(1).split('?')[0] || 'default';
    console.log(`[${new Date().toISOString()}] Client connected to room: ${docName}`);

    setupWSConnection(conn, req, { docName });

    conn.on('close', () => {
        console.log(`[${new Date().toISOString()}] Client disconnected from room: ${docName}`);
    });
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║   y-websocket 协作服务器已启动                      ║
╠════════════════════════════════════════════════════╣
║   地址: ws://localhost:${PORT}                      ║
║   文档访问: ws://localhost:${PORT}/<documentId>      ║
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
