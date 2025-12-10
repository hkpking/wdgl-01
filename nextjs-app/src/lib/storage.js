/**
 * 模拟数据存储服务
 * 使用 localStorage 模拟后端数据库操作
 * 方便开发调试,将来可以轻松替换为真实的 API 调用
 */

const STORAGE_PREFIX = 'wdgl_';
const DOCUMENTS_KEY = `${STORAGE_PREFIX}documents`;
const CURRENT_USER_KEY = `${STORAGE_PREFIX}current_user`;

// 模拟系统知识库 (System Knowledge) - 只读
const SYSTEM_KNOWLEDGE = [
    { id: 'sys_compliance', title: '企业合规指导手册 (2024版)', content: '所有员工必须遵守反腐败规定... 报销必须提供正规发票...', type: 'system' },
    { id: 'sys_security', title: '信息安全管理规范', content: '严禁将公司数据上传至未授权的公有云服务... 密码必须每90天更换一次...', type: 'system' },
    { id: 'sys_hr', title: '员工行为准则', content: '工作时间禁止从事与工作无关的活动... 尊重同事，禁止歧视...', type: 'system' }
];

/**
 * 生成唯一 ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 获取当前时间戳
 */
function getTimestamp() {
    return new Date().toISOString();
}

/**
 * 获取所有文档
 */
export function getAllDocuments(userId) {
    try {
        const allDocs = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '{}');
        const userDocs = allDocs[userId] || {};
        return Object.keys(userDocs).map(id => ({
            id,
            ...userDocs[id]
        }));
    } catch (error) {
        console.error('获取文档失败:', error);
        return [];
    }
}

/**
 * 获取系统知识库文档
 */
export function getSystemKnowledge() {
    return SYSTEM_KNOWLEDGE;
}

/**
 * 搜索文档 (包括用户文档和系统知识)
 */
export function searchDocuments(userId, query) {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();

    // 1. 搜索用户文档
    const userDocs = getAllDocuments(userId).filter(doc =>
        (doc.title || '').toLowerCase().includes(lowerQuery) ||
        (doc.content || '').toLowerCase().includes(lowerQuery)
    ).map(doc => ({ ...doc, type: 'user' }));

    // 2. 搜索系统知识
    const sysDocs = SYSTEM_KNOWLEDGE.filter(doc =>
        doc.title.toLowerCase().includes(lowerQuery) ||
        doc.content.toLowerCase().includes(lowerQuery)
    );

    return [...userDocs, ...sysDocs];
}

/**
 * 获取单个文档
 */
export function getDocument(userId, docId) {
    try {
        const allDocs = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '{}');
        const userDocs = allDocs[userId] || {};
        return userDocs[docId] || null;
    } catch (error) {
        console.error('获取文档失败:', error);
        return null;
    }
}

/**
 * 清除所有版本历史(内部函数)
 */
function clearAllVersions(userId) {
    Object.keys(localStorage)
        .filter(key => key.startsWith(`${STORAGE_PREFIX}versions_${userId}_`))
        .forEach(key => {
            console.log('清除版本:', key);
            localStorage.removeItem(key);
        });
}

/**
 * 保存文档
 */
export function saveDocument(userId, docId, data) {
    try {
        // 检查数据大小(简化流程图数据)
        const dataSize = JSON.stringify(data).length;
        const maxSize = 500 * 1024; // 500KB 限制单个文档

        if (dataSize > maxSize) {
            const sizeKB = (dataSize / 1024).toFixed(0);
            const maxKB = (maxSize / 1024).toFixed(0);
            throw new Error(`文档内容过大 (${sizeKB}KB)。建议:\n1. 删除部分流程图\n2. 清理旧文档\n3. 精简内容\n\n单个文档最大支持 ${maxKB}KB`);
        }

        const allDocs = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '{}');

        if (!allDocs[userId]) {
            allDocs[userId] = {};
        }

        const now = getTimestamp();

        if (docId) {
            // 更新现有文档
            allDocs[userId][docId] = {
                ...allDocs[userId][docId],
                ...data,
                updatedAt: now
            };
        } else {
            // 创建新文档
            docId = generateId();
            allDocs[userId][docId] = {
                ...data,
                createdAt: now,
                updatedAt: now
            };
        }

        // 尝试保存,如果失败则清理旧版本
        try {
            localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(allDocs));
        } catch (storageError) {
            console.warn('存储空间不足,正在清理版本历史...');
            clearAllVersions(userId);

            // 再次尝试保存
            try {
                localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(allDocs));
                console.log('清理后保存成功');
            } catch (retryError) {
                throw new Error('存储空间不足。请删除一些旧文档或清空浏览器缓存。');
            }
        }

        return { id: docId, ...allDocs[userId][docId] };
    } catch (error) {
        console.error('保存文档失败:', error);
        throw error;
    }
}

