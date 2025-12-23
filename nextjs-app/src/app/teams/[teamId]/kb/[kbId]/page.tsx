"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    Plus, FolderPlus, FileText, ChevronRight, ChevronDown, ChevronLeft,
    Loader2, Trash2, Clock, Search, Settings, Star, Share2, Save, PanelLeftClose, PanelLeft, Sparkles
} from 'lucide-react';
import { useStorage } from '@/contexts/StorageContext';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { useCollaboration } from '@/hooks/useCollaboration';
import { useFolderManager } from '@/hooks/useFolderManager';
import { useKBContent, useInvalidateKBContent } from '@/hooks/useKBContent';
import AppSidebar from '@/components/layout/AppSidebar';
import SearchModal from '@/components/shared/SearchModal';
import CollaborationStatus from '@/components/shared/CollaborationStatus';
import CollaborationToast, { useCollaborationToast } from '@/components/shared/CollaborationToast';
import * as kbService from '@/lib/services/kbService';
import * as teamService from '@/lib/services/teamService';
import { createSpreadsheet, getSpreadsheet, updateSpreadsheet, deleteSpreadsheet, moveSpreadsheet, type Spreadsheet } from '@/lib/services/spreadsheetService';
import type { KnowledgeBase, KBFolder, TeamMemberRole } from '@/types/team';
import { ContentItem } from '@/types/content';
import { useQueryClient } from '@tanstack/react-query';
import { contentKeys } from '@/hooks/useKBContent';
import { getKBPermissions } from '@/types/team';
import { DOC_STATUS } from '@/lib/constants';
import { importWordDoc } from '@/lib/utils/ImportHandler';
import FolderContextMenu from '@/components/FolderContextMenu';
import { addRecentItem } from '@/components/shared/RecentDocs';
import KBHomePanel from '@/components/KnowledgeBase/KBHomePanel';
import DocOutlinePanel, { OutlineToggle } from '@/components/shared/DocOutlinePanel';
import FocusMode, { FocusModeToggle, useFocusMode } from '@/components/shared/FocusMode';


// 动态导入统一编辑器模块
const DocumentEditorModule = dynamic(() => import('@/components/Editor/DocumentEditorModule'), { ssr: false });
const SpreadsheetEditorModule = dynamic(() => import('@/components/Spreadsheet/SpreadsheetEditorModule'), { ssr: false });
import { type SpreadsheetEditorHandle } from '@/components/Spreadsheet/SpreadsheetEditor';

interface Document {
    id: string;
    title: string;
    content: string;
    status: string;
    folderId: string | null;
    knowledgeBaseId?: string | null;
    teamId?: string | null;
    authorId?: string | null;
    createdAt: string;
    updatedAt: string;
}

