import { useState, useCallback } from 'react';
import * as supabaseService from '@/lib/services/api/documentService';

export const useFolderManager = (currentUser, onUpdate) => {
    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null);

    // Modal & Input States
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [folderNameInput, setFolderNameInput] = useState('');
    const [targetFolderForCreate, setTargetFolderForCreate] = useState(null); // parentId
    const [targetFolderForAction, setTargetFolderForAction] = useState(null); // folder being acted upon (rename/delete)

    // Load folders (async)
    const loadFolders = useCallback(async () => {
        if (!currentUser?.uid) return;
        try {
            const userFolders = await supabaseService.getFolders(currentUser.uid);
            setFolders(userFolders || []);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('加载文件夹失败:', error);
        }
    }, [currentUser?.uid, onUpdate]);

    // Actions
    const handleCreateFolder = async () => {
        if (!folderNameInput.trim()) return;
        try {
            await supabaseService.createFolder(currentUser.uid, folderNameInput, targetFolderForCreate);
            setIsCreateFolderModalOpen(false);
            setFolderNameInput('');
            await loadFolders();
        } catch (error) {
            console.error(error);
            alert('创建文件夹失败');
        }
    };

    const handleRenameFolder = async () => {
        if (!folderNameInput.trim() || !targetFolderForAction) return;
        try {
            await supabaseService.updateFolder(currentUser.uid, targetFolderForAction.id, { name: folderNameInput });
            setIsRenameModalOpen(false);
            setTargetFolderForAction(null);
            setFolderNameInput('');
            await loadFolders();
        } catch (error) {
            console.error(error);
            alert('重命名失败');
        }
    };

    const handleDeleteFolder = async () => {
        if (!targetFolderForAction) return;
        if (window.confirm(`确定要删除文件夹 "${targetFolderForAction.name}" 吗？\n其中的文件将移动到"全部文档"。`)) {
            try {
                await supabaseService.deleteFolder(currentUser.uid, targetFolderForAction.id);
                setTargetFolderForAction(null);
                if (selectedFolderId === targetFolderForAction.id) {
                    setSelectedFolderId(null);
                }
                await loadFolders();
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