/**
 * 删除文档
 */
export function deleteDocument(userId, docId) {
    try {
        const allDocs = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '{}');

        if (allDocs[userId] && allDocs[userId][docId]) {
            delete allDocs[userId][docId];
            localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(allDocs));

            // 同时删除版本历史
            const versionKey = `${STORAGE_PREFIX}versions_${userId}_${docId}`;
            localStorage.removeItem(versionKey);

            return true;
        }

        return false;
    } catch (error) {
        console.error('删除文档失败:', error);
        return false;
    }
}

/**
 * 保存文档版本(简化版 - 仅用于 Mock 开发)
 * 
 * 🔧 当前策略(localStorage 限制):
 * - 只在手动保存时调用(不是自动保存)
 * - 只保留最近 5 个版本
 * - 不保存流程图等大型数据,只保存文本内容
 * 
 * ⚠️ TODO: 迁移到真实数据库后的最佳实践:
 * 
 * 1. 版本触发时机:
 *    - 手动保存时必创建
 *    - 重大修改前由用户主动创建检查点
 *    - 可选:每小时自动创建一次备份版本
 * 
 * 2. 版本保留策略(推荐):
 *    - 最近 10 个手动保存版本
 *    - 每天保留一个快照(最近 30 天)
 *    - 每周保留一个快照(最近 3 个月)
 *    - 用户标记的重要版本永久保留
 * 
 * 3. 存储优化:
 *    - 使用差异存储(diff/patch)减少空间占用
 *    - 压缩老版本数据
 *    - 大文件(如流程图)使用对象存储(如 S3)
 * 
 * 4. 版本元数据:
 *    - 创建时间、创建者
 *    - 版本描述/注释
 *    - 变更类型(手动/自动/检查点)
 *    - 版本标签(如 v1.0, v2.0)
 * 
 * 5. 版本比较和恢复:
 *    - 提供版本间的 diff 可视化
 *    - 支持部分内容恢复
 *    - 支持版本合并
 */
export function saveVersion(userId, docId, versionData) {
    const versionKey = `${STORAGE_PREFIX}versions_${userId}_${docId}`;
    try {
        const versions = JSON.parse(localStorage.getItem(versionKey) || '[]');

        // 简化数据:只保存核心内容,移除大型数据
        const simplifiedData = {
            title: versionData.title,
            content: versionData.content,
            // TODO: 在真实数据库中,应该保存完整数据或使用 diff
            savedAt: getTimestamp(),
            id: generateId()
        };

        versions.push(simplifiedData);

        // 当前限制:只保留最近 5 个版本
        // TODO: 迁移到数据库后,实施上述的智能保留策略
        if (versions.length > 5) {
            versions.shift();
        }

        localStorage.setItem(versionKey, JSON.stringify(versions));
        console.log(`[VERSION] 已保存版本 (${versions.length}/5)`);
    } catch (error) {
        console.error('保存版本失败:', error);
        // 如果空间不足,尝试删除最旧的版本
        try {
            const versions = JSON.parse(localStorage.getItem(versionKey) || '[]');
            if (versions.length > 0) {
                versions.shift();
                localStorage.setItem(versionKey, JSON.stringify(versions));
                console.log('[VERSION] 清理旧版本后重试保存');
            }
        } catch (retryError) {
            console.error('清理旧版本失败:', retryError);
        }
    }
}

/**
 * 获取文档版本历史
 */
export function getVersions(userId, docId) {
    const versionKey = `${STORAGE_PREFIX}versions_${userId}_${docId}`;
    try {
        return JSON.parse(localStorage.getItem(versionKey) || '[]');
    } catch (error) {
        console.error('获取版本历史失败:', error);
        return [];
    }
}