export default function KnowledgeBasePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const teamId = params.teamId as string;
    const kbId = params.kbId as string;
    const storageContext = useStorage() as any;
    const { currentUser, loading: authLoading, saveDocument, getDocument, deleteDocument, getKBDocuments } = storageContext;
    const { isOpen: isSearchOpen, openSearch, closeSearch } = useGlobalSearch();

    // 文件夹管理（用于 AppSidebar）
    const folderManager = useFolderManager(currentUser) as any;
    const { folders: appFolders, selectedFolderId: appSelectedFolderId, setSelectedFolderId: setAppSelectedFolderId, loadFolders } = folderManager;

    // 数据状态
    const [kb, setKb] = useState<KnowledgeBase | null>(null);
    const [folders, setFolders] = useState<KBFolder[]>([]);
    const [userRole, setUserRole] = useState<TeamMemberRole | null>(null);
    const [isSysLoading, setIsSysLoading] = useState(true);

    // React Query Hooks
    const { data: allContent, isLoading: isContentLoading } = useKBContent({
        knowledgeBaseId: kbId,
        folderId: undefined, // explicitly undefined to fetch all items; ensures cache key matches handleOptimisticUpdate
    });
    // 修正: Hook 定义是 folderId?: string | null。如果传 null，会过滤 folder_id IS NULL (只取根目录)。如果不传 (undefined)，则取全部。
    // 我们需要全部用于构建树。所以这里不传 folderId。
    // 但是 useKBContent 的 TS 定义是 interface options。
    // 我们修改一下调用：

    const queryClient = useQueryClient();
    const invalidateKBContent = useInvalidateKBContent();

    // 乐观更新标题 helper
    const handleOptimisticUpdate = (id: string, newTitle: string) => {
        // 更新 allContent 缓存
        queryClient.setQueryData(
            contentKeys.list({ kbId, folderId: undefined }), // match the key used in useKBContent
            (old: ContentItem[] | undefined) => {
                if (!old) return old;
                return old.map(item => item.id === id ? { ...item, title: newTitle } : item);
            }
        );
    };

    // UI 状态
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreatingDoc, setIsCreatingDoc] = useState(false);

    // 菜单状态
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        type: 'folder' | 'document' | 'spreadsheet';
        item: any;
    } | null>(null);
    const [renamingItem, setRenamingItem] = useState<{ id: string; type: 'folder' | 'document' | 'spreadsheet'; name: string } | null>(null);
    const [createSubfolderId, setCreateSubfolderId] = useState<string | null>(null);

    // 编辑器状态（部分为遗留状态，用于导入/插入功能）
    const [activeDocId, setActiveDocId] = useState<string | null>(null);
    const [docTitle, setDocTitle] = useState(''); // 遗留：用于导入时设置标题
    const [docContent, setDocContent] = useState(''); // 遗留：用于导入时设置内容
    const [editorInstance, setEditorInstance] = useState<any>(null); // 遗留：用于导入/插入功能
    const [hasChanges, setHasChanges] = useState(false);
    const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
    const [isMagicCommandOpen, setIsMagicCommandOpen] = useState(false);
    const [isOutlinePanelOpen, setIsOutlinePanelOpen] = useState(true);
    const focusMode = useFocusMode();

    const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([]); // 兼容遗留类型，实际使用 allContent

    const [activeSheetId, setActiveSheetId] = useState<string | null>(null);
    const [sheetTitle, setSheetTitle] = useState('');
    const [sheetInitialData, setSheetInitialData] = useState<any[]>([]);
    const sheetDataRef = React.useRef<any[]>([]);
    const [sheetHasChanges, setSheetHasChanges] = useState(false);
    const [sheetSaving, setSheetSaving] = useState(false);
    const [isSheetAIPanelOpen, setIsSheetAIPanelOpen] = useState(false);
    const spreadsheetEditorRef = React.useRef<SpreadsheetEditorHandle>(null);
    const sheetInitializedRef = React.useRef(false);

    // 当前编辑类型
    type EditingType = 'none' | 'document' | 'spreadsheet';
    const [editingType, setEditingType] = useState<EditingType>('none');


    const permissions = getKBPermissions(userRole);

    // 协作功能
    const collaborationUser = useMemo(() => currentUser ? {
        id: currentUser.uid,
        name: currentUser.displayName || currentUser.email || '匿名用户',
    } : null, [currentUser?.uid, currentUser?.displayName, currentUser?.email]);

    const { toasts, dismissToast, notifyUserJoined, notifyUserLeft } = useCollaborationToast();

    const {
        ydoc, provider, isConnected, connectedUsers, reconnect,
    } = useCollaboration(activeDocId || '', collaborationUser as any, {
        onUserJoined: notifyUserJoined,
        onUserLeft: notifyUserLeft,
    }) as any;

    const collaboration = useMemo(() => {
        if (!activeDocId || !ydoc || !provider || !collaborationUser || !isConnected) return undefined;
        try {
            if (typeof ydoc.getText !== 'function') return undefined;
        } catch { return undefined; }
        return { ydoc, provider, user: collaborationUser };
    }, [activeDocId, ydoc, provider, collaborationUser, isConnected]);



    // 从 URL 获取活动文档或表格
    useEffect(() => {
        const docId = searchParams.get('doc');
        const sheetId = searchParams.get('sheet');
        if (docId && docId !== activeDocId) {
            loadDocument(docId);
            setEditingType('document');
        } else if (sheetId && sheetId !== activeSheetId) {
            loadSpreadsheet(sheetId);
        }
    }, [searchParams]);

    // 处理 URL action 参数（从新建弹窗跳转过来）
    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'new-doc' && currentUser?.uid && !isCreatingDoc) {
            // 清除 action 参数
            const url = new URL(window.location.href);
            url.searchParams.delete('action');
            window.history.replaceState({}, '', url.toString());
            // 创建文档
            handleCreateDoc();
        } else if (action === 'new-sheet' && currentUser?.uid) {
            // 清除 action 参数
            const url = new URL(window.location.href);
            url.searchParams.delete('action');
            window.history.replaceState({}, '', url.toString());
            // 创建表格并跳转
            handleCreateSpreadsheet();
        }
    }, [searchParams, currentUser?.uid, teamId, kbId]);

    // 加载元数据 (KB info, Folders, Role)
    useEffect(() => {
        if (kbId && teamId && currentUser?.uid) {
            loadMetadata();
        }
    }, [kbId, teamId, currentUser?.uid]);

    const loadMetadata = async () => {
        if (!kbId || !teamId || !currentUser?.uid) return;
        setIsSysLoading(true);
        try {
            const [kbData, foldersData, role] = await Promise.all([
                kbService.getKnowledgeBase(kbId),
                kbService.getKBFolders(kbId),
                teamService.getUserRoleInTeam(teamId, currentUser.uid)
            ]);
            setKb(kbData);
            setFolders(foldersData);
            setUserRole(role);
        } catch (error) {
            console.error('加载知识库数据失败:', error);
        } finally {
            setIsSysLoading(false);
        }
    };

    // 加载单个文档 - 统一使用 documents 表
    // 加载文档 - DocumentEditorModule 会根据 documentId 自动加载
    const loadDocument = (docId: string) => {
        setActiveDocId(docId);
        setHasChanges(false);
    };

    // NOTE: 保存逻辑现在由 DocumentEditorModule 内部处理
    // 通过 onSaveSuccess 回调同步列表更新

    // 导入 Word 文档
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

    // 插入块（流程图、图片、表格等）
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

    // 创建文档 - 统一使用 documents 表，通过 knowledgeBaseId 关联到知识库
    const handleCreateDoc = async () => {
        if (!currentUser?.uid || isCreatingDoc) return;
        setIsCreatingDoc(true);
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
                // 刷新列表
                invalidateKBContent(kbId);
                // 打开文档
                openDoc(savedDoc.id, savedDoc);
            }
        } catch (error) {
            console.error('创建文档失败:', error);
            alert('创建文档失败');
        } finally {
            setIsCreatingDoc(false);
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
                // 刷新列表
                invalidateKBContent(kbId);
                // 在本页面打开表格
                openSheet(sheet.id, sheet);
            }
        } catch (error) {
            console.error('创建表格失败:', error);
            alert('创建表格失败');
        }
    };

    // 打开表格
    const openSheet = async (sheetId: string, preloadedSheet?: Spreadsheet) => {
        // 边界情况：检查当前文档是否有未保存更改
        if (activeDocId && hasChanges) {
            if (!confirm('当前文档有未保存的更改，确定要切换吗？')) return;
        }
        // 边界情况：检查当前表格是否有未保存更改
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
            await loadSpreadsheet(sheetId);
        }
        // 关闭文档编辑
        setActiveDocId(null);
        setHasChanges(false);

        // 记录最近访问
        const sheet = spreadsheets.find(s => s.id === sheetId);
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

    // 加载表格
    const loadSpreadsheet = async (sheetId: string) => {
        const sheet = await getSpreadsheet(sheetId);
        if (sheet) {
            // 🔍 加载诊断
            const firstSheet = sheet.data?.[0];
            let nonNullCount = 0;
            if (firstSheet?.data) {
                for (const row of firstSheet.data) {
                    if (row) {
                        for (const cell of row) {
                            if (cell !== null && cell !== undefined) nonNullCount++;
                        }
                    }
                }
            }
            console.log('[知识库表格] 加载诊断:', {
                id: sheet.id,
                title: sheet.title,
                dataLength: sheet.data?.length,
                firstSheetKeys: firstSheet ? Object.keys(firstSheet) : [],
                dataRows: firstSheet?.data?.length || 0,
                nonNullCellCount: nonNullCount,
                sampleCell: JSON.stringify(firstSheet?.data?.[0]?.[0])?.slice(0, 80)
            });

            // 重置初始化标记
            sheetInitializedRef.current = false;
            setActiveSheetId(sheetId);
            setSheetTitle(sheet.title);
            setSheetInitialData(sheet.data || []);
            sheetDataRef.current = sheet.data || [];
            setSheetHasChanges(false);
            setEditingType('spreadsheet');
            // 关闭文档编辑
            setActiveDocId(null);

            // 延迟标记初始化完成，让 FortuneSheet 有时间触发初始化事件
            setTimeout(() => {
                sheetInitializedRef.current = true;
                console.log('[知识库表格] 初始化完成，开始跟踪变更');
            }, 500);
        }
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

    // 打开文档
    const openDoc = (docId: string, preloadedDoc?: Document) => {
        // 边界情况：检查当前文档是否有未保存更改
        if (activeDocId && activeDocId !== docId && hasChanges) {
            if (!confirm('当前文档有未保存的更改，确定要切换吗？')) return;
        }
        // 边界情况：检查当前表格是否有未保存更改
        if (activeSheetId && sheetHasChanges) {
            if (!confirm('当前表格有未保存的更改，确定要切换吗？')) return;
        }

        const url = new URL(window.location.href);
        url.searchParams.set('doc', docId);
        url.searchParams.delete('sheet');
        window.history.pushState({}, '', url.toString());
        loadDocument(docId);
        setEditingType('document');
        // 关闭表格编辑
        setActiveSheetId(null);
        setSheetHasChanges(false);

        // 记录最近访问
        // allContent 可能没有 content 字段，但 RecentDocs 只需要 title 等元数据
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

    // 删除文档
    const handleDeleteDoc = async (docId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('确定要删除此文档吗？')) return;
        const success = await deleteDocument(currentUser.uid, docId);
        if (success) {
            invalidateKBContent(kbId);
            // 如果删除的是当前打开的文档，直接清空右侧（无需再次确认）
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
        if (e && e.stopPropagation) e.stopPropagation();
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

    // State for inline renaming
    const [renamingItemId, setRenamingItemIdState] = useState<string | null>(null);

    // 统一重命名处理 (Inline)
    const handleRenameItem = async (id: string, newName: string | null, type: 'folder' | 'document' | 'spreadsheet') => {
        // null implies cancel or no change
        if (newName === null) {
            setRenamingItemIdState(null);
            return;
        }

        // 1. 立即进行乐观更新 (Optimistic Update)
        handleOptimisticUpdate(id, newName);

        // 2. 如果正在编辑该项，同步更新编辑器标题
        if (activeDocId === id && type === 'document') {
            setDocTitle(newName);
        } else if (activeSheetId === id && type === 'spreadsheet') {
            setSheetTitle(newName);
            // 确保 SpreadSheetEditorModule 也能收到更新 (通过 useEffect监听 props)
        }

        // 3. 执行异步保存
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

        // 4. 保存结果处理
        if (success) {
            invalidateKBContent(kbId);
            // 还需要刷新文件夹列表，因文件夹结构可能变化 (虽然 optimistic update 处理了名字，但 tree structure cache 也许不同)
            // kbService is separate? No, folders is separate state `folders`.
            // We should also optimistically update `folders` state if it's a folder.
            if (type === 'folder') {
                setFolders(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
            }
        } else {
            // 回滚/失效
            invalidateKBContent(kbId);
            if (type === 'folder') {
                // Relfetch folders
                const foldersData = await kbService.getKBFolders(kbId);
                setFolders(foldersData);
            }
        }
        setRenamingItemIdState(null);
    };

    // 菜单点击处理
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

    // Removed handleRenameFolder and handleRenameDocument as they are now consolidated above.
    // Keeping handleDeleteFolder below.

    // 删除文件夹
    const handleDeleteFolder = async (folderId: string) => {
        if (!confirm('确定要删除此文件夹吗？文件夹下的文档将移到根目录。')) return;
        const success = await kbService.deleteKBFolder(folderId);
        if (success) {
            setFolders(prev => prev.filter(f => f.id !== folderId));
            // 将该文件夹下的文档移到根目录 - 统一使用 documents 表
            // 现在的逻辑：后端删除文件夹时应该处理这些，或者前端单独处理。
            // 使用 allContent 过滤
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

    // 移动项目（拖拽）
    const handleMoveItem = async (itemId: string, itemType: string, targetFolderId: string | null) => {
        if (itemType === 'document') {
            // 统一使用 documents 表
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

    // 切换文件夹展开
    const toggleFolderExpand = (folderId: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(folderId)) next.delete(folderId);
            else next.add(folderId);
            return next;
        });
    };

    // 格式化时间
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        if (isToday) {
            return `今天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
        }
        return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    };

    // 构建文件夹树
    const buildTree = (parentId: string | null = null): KBFolder[] => {
        return folders.filter(f => f.parentId === parentId);
    };

    // React Query 已经返回统一列表
    const allItems = useMemo(() => {
        return allContent || [];
    }, [allContent]);

    // 最近更新的文档和表格
    const recentDocs = [...allItems]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 10);

    if (authLoading || isSysLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!kb) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">知识库不存在或无权访问</p>
            </div>
        );
    }

    // 渲染文件夹节点
    const renderFolderNode = (folder: KBFolder, level: number = 0) => {
        const children = buildTree(folder.id);
        const hasChildren = children.length > 0;
        const isExpanded = expandedFolders.has(folder.id);
        const isSelected = selectedFolderId === folder.id;
        const folderItems = allItems.filter(d => d.folderId === folder.id);

        return (
            <div key={folder.id}>
                <div
                    className={`flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer group ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                        }`}
                    style={{ paddingLeft: `${level * 12 + 8}px` }}
                >
                    <button onClick={() => (hasChildren || folderItems.length > 0) && toggleFolderExpand(folder.id)} className="p-0.5">
                        {(hasChildren || folderItems.length > 0) ? (
                            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                        ) : (
                            <span className="w-3.5" />
                        )}
                    </button>
                    <button
                        onClick={() => setSelectedFolderId(folder.id)}
                        className="flex-1 flex items-center gap-2 text-sm text-left"
                    >
                        📁
                        <span className="truncate">{folder.name}</span>
                    </button>
                </div>
                {isExpanded && (
                    <>
                        {children.map(child => renderFolderNode(child, level + 1))}
                        {folderItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => item.type === 'spreadsheet' ? openSheet(item.id) : openDoc(item.id)}
                                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer group ${(item.type === 'document' && activeDocId === item.id) || (item.type === 'spreadsheet' && activeSheetId === item.id)
                                    ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                style={{ paddingLeft: `${(level + 1) * 12 + 24}px` }}
                            >
                                {item.type === 'spreadsheet' ? (
                                    <span className="text-green-500 mr-0.5 text-xs">📊</span> // 简单图标区分
                                ) : (
                                    <FileText size={12} className="text-gray-400 flex-shrink-0" />
                                )}
                                <span className="truncate flex-1">{item.title}</span>
                            </div>
                        ))}
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* 应用侧边栏 - 知识库模式 */}
            {!sidebarCollapsed && (
                <AppSidebar
                    currentUser={currentUser}
                    onLogout={() => router.push('/login')}
                    onCreateDoc={handleCreateDoc}
                    onUpload={() => { }}
                    onOpenSearch={openSearch}
                    mode="knowledgeBase"
                    kb={kb}
                    kbFolders={folders}
                    kbDocuments={allItems}
                    activeKBDocId={activeDocId || activeSheetId}
                    selectedFolderId={selectedFolderId}
                    onSelectFolder={setSelectedFolderId}
                    onSelectKBDoc={(id) => {
                        // 判断是文档还是表格
                        const item = allItems.find(i => i.id === id);
                        if (item?.type === 'spreadsheet') {
                            openSheet(id);
                        } else {
                            openDoc(id);
                        }
                    }}
                    onSelectKBHome={() => { setActiveDocId(null); setActiveSheetId(null); setEditingType('none'); }}
                    onMenuClick={handleMenuClick}
                    onMoveItem={handleMoveItem}
                    onCollapse={() => setSidebarCollapsed(true)}
                    renamingItemId={renamingItemId}
                    onRenameItem={handleRenameItem}
                />
            )}

            {/* 收起/展开按钮 */}
            {sidebarCollapsed && (
                <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="h-screen sticky top-0 flex items-center px-1 bg-gray-100 hover:bg-gray-200 border-r border-gray-200 transition"
                    title="展开侧边栏"
                >
                    <PanelLeft size={14} className="text-gray-500" />
                </button>
            )}

            {/* 右侧主内容 */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {activeDocId ? (
                    /* 文档编辑器模式 - 使用统一模块（自加载数据） */
                    <DocumentEditorModule
                        key={activeDocId}
                        documentId={activeDocId}
                        initialDocument={allItems.find(d => d.id === activeDocId) as any}
                        currentUser={currentUser}
                        mode="embedded"
                        showBackButton={true}
                        onBack={closeDoc}
                        knowledgeBaseId={kbId}
                        teamId={teamId}
                        onDirtyChange={setHasChanges}
                        onTitleChange={(newTitle) => {
                            // 乐观更新
                            if (activeDocId) {
                                handleOptimisticUpdate(activeDocId, newTitle);
                            }
                        }}
                        onSaveSuccess={(doc) => {
                            // 刷新列表
                            invalidateKBContent(kbId);
                        }}
                    />
                ) : activeSheetId ? (
                    /* 表格编辑器模式 - 使用统一模块 */
                    <SpreadsheetEditorModule
                        key={activeSheetId}
                        spreadsheetId={activeSheetId}
                        initialSpreadsheet={{
                            id: activeSheetId,
                            title: sheetTitle,
                            data: sheetInitialData,
                            status: 'active',
                            userId: currentUser?.uid || '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            teamId: teamId,
                            knowledgeBaseId: kbId,
                            folderId: null
                        }}
                        userId={currentUser?.uid || ''}
                        currentUser={currentUser}
                        mode="embedded"
                        showBackButton={true}
                        onBack={closeSheet}
                        onDirtyChange={setSheetHasChanges}
                        onTitleChange={(newTitle) => {
                            setSheetTitle(newTitle);
                            // 乐观更新列表
                            if (activeSheetId) {
                                handleOptimisticUpdate(activeSheetId, newTitle);
                            }
                        }}
                        onSaveSuccess={(data) => {
                            invalidateKBContent(kbId);
                        }}
                    />
                ) : (
                    /* 知识库首页模式 - 使用拆分组件 */
                    <KBHomePanel
                        kb={kb}
                        recentItems={recentDocs}
                        onOpenDoc={openDoc}
                        onOpenSheet={openSheet}
                        onDeleteDoc={handleDeleteDoc}
                        onDeleteSheet={handleDeleteSpreadsheet}
                        onCreateDoc={handleCreateDoc}
                        onCreateSpreadsheet={handleCreateSpreadsheet}
                        formatDate={formatDate}
                    />
                )}
            </main>

            {/* 搜索弹窗 */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={closeSearch}
                userId={currentUser?.uid}
                knowledgeBaseId={kbId}
                searchScope="knowledgeBase"
                onResultClick={(docId) => openDoc(docId)}
            />

            {/* 右键菜单 */}
            {contextMenu && (
                <FolderContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    type={contextMenu.type}
                    onClose={() => setContextMenu(null)}
                    onRename={() => {
                        // Start Inline Rename
                        setRenamingItemIdState(contextMenu.item.id);
                        setContextMenu(null);
                    }}
                    onDelete={() => {
                        if (contextMenu.type === 'folder') {
                            handleDeleteFolder(contextMenu.item.id);
                        } else if (contextMenu.type === 'spreadsheet') {
                            handleDeleteSpreadsheet(contextMenu.item.id, { stopPropagation: () => { } } as any);
                        } else {
                            handleDeleteDoc(contextMenu.item.id, { stopPropagation: () => { } } as any);
                        }
                        setContextMenu(null);
                    }}
                    onCreateSubfolder={contextMenu.type === 'folder' ? () => {
                        handleCreateFolder(contextMenu.item.id);
                        setContextMenu(null);
                    } : undefined}
                />
            )}
        </div >
    );
}
