/**
 * 流程天命人 - 后端API服务
 * 提供数据库连接和API接口
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// 加载环境配置文件
// 优先使用 DOTENV_PATH 环境变量指定的文件
// 否则根据 NODE_ENV 选择对应的配置文件
const envPath = process.env.DOTENV_PATH || 
    (process.env.NODE_ENV === 'production' 
        ? '../env.production' 
        : '../env.development');
require('dotenv').config({ path: envPath });

const authRoutes = require('./routes/auth');
const learningRoutes = require('./routes/learning');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const conversationRoutes = require('./routes/conversation');
const aiRoutes = require('./routes/ai'); // AI对话生成路由
const { connectDatabase, initializeDatabaseConfig } = require('./config/database');
const { initConversationLearning } = require('./scripts/init-database');

const app = express();
const PORT = process.env.PORT || 3001; // 使用环境变量配置的端口

// 信任代理设置
app.set('trust proxy', false);

// 安全中间件
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
        },
    },
}));

// CORS配置
const isDevelopment = process.env.NODE_ENV !== 'production';

app.use(cors({
    origin: isDevelopment ? [
        'http://localhost:3000',  // 添加本地开发端口3000
        'http://127.0.0.1:3000', // 添加本地开发端口3000
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:8000',
        'http://127.0.0.1:8000',
        'http://localhost:4000',
        'http://127.0.0.1:4000',
        'http://localhost:5000',  // 添加本地开发端口5000（当前前端运行端口）
        'http://127.0.0.1:5000', // 添加本地开发端口5000（当前前端运行端口）
        'http://localhost',
        'http://127.0.0.1',
        process.env.FRONTEND_URL
    ].filter(Boolean) : [
        "http://process.xjio.cn",
        "https://process.xjio.cn",
        "http://www.process.xjio.cn",
        "https://www.process.xjio.cn",
        process.env.FRONTEND_URL
    ].filter(Boolean), // 过滤掉 undefined 值，移除IP地址以提高安全性
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'X-CSRF-Token'],
    exposedHeaders: ['Content-Length', 'X-Total-Count']
}));

// 请求日志
app.use(morgan('combined'));

// 限流配置（安全修复：收紧限制）
// 通用API限流
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 300, // 限制每个IP 15分钟内最多300个请求
    message: '请求过于频繁，请稍后再试',
    standardHeaders: true,
    legacyHeaders: false,
});

// 认证接口限流（更严格）
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // 登录/注册接口限制更严格
    message: '认证请求过于频繁，请稍后再试',
    skipSuccessfulRequests: true, // 成功请求不计入限制
});

// 应用限流中间件
app.use('/api/auth/', authLimiter);
app.use('/api/', generalLimiter);

// 解析JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 根API路由
app.get('/api', (req, res) => {
    res.json({
        message: '流程天命人 API 服务',
        version: '2.0',
        status: 'running',
        endpoints: {
            auth: '/api/auth',
            learning: '/api/learning', 
            user: '/api/user',
            admin: '/api/admin',
            conversation: '/api/conversation',
            ai: '/api/ai'
        }
    });
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/ai', aiRoutes); // AI对话生成路由

// 静态文件服务（提供前端文件）
app.use(express.static('/app', {
    setHeaders: (res, path) => {
        // 设置正确的MIME类型
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('API错误:', err);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: '请求参数错误',
            details: err.message
        });
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: '未授权访问'
        });
    }
    
    // 记录详细错误到日志（不返回给客户端）
    console.error('服务器错误详情:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    res.status(500).json({
        error: '服务器内部错误',
        message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
    });
});

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        error: '接口不存在',
        path: req.originalUrl
    });
});

// 启动服务器
async function startServer() {
    try {
        // 初始化数据库配置
        await initializeDatabaseConfig();
        
        // 连接数据库
        await connectDatabase();
        console.log('✅ 数据库连接成功');
        
        // 初始化对话学习相关数据库结构
        await initConversationLearning();
        console.log('✅ 对话学习数据库结构初始化完成');
        
        // 启动HTTP服务器
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 API服务器启动成功`);
            console.log(`📍 端口: ${PORT}`);
            console.log(`🌍 环境: ${process.env.NODE_ENV || 'production'}`);
            console.log(`🔗 健康检查: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    }
}

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('🛑 收到SIGTERM信号，正在关闭服务器...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 收到SIGINT信号，正在关闭服务器...');
    process.exit(0);
});

startServer();