/**
 * 模拟用户认证
 */
export function getCurrentUser() {
    try {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        if (user) {
            return JSON.parse(user);
        }
        // 自动创建一个模拟用户
        const mockUser = {
            uid: 'demo_user',
            email: 'demo@example.com',
            displayName: '演示用户'
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockUser));
        return mockUser;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        return null;
    }
}

/**
 * 模拟登出
 */
export function signOut() {
    try {
        localStorage.removeItem(CURRENT_USER_KEY);
        return true;
    } catch (error) {
        console.error('登出失败:', error);
        return false;
    }
}

/**
 * 清除所有数据(用于调试)
 */
export function clearAll() {
    if (window.confirm('确定要清除所有数据吗?这将删除所有文档!')) {
        Object.keys(localStorage)
            .filter(key => key.startsWith(STORAGE_PREFIX))
            .forEach(key => localStorage.removeItem(key));
        alert('所有数据已清除。请刷新页面。');
    }
}

/**
 * 获取存储使用情况
 */
export function getStorageInfo() {
    let totalSize = 0;
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
            totalSize += localStorage.getItem(key).length;
        }
    });

    const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
    const maxMB = 5; // localStorage 通常限制为 5-10MB
    const usage = ((totalSize / (maxMB * 1024 * 1024)) * 100).toFixed(1);

    return {
        totalSize,
        totalMB,
        maxMB,
        usage,
        message: `已使用 ${totalMB}MB / ~${maxMB}MB (${usage}%)`
    };
}

/**
 * 更新版本信息 (例如重命名)
 */
export function updateVersion(userId, docId, versionId, updates) {
    const versionKey = `${STORAGE_PREFIX}versions_${userId}_${docId}`;
    try {
        const versions = JSON.parse(localStorage.getItem(versionKey) || '[]');
        const index = versions.findIndex(v => v.id === versionId);

        if (index !== -1) {
            versions[index] = { ...versions[index], ...updates };
            localStorage.setItem(versionKey, JSON.stringify(versions));
            return versions[index];
        }
        return null;
    } catch (error) {
        console.error('更新版本失败:', error);
        return null;
    }
}

/**
 * ------------------------------------------------------------------
 * 评论系统数据存储
 * ------------------------------------------------------------------
 */

/**
 * 获取文档的所有评论
 */
export function getComments(userId, docId) {
    const key = `${STORAGE_PREFIX}comments_${userId}_${docId}`;
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
        console.error('获取评论失败:', error);
        return [];
    }
}

/**
 * 添加评论
 */
export function addComment(userId, docId, comment) {
    const key = `${STORAGE_PREFIX}comments_${userId}_${docId}`;
    try {
        const comments = getComments(userId, docId);
        const newComment = {
            id: comment.id || generateId(),
            createdAt: getTimestamp(),
            status: 'open', // open, resolved
            replies: [],
            ...comment
        };
        comments.push(newComment);
        localStorage.setItem(key, JSON.stringify(comments));
        return newComment;
    } catch (error) {
        console.error('添加评论失败:', error);
        throw error;
    }
}

/**
 * 添加回复
 */
export function addReply(userId, docId, commentId, reply) {
    const key = `${STORAGE_PREFIX}comments_${userId}_${docId}`;
    try {
        const comments = getComments(userId, docId);
        const index = comments.findIndex(c => c.id === commentId);

        if (index !== -1) {
            const newReply = {
                id: generateId(),
                createdAt: getTimestamp(),
                ...reply
            };
            comments[index].replies.push(newReply);
            localStorage.setItem(key, JSON.stringify(comments));
            return newReply;
        }
        return null;
    } catch (error) {
        console.error('添加回复失败:', error);
        throw error;
    }
}

/**
 * 解决/重新打开评论
 */
export function updateCommentStatus(userId, docId, commentId, status) {
    const key = `${STORAGE_PREFIX}comments_${userId}_${docId}`;
    try {
        const comments = getComments(userId, docId);
        const index = comments.findIndex(c => c.id === commentId);

        if (index !== -1) {
            comments[index].status = status;
            localStorage.setItem(key, JSON.stringify(comments));
            return comments[index];
        }
        return null;
    } catch (error) {
        console.error('更新评论状态失败:', error);
        throw error;
    }
}

