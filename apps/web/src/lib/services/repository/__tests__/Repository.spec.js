import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    documentRepository,
    folderRepository,
    versionRepository
} from '../LocalStorageRepository';

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

describe('Repository Pattern 测试', () => {
    const testUserId = 'repo-test-user';

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('DocumentRepository', () => {
        it('应该保存并获取文档', async () => {
            const doc = await documentRepository.save(testUserId, null, {
                title: '测试文档',
                content: '<p>内容</p>'
            });

            expect(doc.id).toBeDefined();
            expect(doc.title).toBe('测试文档');

            const retrieved = await documentRepository.getById(testUserId, doc.id);
            expect(retrieved.title).toBe('测试文档');
        });

        it('应该获取所有文档', async () => {
            await documentRepository.save(testUserId, null, { title: 'Doc 1', content: '' });
            await documentRepository.save(testUserId, null, { title: 'Doc 2', content: '' });

            const docs = await documentRepository.getAll(testUserId);
            expect(docs.length).toBe(2);
        });

        it('应该搜索文档', async () => {
            await documentRepository.save(testUserId, null, { title: '重要文档', content: '' });
            await documentRepository.save(testUserId, null, { title: '其他', content: '' });

            const results = await documentRepository.search(testUserId, '重要');
            expect(results.length).toBe(1);
            expect(results[0].title).toBe('重要文档');
        });

        it('应该删除文档', async () => {
            const doc = await documentRepository.save(testUserId, null, { title: '待删除', content: '' });
            await documentRepository.delete(testUserId, doc.id);

            const result = await documentRepository.getById(testUserId, doc.id);
            expect(result).toBeNull();
        });

        it('应该移动文档', async () => {
            const folder = await folderRepository.create(testUserId, '目标文件夹');
            const doc = await documentRepository.save(testUserId, null, { title: '移动测试', content: '' });

            await documentRepository.move(testUserId, doc.id, folder.id);

            const moved = await documentRepository.getById(testUserId, doc.id);
            expect(moved.parentId).toBe(folder.id);
        });
    });

    describe('FolderRepository', () => {
        it('应该创建文件夹', async () => {
            const folder = await folderRepository.create(testUserId, '新文件夹');

            expect(folder.id).toBeDefined();
            expect(folder.name).toBe('新文件夹');
        });

        it('应该获取所有文件夹（包含root）', async () => {
            await folderRepository.create(testUserId, '文件夹1');

            const folders = await folderRepository.getAll(testUserId);
            expect(folders.some(f => f.id === 'root')).toBe(true);
            expect(folders.some(f => f.name === '文件夹1')).toBe(true);
        });

        it('应该更新文件夹', async () => {
            const folder = await folderRepository.create(testUserId, '旧名');
            await folderRepository.update(testUserId, folder.id, { name: '新名' });

            const folders = await folderRepository.getAll(testUserId);
            const updated = folders.find(f => f.id === folder.id);
            expect(updated.name).toBe('新名');
        });

        it('应该删除文件夹', async () => {
            const folder = await folderRepository.create(testUserId, '待删除');
            await folderRepository.delete(testUserId, folder.id);

            const folders = await folderRepository.getAll(testUserId);
            expect(folders.find(f => f.id === folder.id)).toBeUndefined();
        });
    });

    describe('VersionRepository', () => {
        it('应该保存版本', async () => {
            const doc = await documentRepository.save(testUserId, null, { title: '版本测试', content: '' });

            const version = await versionRepository.save(testUserId, doc.id, {
                content: 'v1 内容',
                title: '版本测试'
            });

            expect(version.id).toBeDefined();
            expect(version.content).toBe('v1 内容');
        });

        it('应该获取版本历史', async () => {
            const doc = await documentRepository.save(testUserId, null, { title: '多版本', content: '' });

            await versionRepository.save(testUserId, doc.id, { content: 'v1', title: '多版本' });
            await versionRepository.save(testUserId, doc.id, { content: 'v2', title: '多版本' });

            const versions = await versionRepository.getAll(testUserId, doc.id);
            expect(versions.length).toBe(2);
        });

        it('应该限制版本数量为5', async () => {
            const doc = await documentRepository.save(testUserId, null, { title: '版本限制', content: '' });

            for (let i = 1; i <= 7; i++) {
                await versionRepository.save(testUserId, doc.id, { content: `v${i}`, title: '版本限制' });
            }

            const versions = await versionRepository.getAll(testUserId, doc.id);
            expect(versions.length).toBe(5);
        });
    });
});
