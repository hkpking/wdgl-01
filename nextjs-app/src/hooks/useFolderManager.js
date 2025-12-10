import { useState, useCallback } from 'react';
import * as mockStorage from '@/lib/storage';

export const useFolderManager = (currentUser, onUpdate) => {
    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null);

    // Modal & Input States
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [folderNameInput, setFolderNameInput] = useState('');
    const [targetFolderForCreate, setTargetFolderForCreate] = useState(null); // parentId
    const [targetFolderForAction, setTargetFolderForAction] = useState(null); // folder being acted upon (rename/delete)

    // Load folders
    const loadFolders = useCallback(() => {
        if (!currentUser) return;
        const userFolders = mockStorage.getFolders(currentUser.uid);
        setFolders(userFolders);
        if (onUpdate) onUpdate();
    }, [currentUser, onUpdate]);

    // Actions
    const handleCreateFolder = () => {
        if (!folderNameInput.trim()) return;
        try {
            mockStorage.createFolder(currentUser.uid, folderNameInput, targetFolderForCreate);
            setIsCreateFolderModalOpen(false);
            setFolderNameInput('');
            loadFolders();
        } catch (error) {
            console.error(error);
            alert('创建文件夹失败');
        }
    };

    const handleRenameFolder = () => {
        if (!folderNameInput.trim() || !targetFolderForAction) return;
        try {
            mockStorage.updateFolder(currentUser.uid, targetFolderForAction.id, { name: folderNameInput });
            setIsRenameModalOpen(false);
            setTargetFolderForAction(null);
            setFolderNameInput('');
            loadFolders();
        } catch (error) {
            console.error(error);
            alert('重命名失败');
        }
    };

    const handleDeleteFolder = () => {
        if (!targetFolderForAction) return;
        if (window.confirm(`确定要删除文件夹 "${targetFolderForAction.name}" 吗？\n其中的文件将移动到"全部文档"。`)) {
            try {
                mockStorage.deleteFolder(currentUser.uid, targetFolderForAction.id);
                setTargetFolderForAction(null);
                if (selectedFolderId === targetFolderForAction.id) {
                    setSelectedFolderId(null);
                }
                loadFolders();
            } catch (error) {
                console.error(error);
                alert('删除失败');
            }
        }
    };

    // Helper to open modals
    const openCreateModal = (parentId = null) => {
        setTargetFolderForCreate(parentId);
        setFolderNameInput('');
        setIsCreateFolderModalOpen(true);
    };

    const openRenameModal = (folder) => {
        setTargetFolderForAction(folder);
        setFolderNameInput(folder.name);
        setIsRenameModalOpen(true);
    };

    const setFolderToDelete = (folder) => {
        setTargetFolderForAction(folder);
    };

    return {
        folders,
        selectedFolderId,
        setSelectedFolderId,
        loadFolders,

        // Modal States
        isCreateFolderModalOpen,
        setIsCreateFolderModalOpen,
        isRenameModalOpen,
        setIsRenameModalOpen,
        folderNameInput,
        setFolderNameInput,

        // Actions
        handleCreateFolder,
        handleRenameFolder,
        handleDeleteFolder,

        // Helpers
        openCreateModal,
        openRenameModal,
        setFolderToDelete
    };
};
