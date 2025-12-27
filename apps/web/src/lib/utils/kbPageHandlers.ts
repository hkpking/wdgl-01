/**
 * kbPageHandlers - 知识库页面业务逻辑处理
 * 
 * 从 KnowledgeBasePage 拆分出的处理函数
 */

import { DOC_STATUS } from '@/lib/constants';
import { importWordDoc } from '@/lib/utils/ImportHandler';
import { addRecentItem } from '@/components/shared/RecentDocs';
import * as kbService from '@/lib/services/kbService';
import { getKBDocument } from '@/lib/services/api/documentService';
import {
    createSpreadsheet,
    getSpreadsheet,
    updateSpreadsheet,
    deleteSpreadsheet,
    moveSpreadsheet,
    type Spreadsheet
} from '@/lib/services/spreadsheetService';
import type { KBPageState } from '@/hooks/useKBPageState';

export interface KBPageHandlers {
    handleCreateDoc: () => Promise<void>;
    handleCreateSpreadsheet: () => Promise<void>;
    handleCreateFlowchart: () => void;
    handleDeleteDoc: (docId: string, e: React.MouseEvent) => Promise<void>;
    handleDeleteSpreadsheet: (sheetId: string, e: React.MouseEvent | { stopPropagation: () => void }) => Promise<void>;
    handleCreateFolder: (parentId?: string) => Promise<void>;
    handleDeleteFolder: (folderId: string) => Promise<void>;
    handleRenameItem: (id: string, newName: string | null, type: 'folder' | 'document' | 'spreadsheet') => Promise<void>;
    handleMoveItem: (itemId: string, itemType: string, targetFolderId: string | null) => Promise<void>;
    handleMenuClick: (e: React.MouseEvent, item: any, type: 'folder' | 'document' | 'spreadsheet' | 'create-folder') => void;
    handleImport: (file: File) => Promise<void>;
    handleInsertBlock: (type: string, meta?: any) => void;
    openDoc: (docId: string, preloadedDoc?: any) => void;
    openSheet: (sheetId: string, preloadedSheet?: Spreadsheet) => Promise<void>;
    openFlowchart: (docId: string, preloadedDoc?: any) => Promise<void>;
    closeDoc: () => void;
    closeSheet: () => void;
    closeFlowchart: () => void;
    toggleFolderExpand: (folderId: string) => void;
    formatDate: (dateStr: string) => string;
}

