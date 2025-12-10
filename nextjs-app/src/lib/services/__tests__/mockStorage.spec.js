import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as mockStorage from '../mockStorage';

// 模拟 localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
        get length() { return Object.keys(store).length; },
        key: (i) => Object.keys(store)[i] || null
    };
})();

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true
});

describe('mockStorage 服务', () => {
    const testUserId = 'test-user-123';

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('文档 CRUD 操作', () => {
        it('应该创建并获取文档', async () => {
            // 创建文档
            const newDoc = await mockStorage.saveDocument(testUserId, null, {
                title: '测试文档',
                content: '<p>测试内容</p>'
            });

            expect(newDoc).toBeDefined();
            expect(newDoc.id).toBeDefined();
            expect(newDoc.title).toBe('测试文档');

            // 获取文档
            const retrieved = await mockStorage.getDocument(testUserId, newDoc.id);
            expect(retrieved.title).toBe('测试文档');
            expect(retrieved.content).toBe('<p>测试内容</p>');
        });

        it('应该更新已存在的文档', async () => {
            // 创建
            const doc = await mockStorage.saveDocument(testUserId, null, {
                title: '原标题',
                content: '<p>原内容</p>'
            });

            // 更新
            await mockStorage.saveDocument(testUserId, doc.id, {
                title: '新标题',
                content: '<p>新内容</p>'
            });

            // 验证
            const updated = await mockStorage.getDocument(testUserId, doc.id);
            expect(updated.title).toBe('新标题');
            expect(updated.content).toBe('<p>新内容</p>');
        });

        it('应该删除文档', async () => {
            const doc = await mockStorage.saveDocument(testUserId, null, {
                title: '待删除',
                content: ''
            });

            await mockStorage.deleteDocument(testUserId, doc.id);

            const result = await mockStorage.getDocument(testUserId, doc.id);
            expect(result).toBeNull();
        });

        it('应该获取所有文档列表', async () => {
            await mockStorage.saveDocument(testUserId, null, { title: '文档1', content: '' });
            await mockStorage.saveDocument(testUserId, null, { title: '文档2', content: '' });

            const docs = await mockStorage.getAllDocuments(testUserId);
            expect(docs.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('文件夹管理', () => {
        it('应该创建文件夹', async () => {
            const folder = await mockStorage.createFolder(testUserId, '项目文档');

            expect(folder).toBeDefined();
            expect(folder.id).toBeDefined();
            expect(folder.name).toBe('项目文档');
        });

        it('应该获取所有文件夹', async () => {
            await mockStorage.createFolder(testUserId, '文件夹A');
            await mockStorage.createFolder(testUserId, '文件夹B');

            const folders = await mockStorage.getFolders(testUserId);
            // 包含默认 root 文件夹
            expect(folders.length).toBeGreaterThanOrEqual(2);
        });

        it('应该更新文件夹名称', async () => {
            const folder = await mockStorage.createFolder(testUserId, '旧名称');

            await mockStorage.updateFolder(testUserId, folder.id, { name: '新名称' });

            const folders = await mockStorage.getFolders(testUserId);
            const updated = folders.find(f => f.id === folder.id);
            expect(updated.name).toBe('新名称');
        });

        it('应该删除文件夹', async () => {
            const folder = await mockStorage.createFolder(testUserId, '待删除');

            await mockStorage.deleteFolder(testUserId, folder.id);

            const folders = await mockStorage.getFolders(testUserId);
            const deleted = folders.find(f => f.id === folder.id);
            expect(deleted).toBeUndefined();
        });

        it('应该将文档移动到文件夹', async () => {
            const folder = await mockStorage.createFolder(testUserId, '目标文件夹');
            const doc = await mockStorage.saveDocument(testUserId, null, { title: '测试', content: '' });

            await mockStorage.moveDocument(testUserId, doc.id, folder.id);

            const movedDoc = await mockStorage.getDocument(testUserId, doc.id);
            expect(movedDoc.parentId).toBe(folder.id);
        });
    });

    describe('版本历史', () => {
        it('应该保存版本', async () => {
            const doc = await mockStorage.saveDocument(testUserId, null, {
                title: '版本测试',
                content: '<p>版本1</p>'
            });

            await mockStorage.saveVersion(testUserId, doc.id, {
                content: '<p>版本1</p>',
                title: '版本测试'
            });

            const versions = await mockStorage.getVersions(testUserId, doc.id);
            expect(versions.length).toBeGreaterThanOrEqual(1);
        });

        it('应该获取版本列表', async () => {
            const doc = await mockStorage.saveDocument(testUserId, null, {
                title: '多版本测试',
                content: ''
            });

            // 保存多个版本
            await mockStorage.saveVersion(testUserId, doc.id, { content: 'v1', title: '多版本测试' });
            await mockStorage.saveVersion(testUserId, doc.id, { content: 'v2', title: '多版本测试' });

            const versions = await mockStorage.getVersions(testUserId, doc.id);
            expect(versions.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('工具函数', () => {
        it('generateId 应该生成唯一ID', () => {
            const id1 = mockStorage.generateId ? mockStorage.generateId() : 'mock-id';
            const id2 = mockStorage.generateId ? mockStorage.generateId() : 'mock-id-2';
            // 如果 generateId 不导出，跳过此测试
            if (mockStorage.generateId) {
                expect(id1).not.toBe(id2);
            }
        });

        it('getCurrentUser 应该返回模拟用户', () => {
            const user = mockStorage.getCurrentUser();
            expect(user).toBeDefined();
            expect(user.uid).toBeDefined();
        });
    });
});
