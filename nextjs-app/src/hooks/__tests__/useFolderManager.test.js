import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFolderManager } from '../useFolderManager';

// Mock mockStorage
vi.mock('@/lib/storage', () => ({
    getFolders: vi.fn(() => [
        { id: 'folder-1', name: '工作文档', parentId: null },
        { id: 'folder-2', name: '个人笔记', parentId: null },
        { id: 'folder-3', name: '项目A', parentId: 'folder-1' }
    ]),
    createFolder: vi.fn(() => ({ id: 'folder-new', name: '新文件夹' })),
    updateFolder: vi.fn(),
    deleteFolder: vi.fn()
}));

// Mock window.confirm
const originalConfirm = window.confirm;
beforeEach(() => {
    window.confirm = vi.fn(() => true);
});
afterEach(() => {
    window.confirm = originalConfirm;
    vi.clearAllMocks();
});

describe('useFolderManager', () => {
    const mockUser = { uid: 'test-user-123' };
    const mockOnUpdate = vi.fn();

    it('初始化状态正确', () => {
        const { result } = renderHook(() =>
            useFolderManager(mockUser, mockOnUpdate)
        );

        expect(result.current.folders).toEqual([]);
        expect(result.current.selectedFolderId).toBe(null);
        expect(result.current.isCreateFolderModalOpen).toBe(false);
        expect(result.current.isRenameModalOpen).toBe(false);
    });

    it('loadFolders 加载文件夹列表', async () => {
        const mockStorage = await import('@/lib/storage');

        const { result } = renderHook(() =>
            useFolderManager(mockUser, mockOnUpdate)
        );

        act(() => {
            result.current.loadFolders();
        });

        expect(mockStorage.getFolders).toHaveBeenCalledWith(mockUser.uid);
        expect(result.current.folders).toHaveLength(3);
        expect(mockOnUpdate).toHaveBeenCalled();
    });

    it('没有用户时 loadFolders 不执行', () => {
        const { result } = renderHook(() =>
            useFolderManager(null, mockOnUpdate)
        );

        act(() => {
            result.current.loadFolders();
        });

        expect(result.current.folders).toEqual([]);
    });

    it('openCreateModal 打开创建模态框', () => {
        const { result } = renderHook(() =>
            useFolderManager(mockUser, mockOnUpdate)
        );

        act(() => {
            result.current.openCreateModal('parent-id');
        });

        expect(result.current.isCreateFolderModalOpen).toBe(true);
        expect(result.current.folderNameInput).toBe('');
    });

    it('openRenameModal 打开重命名模态框并填充名称', () => {
        const { result } = renderHook(() =>
            useFolderManager(mockUser, mockOnUpdate)
        );

        const folder = { id: 'folder-1', name: '工作文档' };

        act(() => {
            result.current.openRenameModal(folder);
        });

        expect(result.current.isRenameModalOpen).toBe(true);
        expect(result.current.folderNameInput).toBe('工作文档');
    });

    it('handleCreateFolder 创建文件夹', async () => {
        const mockStorage = await import('@/lib/storage');

        const { result } = renderHook(() =>
            useFolderManager(mockUser, mockOnUpdate)
        );

        // 打开创建模态框并设置名称
        act(() => {
            result.current.openCreateModal(null);
            result.current.setFolderNameInput('新项目');
        });

        // 创建文件夹
        act(() => {
            result.current.handleCreateFolder();
        });

        expect(mockStorage.createFolder).toHaveBeenCalledWith(
            mockUser.uid,
            '新项目',
            null
        );
        expect(result.current.isCreateFolderModalOpen).toBe(false);
        expect(result.current.folderNameInput).toBe('');
    });

    it('handleCreateFolder 空名称不创建', async () => {
        const mockStorage = await import('@/lib/storage');

        const { result } = renderHook(() =>
            useFolderManager(mockUser, mockOnUpdate)
        );

        act(() => {
            result.current.openCreateModal(null);
            result.current.setFolderNameInput('   '); // 空白
        });

        act(() => {
            result.current.handleCreateFolder();
        });

        expect(mockStorage.createFolder).not.toHaveBeenCalled();
    });

    it('handleRenameFolder 重命名文件夹', async () => {
        const mockStorage = await import('@/lib/storage');

        const { result } = renderHook(() =>
            useFolderManager(mockUser, mockOnUpdate)
        );

        const folder = { id: 'folder-1', name: '工作文档' };

        act(() => {
            result.current.openRenameModal(folder);
            result.current.setFolderNameInput('已完成项目');
        });

        act(() => {
            result.current.handleRenameFolder();
        });

        expect(mockStorage.updateFolder).toHaveBeenCalledWith(
            mockUser.uid,
            'folder-1',
            { name: '已完成项目' }
        );
        expect(result.current.isRenameModalOpen).toBe(false);
    });

    it('handleDeleteFolder 删除文件夹需要确认', async () => {
        const mockStorage = await import('@/lib/storage');

        const { result } = renderHook(() =>
            useFolderManager(mockUser, mockOnUpdate)
        );

        const folder = { id: 'folder-1', name: '工作文档' };

        act(() => {
            result.current.setFolderToDelete(folder);
        });

        act(() => {
            result.current.handleDeleteFolder();
        });

        expect(window.confirm).toHaveBeenCalled();
        expect(mockStorage.deleteFolder).toHaveBeenCalledWith(
            mockUser.uid,
            'folder-1'
        );
    });

    it('handleDeleteFolder 取消确认不删除', async () => {
        window.confirm = vi.fn(() => false); // 用户点击取消

        const mockStorage = await import('@/lib/storage');

        const { result } = renderHook(() =>
            useFolderManager(mockUser, mockOnUpdate)
        );

        const folder = { id: 'folder-1', name: '工作文档' };

        act(() => {
            result.current.setFolderToDelete(folder);
        });

        act(() => {
            result.current.handleDeleteFolder();
        });

        expect(window.confirm).toHaveBeenCalled();
        expect(mockStorage.deleteFolder).not.toHaveBeenCalled();
    });

    it('setSelectedFolderId 更新选中的文件夹', () => {
        const { result } = renderHook(() =>
            useFolderManager(mockUser, mockOnUpdate)
        );

        act(() => {
            result.current.setSelectedFolderId('folder-2');
        });

        expect(result.current.selectedFolderId).toBe('folder-2');
    });
});
