/**
 * LocalStorage 实现的 Repository
 * 将现有 mockStorage.js 的逻辑封装为 Repository Pattern
 */

import { IDocumentRepository, IFolderRepository, IVersionRepository } from './interfaces';

// =============================================
// 常量和工具函数
// =============================================
const STORAGE_PREFIX = 'wdgl_';
const DOCUMENTS_KEY = `${STORAGE_PREFIX}documents`;
const FOLDERS_KEY = `${STORAGE_PREFIX}folders`;
const VERSIONS_KEY = `${STORAGE_PREFIX}versions`;

/**
 * 生成唯一ID
 */
function generateId(prefix = '') {
    return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * 获取当前时间戳
 */
function getTimestamp() {
    return new Date().toISOString();
}

// =============================================
// LocalStorageDocumentRepository
// =============================================

/**
 * 文档仓库的 LocalStorage 实现
 */
export class LocalStorageDocumentRepository extends IDocumentRepository {
    async getAll(userId) {
        try {
            const allDocs = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '{}');
            const userDocs = allDocs[userId] || {};
            return Object.values(userDocs).sort((a, b) =>
                new Date(b.updatedAt) - new Date(a.updatedAt)
            );
        } catch (error) {
            console.error('获取文档列表失败:', error);
            return [];
        }
    }

    async getById(userId, docId) {
        try {
            const allDocs = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '{}');
            return allDocs[userId]?.[docId] || null;
        } catch (error) {
            console.error('获取文档失败:', error);
            return null;
        }
    }

    async search(userId, query) {
        try {
            const docs = await this.getAll(userId);
            const searchQuery = query.toLowerCase();
            return docs.filter(doc =>
                doc.title?.toLowerCase().includes(searchQuery) ||
                doc.content?.toLowerCase().includes(searchQuery)
            );
        } catch (error) {
            console.error('搜索文档失败:', error);
            return [];
        }
    }

    async save(userId, docId, data) {
        try {
            const allDocs = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '{}');

            if (!allDocs[userId]) {
                allDocs[userId] = {};
            }

            const now = getTimestamp();
            const isNew = !docId;
            const id = docId || generateId('doc_');

            const existingDoc = allDocs[userId][id] || {};
            const doc = {
                ...existingDoc,
                ...data,
                id,
                updatedAt: now,
                createdAt: existingDoc.createdAt || now,
            };

            allDocs[userId][id] = doc;
            localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(allDocs));

            return doc;
        } catch (error) {
            console.error('保存文档失败:', error);
            throw error;
        }
    }

    async delete(userId, docId) {
        try {
            const allDocs = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '{}');

            if (allDocs[userId]?.[docId]) {
                delete allDocs[userId][docId];
                localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(allDocs));
                return true;
            }
            return false;
        } catch (error) {
            console.error('删除文档失败:', error);
            return false;
        }
    }

    async move(userId, docId, folderId) {
        try {
            const allDocs = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '{}');

            if (allDocs[userId]?.[docId]) {
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
}

// =============================================
// LocalStorageFolderRepository
// =============================================

/**
 * 文件夹仓库的 LocalStorage 实现
 */
export class LocalStorageFolderRepository extends IFolderRepository {
    async getAll(userId) {
        try {
            const allFolders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '{}');
            const userFolders = allFolders[userId] || {};

            // 确保有根文件夹
            const folders = Object.values(userFolders);
            if (!folders.some(f => f.id === 'root')) {
                folders.unshift({
                    id: 'root',
                    name: '全部文档',
                    parentId: null,
                    isSystem: true
                });
            }

            return folders;
        } catch (error) {
            console.error('获取文件夹列表失败:', error);
            return [];
        }
    }

    async create(userId, name, parentId = null) {
        try {
            const allFolders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '{}');

            if (!allFolders[userId]) {
                allFolders[userId] = {};
            }

            const folder = {
                id: generateId('f_'),
                name,
                parentId,
                createdAt: getTimestamp()
            };

            allFolders[userId][folder.id] = folder;
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(allFolders));

            return folder;
        } catch (error) {
            console.error('创建文件夹失败:', error);
            throw error;
        }
    }

    async update(userId, folderId, updates) {
        try {
            const allFolders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '{}');

            if (allFolders[userId]?.[folderId]) {
                allFolders[userId][folderId] = {
                    ...allFolders[userId][folderId],
                    ...updates
                };
                localStorage.setItem(FOLDERS_KEY, JSON.stringify(allFolders));
                return allFolders[userId][folderId];
            }
            return null;
        } catch (error) {
            console.error('更新文件夹失败:', error);
            throw error;
        }
    }

    async delete(userId, folderId) {
        try {
            // 禁止删除根文件夹
            if (folderId === 'root') {
                return false;
            }

            const allFolders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '{}');

            if (allFolders[userId]?.[folderId]) {
                delete allFolders[userId][folderId];
                localStorage.setItem(FOLDERS_KEY, JSON.stringify(allFolders));

                // 将该文件夹下的文档移到根目录
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
}

// =============================================
// LocalStorageVersionRepository
// =============================================

/**
 * 版本仓库的 LocalStorage 实现
 */
export class LocalStorageVersionRepository extends IVersionRepository {
    constructor() {
        super();
        this.maxVersions = 5; // 最多保留5个版本
    }

    async getAll(userId, docId) {
        try {
            const allVersions = JSON.parse(localStorage.getItem(VERSIONS_KEY) || '{}');
            const docVersions = allVersions[userId]?.[docId] || [];
            return docVersions.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
        } catch (error) {
            console.error('获取版本历史失败:', error);
            return [];
        }
    }

    async save(userId, docId, data) {
        try {
            const allVersions = JSON.parse(localStorage.getItem(VERSIONS_KEY) || '{}');

            if (!allVersions[userId]) {
                allVersions[userId] = {};
            }
            if (!allVersions[userId][docId]) {
                allVersions[userId][docId] = [];
            }

            const version = {
                id: generateId('v_'),
                docId,
                ...data,
                createdAt: getTimestamp()
            };

            allVersions[userId][docId].unshift(version);

            // 限制版本数量
            if (allVersions[userId][docId].length > this.maxVersions) {
                allVersions[userId][docId] = allVersions[userId][docId].slice(0, this.maxVersions);
            }

            localStorage.setItem(VERSIONS_KEY, JSON.stringify(allVersions));
            return version;
        } catch (error) {
            console.error('保存版本失败:', error);
            throw error;
        }
    }

    async update(userId, docId, versionId, updates) {
        try {
            const allVersions = JSON.parse(localStorage.getItem(VERSIONS_KEY) || '{}');
            const docVersions = allVersions[userId]?.[docId] || [];

            const versionIndex = docVersions.findIndex(v => v.id === versionId);
            if (versionIndex !== -1) {
                docVersions[versionIndex] = {
                    ...docVersions[versionIndex],
                    ...updates
                };
                localStorage.setItem(VERSIONS_KEY, JSON.stringify(allVersions));
                return docVersions[versionIndex];
            }
            return null;
        } catch (error) {
            console.error('更新版本失败:', error);
            throw error;
        }
    }
}

// =============================================
// 导出单例实例
// =============================================

export const documentRepository = new LocalStorageDocumentRepository();
export const folderRepository = new LocalStorageFolderRepository();
export const versionRepository = new LocalStorageVersionRepository();