export function createKBPageHandlers(state: KBPageState): KBPageHandlers {
    const {
        teamId,
        kbId,
        currentUser,
        folders,
        allContent,
        selectedFolderId,
        activeDocId,
        activeSheetId,
        hasChanges,
        sheetHasChanges,
        docTitle,
        editorInstance,
        sheetTitle,
        sheetInitialData,
        sheetDataRef,
        sheetInitializedRef,
        saveDocument,
        deleteDocument,
        invalidateKBContent,
        handleOptimisticUpdate,
        setActiveDocId,
        setDocTitle,
        setDocContent,
        setHasChanges,
        setEditingType,
        setActiveSheetId,
        setSheetTitle,
        setSheetInitialData,
        setSheetHasChanges,
        setFolders,
        setExpandedFolders,
        setContextMenu,
        setRenamingItemId,
        // 流程图编辑状态
        activeFlowchartId,
        flowchartHasChanges,
        setActiveFlowchartId,
        setFlowchartData,
        setFlowchartHasChanges,
    } = state;

    // 创建文档
    const handleCreateDoc = async () => {
        if (!currentUser?.uid) return;
        try {
            const newDoc = {
                title: '无标题文档',
                content: '',
                status: DOC_STATUS.DRAFT,
                contentType: 'html',
                folderId: selectedFolderId,
                knowledgeBaseId: kbId,
                teamId: teamId,
            };
            const savedDoc = await saveDocument(currentUser.uid, null, newDoc);
            if (savedDoc?.id) {
                invalidateKBContent(kbId);
                openDoc(savedDoc.id, savedDoc);
            }
        } catch (error) {
            console.error('创建文档失败:', error);
            alert('创建文档失败');
        }
    };

    // 创建表格
    const handleCreateSpreadsheet = async () => {
        if (!currentUser?.uid) return;
        try {
            const sheet = await createSpreadsheet(currentUser.uid, {
                title: '无标题表格',
                teamId: teamId,
                knowledgeBaseId: kbId,
                folderId: selectedFolderId || undefined
            });
            if (sheet?.id) {
                invalidateKBContent(kbId);
                await openSheet(sheet.id, sheet);
            }
        } catch (error) {
            console.error('创建表格失败:', error);
            alert('创建表格失败');
        }
    };

    // 创建流程图 - 打开 DrawioEditor 编辑器
    const handleCreateFlowchart = () => {
        // 流程图的创建由 KnowledgeBasePage 组件的状态管理
        // 这里只是触发一个事件，实际逻辑在组件中处理
        const event = new CustomEvent('openFlowchartEditor', {
            detail: { folderId: selectedFolderId }
        });
        window.dispatchEvent(event);
    };

    // 删除文档
    const handleDeleteDoc = async (docId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('确定要删除此文档吗？')) return;
        const success = await deleteDocument(currentUser.uid, docId);
        if (success) {
            invalidateKBContent(kbId);
            if (activeDocId === docId) {
                const url = new URL(window.location.href);
                url.searchParams.delete('doc');
                window.history.pushState({}, '', url.toString());
                setActiveDocId(null);
                setDocTitle('');
                setDocContent('');
                setHasChanges(false);
                setEditingType('none');
            }
        }
    };

    // 删除表格
    const handleDeleteSpreadsheet = async (sheetId: string, e: React.MouseEvent | { stopPropagation: () => void }) => {
        if (e?.stopPropagation) e.stopPropagation();
        if (!confirm('确定要删除此表格吗？')) return;
        const success = await deleteSpreadsheet(sheetId);
        if (success) {
            invalidateKBContent(kbId);
            if (activeSheetId === sheetId) {
                closeSheet();
            }
        }
    };

    // 创建文件夹
    const handleCreateFolder = async (parentId?: string) => {
        const folderName = prompt('请输入文件夹名称：');
        if (!folderName?.trim()) return;
        const folder = await kbService.createKBFolder(kbId, folderName.trim(), parentId || selectedFolderId || undefined);
        if (folder) {
            setFolders(prev => [...prev, folder]);
        }
    };

    // 删除文件夹
    const handleDeleteFolder = async (folderId: string) => {
        if (!confirm('确定要删除此文件夹吗？文件夹下的文档将移到根目录。')) return;
        const success = await kbService.deleteKBFolder(folderId);
        if (success) {
            setFolders(prev => prev.filter(f => f.id !== folderId));
            const docsInFolder = (allContent || []).filter(d => d.folderId === folderId);
            for (const doc of docsInFolder) {
                if (doc.type === 'document') {
                    await saveDocument(currentUser.uid, doc.id, { folderId: null });
                } else if (doc.type === 'spreadsheet') {
                    await updateSpreadsheet(doc.id, { folderId: null });
                }
            }
            invalidateKBContent(kbId);
        }
    };

    // 重命名项目
    const handleRenameItem = async (id: string, newName: string | null, type: 'folder' | 'document' | 'spreadsheet') => {
        if (newName === null) {
            setRenamingItemId(null);
            return;
        }

        handleOptimisticUpdate(id, newName);

        if (activeDocId === id && type === 'document') {
            setDocTitle(newName);
        } else if (activeSheetId === id && type === 'spreadsheet') {
            setSheetTitle(newName);
        } else if (activeFlowchartId === id && type === 'document') {
            // 流程图也是 document 类型，同步标题到编辑器
            setFlowchartData((prev: { id: string; title: string; content?: string; metadata?: any } | null) => prev ? { ...prev, title: newName } : prev);
        }

        let success = false;
        if (type === 'folder') {
            const updated = await kbService.updateKBFolder(id, { name: newName });
            success = !!updated;
        } else if (type === 'spreadsheet') {
            const updated = await updateSpreadsheet(id, { title: newName });
            success = !!updated;
        } else {
            const updated = await saveDocument(currentUser.uid, id, { title: newName });
            success = !!updated;
        }

        if (success) {
            invalidateKBContent(kbId);
            if (type === 'folder') {
                setFolders(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
            }
        } else {
            invalidateKBContent(kbId);
            if (type === 'folder') {
                const foldersData = await kbService.getKBFolders(kbId);
                setFolders(foldersData);
            }
        }
        setRenamingItemId(null);
    };

    // 移动项目
    const handleMoveItem = async (itemId: string, itemType: string, targetFolderId: string | null) => {
        if (itemType === 'document') {
            const updated = await saveDocument(currentUser.uid, itemId, { folderId: targetFolderId });
            if (updated) {
                invalidateKBContent(kbId);
            }
        } else if (itemType === 'folder') {
            const updated = await kbService.moveKBFolder(itemId, targetFolderId);
            if (updated) {
                setFolders(prev => prev.map(f => f.id === itemId ? { ...f, parentId: targetFolderId } : f));
            }
        } else if (itemType === 'spreadsheet') {
            const success = await moveSpreadsheet(itemId, targetFolderId);
            if (success) {
                invalidateKBContent(kbId);
            }
        }
    };

    // 菜单点击
    const handleMenuClick = (e: React.MouseEvent, item: any, type: 'folder' | 'document' | 'spreadsheet' | 'create-folder') => {
        if (type === 'create-folder') {
            handleCreateFolder();
            return;
        }
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            type,
            item
        });
    };

    // 导入 Word
    const handleImport = async (file: File) => {
        try {
            const html = await importWordDoc(file) as string;
            if (editorInstance) {
                editorInstance.commands.setContent(html);
            } else {
                setDocContent(html);
            }
            if (!docTitle || docTitle === '无标题文档') {
                const fileName = file.name.replace(/\.[^/.]+$/, '');
                setDocTitle(fileName);
            }
            setHasChanges(true);
            alert('导入成功！');
        } catch (error) {
            console.error('[导入] 失败:', error);
            alert('导入失败，请确保文件是有效的 Word 文档');
        }
    };

    // 插入块
    const handleInsertBlock = (type: string, meta?: any) => {
        if (editorInstance) {
            if (type === 'flowchart') {
                editorInstance.chain().focus().insertContent({
                    type: 'flowchart',
                    attrs: { xml: null, previewUrl: null, width: '100%', height: '500px' }
                }).run();
            } else if (type === 'image' && meta?.src) {
                editorInstance.chain().focus().setImage({ src: meta.src }).run();
            } else if (type === 'table' && meta?.rows && meta?.cols) {
                editorInstance.chain().focus().insertTable({
                    rows: meta.rows,
                    cols: meta.cols,
                    withHeaderRow: true
                }).run();
            }
        }
    };

    // 打开文档
    const openDoc = (docId: string, preloadedDoc?: any) => {
        if (activeDocId && activeDocId !== docId && hasChanges) {
            if (!confirm('当前文档有未保存的更改，确定要切换吗？')) return;
        }
        if (activeSheetId && sheetHasChanges) {
            if (!confirm('当前表格有未保存的更改，确定要切换吗？')) return;
        }

        const url = new URL(window.location.href);
        url.searchParams.set('doc', docId);
        url.searchParams.delete('sheet');
        window.history.pushState({}, '', url.toString());

        setActiveDocId(docId);
        setHasChanges(false);
        setEditingType('document');
        setActiveSheetId(null);
        setSheetHasChanges(false);

        const doc = preloadedDoc || (allContent || []).find(d => d.id === docId);
        if (doc) {
            addRecentItem({
                id: docId,
                title: doc.title,
                type: 'document',
                teamId,
                kbId,
                path: `/teams/${teamId}/kb/${kbId}?doc=${docId}`
            });
        }
    };

    // 打开表格
    const openSheet = async (sheetId: string, preloadedSheet?: Spreadsheet) => {
        if (activeDocId && hasChanges) {
            if (!confirm('当前文档有未保存的更改，确定要切换吗？')) return;
        }
        if (activeSheetId && activeSheetId !== sheetId && sheetHasChanges) {
            if (!confirm('当前表格有未保存的更改，确定要切换吗？')) return;
        }

        const url = new URL(window.location.href);
        url.searchParams.set('sheet', sheetId);
        url.searchParams.delete('doc');
        window.history.pushState({}, '', url.toString());

        if (preloadedSheet) {
            setActiveSheetId(sheetId);
            setSheetTitle(preloadedSheet.title);
            setSheetInitialData(preloadedSheet.data || []);
            sheetDataRef.current = preloadedSheet.data || [];
            setSheetHasChanges(false);
            setEditingType('spreadsheet');
            setActiveDocId(null);

            setTimeout(() => {
                sheetInitializedRef.current = true;
            }, 500);
        } else {
            const sheet = await getSpreadsheet(sheetId);
            if (sheet) {
                sheetInitializedRef.current = false;
                setActiveSheetId(sheetId);
                setSheetTitle(sheet.title);
                setSheetInitialData(sheet.data || []);
                sheetDataRef.current = sheet.data || [];
                setSheetHasChanges(false);
                setEditingType('spreadsheet');
                setActiveDocId(null);

                setTimeout(() => {
                    sheetInitializedRef.current = true;
                }, 500);
            }
        }
        setActiveDocId(null);
        setHasChanges(false);

        const sheet = preloadedSheet || (allContent || []).find(s => s.id === sheetId);
        if (sheet) {
            addRecentItem({
                id: sheetId,
                title: sheet.title,
                type: 'spreadsheet',
                teamId,
                kbId,
                path: `/teams/${teamId}/kb/${kbId}?sheet=${sheetId}`
            });
        }
    };

    // 关闭文档
    const closeDoc = () => {
        if (hasChanges && !confirm('您有未保存的更改，确定要关闭吗？')) return;
        const url = new URL(window.location.href);
        url.searchParams.delete('doc');
        window.history.pushState({}, '', url.toString());
        setActiveDocId(null);
        setDocTitle('');
        setDocContent('');
        setHasChanges(false);
        setEditingType('none');
    };

    // 关闭表格
    const closeSheet = () => {
        if (sheetHasChanges && !confirm('您有未保存的更改，确定要关闭吗？')) return;
        const url = new URL(window.location.href);
        url.searchParams.delete('sheet');
        window.history.pushState({}, '', url.toString());
        setActiveSheetId(null);
        setSheetTitle('');
        setSheetInitialData([]);
        sheetDataRef.current = [];
        setSheetHasChanges(false);
        setEditingType('none');
    };

    // 打开流程图
    const openFlowchart = async (docId: string, preloadedDoc?: any) => {
        if (activeDocId && activeDocId !== docId && hasChanges) {
            if (!confirm('当前文档有未保存的更改，确定要切换吗？')) return;
        }
        if (activeSheetId && sheetHasChanges) {
            if (!confirm('当前表格有未保存的更改，确定要切换吗？')) return;
        }
        if (activeFlowchartId && activeFlowchartId !== docId && flowchartHasChanges) {
            if (!confirm('当前流程图有未保存的更改，确定要切换吗？')) return;
        }

        const url = new URL(window.location.href);
        url.searchParams.set('flowchart', docId);
        url.searchParams.delete('doc');
        url.searchParams.delete('sheet');
        window.history.pushState({}, '', url.toString());

        // 先清空旧数据，避免显示旧内容
        setFlowchartData(null);
        setFlowchartHasChanges(false);
        setEditingType('flowchart');
        setActiveDocId(null);
        setActiveSheetId(null);

        // 从数据库加载完整文档内容（视图不包含 content 字段）
        try {
            console.log('[openFlowchart] 开始加载文档:', docId);
            const fullDoc = await getKBDocument(docId);
            console.log('[openFlowchart] 加载结果:', fullDoc?.title, '内容长度:', fullDoc?.content?.length);

            if (fullDoc) {
                // 先设置数据，再设置 activeId 触发渲染
                setFlowchartData({
                    id: docId,
                    title: fullDoc.title,
                    content: fullDoc.content,
                    metadata: (fullDoc as any).metadata
                });
                setActiveFlowchartId(docId);
            } else {
                // 回退到预加载数据
                const doc = preloadedDoc || (allContent || []).find(d => d.id === docId);
                if (doc) {
                    setFlowchartData({
                        id: docId,
                        title: doc.title,
                        content: doc.content || '',
                        metadata: doc.metadata
                    });
                    setActiveFlowchartId(docId);
                }
            }
        } catch (error) {
            console.error('加载流程图失败:', error);
            // 回退到预加载数据
            const doc = preloadedDoc || (allContent || []).find(d => d.id === docId);
            if (doc) {
                setFlowchartData({
                    id: docId,
                    title: doc.title,
                    content: doc.content || '',
                    metadata: doc.metadata
                });
                setActiveFlowchartId(docId);
            }
        }
    };

    // 关闭流程图
    const closeFlowchart = () => {
        if (flowchartHasChanges && !confirm('您有未保存的更改，确定要关闭吗？')) return;
        const url = new URL(window.location.href);
        url.searchParams.delete('flowchart');
        window.history.pushState({}, '', url.toString());
        setActiveFlowchartId(null);
        setFlowchartData(null);
        setFlowchartHasChanges(false);
        setEditingType('none');
    };

    // 切换文件夹展开
    const toggleFolderExpand = (folderId: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(folderId)) next.delete(folderId);
            else next.add(folderId);
            return next;
        });
    };

    // 格式化日期
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        if (isToday) {
            return `今天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
        }
        return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    };

    return {
        handleCreateDoc,
        handleCreateSpreadsheet,
        handleCreateFlowchart,
        handleDeleteDoc,
        handleDeleteSpreadsheet,
        handleCreateFolder,
        handleDeleteFolder,
        handleRenameItem,
        handleMoveItem,
        handleMenuClick,
        handleImport,
        handleInsertBlock,
        openDoc,
        openSheet,
        openFlowchart,
        closeDoc,
        closeSheet,
        closeFlowchart,
        toggleFolderExpand,
        formatDate,
    };
}
