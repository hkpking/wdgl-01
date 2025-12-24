/**
 * useKBPageState - 知识库页面状态管理 Hook
 * 
 * 从 KnowledgeBasePage 拆分出的状态逻辑
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useStorage } from '@/contexts/StorageContext';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { useFolderManager } from '@/hooks/useFolderManager';
import { useKBContent, useInvalidateKBContent, contentKeys } from '@/hooks/useKBContent';
import * as kbService from '@/lib/services/kbService';
import * as teamService from '@/lib/services/teamService';
import { getSpreadsheet, type Spreadsheet } from '@/lib/services/spreadsheetService';
import type { KnowledgeBase, KBFolder, TeamMemberRole } from '@/types/team';
import type { ContentItem } from '@/types/content';
import { type SpreadsheetEditorHandle } from '@/components/Spreadsheet/SpreadsheetEditor';

export type EditingType = 'none' | 'document' | 'spreadsheet' | 'flowchart';

export interface KBPageState {
    // 路由参数
    teamId: string;
    kbId: string;
    router: ReturnType<typeof useRouter>;

    // 用户和权限
    currentUser: any;
    authLoading: boolean;
    userRole: TeamMemberRole | null;

    // 数据状态
    kb: KnowledgeBase | null;
    folders: KBFolder[];
    allContent: ContentItem[] | undefined;
    isContentLoading: boolean;
    isSysLoading: boolean;

    // UI 状态
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    selectedFolderId: string | null;
    setSelectedFolderId: (id: string | null) => void;
    expandedFolders: Set<string>;
    setExpandedFolders: React.Dispatch<React.SetStateAction<Set<string>>>;

    // 文档编辑状态
    activeDocId: string | null;
    setActiveDocId: (id: string | null) => void;
    docTitle: string;
    setDocTitle: (title: string) => void;
    docContent: string;
    setDocContent: (content: string) => void;
    editorInstance: any;
    setEditorInstance: (editor: any) => void;
    hasChanges: boolean;
    setHasChanges: (has: boolean) => void;
    editingType: EditingType;
    setEditingType: (type: EditingType) => void;

    // 表格编辑状态
    activeSheetId: string | null;
    setActiveSheetId: (id: string | null) => void;
    sheetTitle: string;
    setSheetTitle: (title: string) => void;
    sheetInitialData: any[];
    setSheetInitialData: (data: any[]) => void;
    sheetDataRef: React.MutableRefObject<any[]>;
    sheetHasChanges: boolean;
    setSheetHasChanges: (has: boolean) => void;
    sheetSaving: boolean;
    setSheetSaving: (saving: boolean) => void;
    spreadsheetEditorRef: React.MutableRefObject<SpreadsheetEditorHandle | null>;
    sheetInitializedRef: React.MutableRefObject<boolean>;

    // 流程图编辑状态
    activeFlowchartId: string | null;
    setActiveFlowchartId: (id: string | null) => void;
    flowchartData: { id: string; title: string; content?: string; metadata?: any } | null;
    setFlowchartData: (data: any) => void;
    flowchartHasChanges: boolean;
    setFlowchartHasChanges: (has: boolean) => void;

    // 右键菜单状态
    contextMenu: { x: number; y: number; type: 'folder' | 'document' | 'spreadsheet'; item: any } | null;
    setContextMenu: (menu: any) => void;
    renamingItemId: string | null;
    setRenamingItemId: (id: string | null) => void;

    // 搜索
    isSearchOpen: boolean;
    openSearch: () => void;
    closeSearch: () => void;

    // 文件夹管理（用于 AppSidebar）
    folderManager: any;

    // Storage 方法
    saveDocument: (userId: string, docId: string | null, data: any) => Promise<any>;
    deleteDocument: (userId: string, docId: string) => Promise<boolean>;

    // 缓存和刷新
    queryClient: ReturnType<typeof useQueryClient>;
    invalidateKBContent: (kbId: string) => void;
    handleOptimisticUpdate: (id: string, newTitle: string) => void;

    // 辅助函数
    loadMetadata: () => Promise<void>;
    setFolders: React.Dispatch<React.SetStateAction<KBFolder[]>>;

    // 计算属性
    allItems: ContentItem[];
    recentDocs: ContentItem[];
}

export function useKBPageState(): KBPageState {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const teamId = params.teamId as string;
    const kbId = params.kbId as string;

    // 存储上下文
    const storageContext = useStorage() as any;
    const { currentUser, loading: authLoading, saveDocument, deleteDocument } = storageContext;

    // 搜索
    const { isOpen: isSearchOpen, openSearch, closeSearch } = useGlobalSearch();

    // 文件夹管理
    const folderManager = useFolderManager(currentUser) as any;

    // React Query
    const { data: allContent, isLoading: isContentLoading } = useKBContent({
        knowledgeBaseId: kbId,
        folderId: undefined,
    });
    const queryClient = useQueryClient();
    const invalidateKBContent = useInvalidateKBContent();

    // 数据状态
    const [kb, setKb] = useState<KnowledgeBase | null>(null);
    const [folders, setFolders] = useState<KBFolder[]>([]);
    const [userRole, setUserRole] = useState<TeamMemberRole | null>(null);
    const [isSysLoading, setIsSysLoading] = useState(true);

    // UI 状态
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

    // 文档编辑状态
    const [activeDocId, setActiveDocId] = useState<string | null>(null);
    const [docTitle, setDocTitle] = useState('');
    const [docContent, setDocContent] = useState('');
    const [editorInstance, setEditorInstance] = useState<any>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [editingType, setEditingType] = useState<EditingType>('none');

    // 表格编辑状态
    const [activeSheetId, setActiveSheetId] = useState<string | null>(null);
    const [sheetTitle, setSheetTitle] = useState('');
    const [sheetInitialData, setSheetInitialData] = useState<any[]>([]);
    const sheetDataRef = useRef<any[]>([]);
    const [sheetHasChanges, setSheetHasChanges] = useState(false);
    const [sheetSaving, setSheetSaving] = useState(false);
    const spreadsheetEditorRef = useRef<SpreadsheetEditorHandle | null>(null);
    const sheetInitializedRef = useRef(false);

    // 流程图编辑状态
    const [activeFlowchartId, setActiveFlowchartId] = useState<string | null>(null);
    const [flowchartData, setFlowchartData] = useState<{ id: string; title: string; content?: string; metadata?: any } | null>(null);
    const [flowchartHasChanges, setFlowchartHasChanges] = useState(false);

    // 右键菜单
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        type: 'folder' | 'document' | 'spreadsheet';
        item: any;
    } | null>(null);
    const [renamingItemId, setRenamingItemId] = useState<string | null>(null);

    // 乐观更新
    const handleOptimisticUpdate = useCallback((id: string, newTitle: string) => {
        queryClient.setQueryData(
            contentKeys.list({ kbId, folderId: undefined }),
            (old: ContentItem[] | undefined) => {
                if (!old) return old;
                return old.map(item => item.id === id ? { ...item, title: newTitle } : item);
            }
        );
    }, [queryClient, kbId]);

    // 加载元数据
    const loadMetadata = useCallback(async () => {
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
    }, [kbId, teamId, currentUser?.uid]);

    // 初始化加载
    useEffect(() => {
        if (kbId && teamId && currentUser?.uid) {
            loadMetadata();
        }
    }, [kbId, teamId, currentUser?.uid, loadMetadata]);

    // 从 URL 加载文档/表格
    useEffect(() => {
        const docId = searchParams.get('doc');
        const sheetId = searchParams.get('sheet');
        if (docId && docId !== activeDocId) {
            setActiveDocId(docId);
            setHasChanges(false);
            setEditingType('document');
        } else if (sheetId && sheetId !== activeSheetId) {
            // 加载表格
            loadSpreadsheetFromUrl(sheetId);
        }
    }, [searchParams]);

    // 加载表格辅助函数
    const loadSpreadsheetFromUrl = async (sheetId: string) => {
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
    };

    // 计算属性
    const allItems = useMemo(() => allContent || [], [allContent]);

    const recentDocs = useMemo(() => {
        return [...allItems]
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 10);
    }, [allItems]);

    return {
        // 路由
        teamId,
        kbId,
        router,

        // 用户和权限
        currentUser,
        authLoading,
        userRole,

        // 数据
        kb,
        folders,
        allContent,
        isContentLoading,
        isSysLoading,

        // UI
        sidebarCollapsed,
        setSidebarCollapsed,
        selectedFolderId,
        setSelectedFolderId,
        expandedFolders,
        setExpandedFolders,

        // 文档编辑
        activeDocId,
        setActiveDocId,
        docTitle,
        setDocTitle,
        docContent,
        setDocContent,
        editorInstance,
        setEditorInstance,
        hasChanges,
        setHasChanges,
        editingType,
        setEditingType,

        // 表格编辑
        activeSheetId,
        setActiveSheetId,
        sheetTitle,
        setSheetTitle,
        sheetInitialData,
        setSheetInitialData,
        sheetDataRef,
        sheetHasChanges,
        setSheetHasChanges,
        sheetSaving,
        setSheetSaving,
        spreadsheetEditorRef,
        sheetInitializedRef,

        // 流程图编辑
        activeFlowchartId,
        setActiveFlowchartId,
        flowchartData,
        setFlowchartData,
        flowchartHasChanges,
        setFlowchartHasChanges,

        // 菜单
        contextMenu,
        setContextMenu,
        renamingItemId,
        setRenamingItemId: setRenamingItemId,

        // 搜索
        isSearchOpen,
        openSearch,
        closeSearch,

        // 文件夹管理
        folderManager,

        // Storage
        saveDocument,
        deleteDocument,

        // 缓存
        queryClient,
        invalidateKBContent,
        handleOptimisticUpdate,

        // 辅助
        loadMetadata,
        setFolders,

        // 计算属性
        allItems,
        recentDocs,
    };
}