/**
 * 删除评论
 */
export function deleteComment(userId, docId, commentId) {
    const key = `${STORAGE_PREFIX}comments_${userId}_${docId}`;
    try {
        const comments = getComments(userId, docId);
        const newComments = comments.filter(c => c.id !== commentId);
        localStorage.setItem(key, JSON.stringify(newComments));
        return true;
    } catch (error) {
        console.error('删除评论失败:', error);
        throw error;
    }
}

/**
 * ------------------------------------------------------------------
 * 目录管理 (Folder Management)
 * ------------------------------------------------------------------
 */

const FOLDERS_KEY = `${STORAGE_PREFIX}folders`;

/**
 * 获取所有文件夹
 */
export function getFolders(userId) {
    try {
        const allFolders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '{}');
        const userFolders = allFolders[userId] || {};

        // 如果是第一次使用，初始化默认文件夹
        if (Object.keys(userFolders).length === 0) {
            const defaultFolders = [
                { id: 'f_company', name: '公司制度', parentId: null },
                { id: 'f_hr', name: '人事管理', parentId: 'f_company' },
                { id: 'f_admin', name: '行政管理', parentId: 'f_company' },
                { id: 'f_finance', name: '财务管理', parentId: 'f_company' },
            ];

            const initialFolders = {};
            defaultFolders.forEach(f => {
                initialFolders[f.id] = { ...f, createdAt: getTimestamp() };
            });

            allFolders[userId] = initialFolders;
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(allFolders));
            return Object.values(initialFolders);
        }

        return Object.values(userFolders);
    } catch (error) {
        console.error('获取文件夹失败:', error);
        return [];
    }
}

/**
 * 创建文件夹
 */
export function createFolder(userId, name, parentId = null) {
    try {
        const allFolders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '{}');
        if (!allFolders[userId]) allFolders[userId] = {};

        const folderId = `f_${generateId()}`;
        const newFolder = {
            id: folderId,
            name,
            parentId,
            createdAt: getTimestamp()
        };

        allFolders[userId][folderId] = newFolder;
        localStorage.setItem(FOLDERS_KEY, JSON.stringify(allFolders));
        return newFolder;
    } catch (error) {
        console.error('创建文件夹失败:', error);
        throw error;
    }
}

/**
 * 更新文件夹 (重命名/移动)
 */
export function updateFolder(userId, folderId, updates) {
    try {
        const allFolders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '{}');
        if (allFolders[userId] && allFolders[userId][folderId]) {
            allFolders[userId][folderId] = { ...allFolders[userId][folderId], ...updates };
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(allFolders));
            return allFolders[userId][folderId];
        }
        return null;
    } catch (error) {
        console.error('更新文件夹失败:', error);
        throw error;
    }
}

/**
 * 删除文件夹
 * 注意：通常需要检查文件夹是否为空，或者递归删除。这里简化处理，只删除文件夹本身。
 * 其中的文件会变成 "未分类" (parentId: null)
 */
export function deleteFolder(userId, folderId) {
    try {
        const allFolders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '{}');
        if (allFolders[userId] && allFolders[userId][folderId]) {
            delete allFolders[userId][folderId];
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(allFolders));

            // 将该文件夹下的子文件夹移动到根目录
            Object.values(allFolders[userId]).forEach(f => {
                if (f.parentId === folderId) {
                    f.parentId = null;
                }
            });
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(allFolders));

            // 将该文件夹下的文档移动到根目录
            const allDocs = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '{}');
            if (allDocs[userId]) {
                Object.values(allDocs[userId]).forEach(doc => {
                    if (doc.parentId === folderId) {
                        doc.parentId = null;
                    }
                });
                localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(allDocs));
            }

            return true;
        }
        return false;
    } catch (error) {
        console.error('删除文件夹失败:', error);
        return false;
    }
}

/**
 * 移动文档到文件夹
 */
export function moveDocument(userId, docId, folderId) {
    try {
        const allDocs = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '{}');
        if (allDocs[userId] && allDocs[userId][docId]) {
            allDocs[userId][docId].parentId = folderId;
            localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(allDocs));
            return true;
        }
        return false;
    } catch (error) {
        console.error('移动文档失败:', error);
        return false;
    }
}
