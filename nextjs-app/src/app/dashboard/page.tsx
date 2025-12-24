"use client";

/**
 * Dashboard 页面 - 直接显示问AI界面
 * 
 * 知识库架构重构：所有文档/表格管理移至知识库中
 * Dashboard 作为首页，直接显示问AI界面
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AppSidebar from '@/components/layout/AppSidebar';
import AIQueryPanel from '@/components/AI/AIQueryPanel';
import ReferencePanel from '@/components/AI/ReferencePanel';
import ConversationTabs from '@/components/AI/ConversationTabs';
import { type SearchScope } from '@/components/AI/KnowledgeBaseSelector';
import SearchModal from '@/components/shared/SearchModal';
import { useStorage } from '@/contexts/StorageContext';
import { useFolderManager } from '@/hooks/useFolderManager';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { useConversationHistory, type SearchReference } from '@/hooks/useConversationHistory';

export default function Dashboard() {
    const router = useRouter();
    const storageContext = useStorage();
    const { currentUser, loading: authLoading, signOut } = storageContext;

    // 文件夹管理（用于侧边栏兼容）
    const folderManager = useFolderManager(currentUser);
    const { folders, selectedFolderId, setSelectedFolderId, loadFolders } = folderManager as any;

    // 全局搜索
    const { isOpen: isSearchOpen, openSearch, closeSearch } = useGlobalSearch();

    // 对话历史
    const {
        conversations,
        currentConversation,
        currentConversationId,
        addMessage,
        updateMessage,
        startNewConversation,
        switchConversation,
        deleteConversation
    } = useConversationHistory(currentUser?.uid);

    // 右侧引用面板状态
    const [isReferencePanelOpen, setIsReferencePanelOpen] = useState(false);
    const [currentReferences, setCurrentReferences] = useState<SearchReference[]>([]);

    // 知识库搜索范围
    const [searchScope, setSearchScope] = useState<SearchScope>({
        type: 'all',
        label: '全部知识库'
    });

    // 加载文件夹
    useEffect(() => {
        if (currentUser?.uid) {
            loadFolders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.uid]);

    // 处理引用更新
    const handleReferencesUpdate = (refs: SearchReference[]) => {
        setCurrentReferences(refs);
        if (refs.length > 0) {
            setIsReferencePanelOpen(true);
        }
    };

    // 登出
    const handleLogout = async () => {
        if (window.confirm('确定要退出吗?')) {
            await signOut();
            router.push('/login');
        }
    };

    // 认证加载中
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // 未登录
    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">请先登录</p>
                    <a href="/login" className="text-blue-600 hover:underline">前往登录页面</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* 左侧导航 */}
            <AppSidebar
                currentUser={currentUser}
                onLogout={handleLogout}
                onUpload={() => alert('上传功能开发中...')}
                folders={folders}
                selectedFolderId={selectedFolderId}
                onSelectFolder={setSelectedFolderId}
                onOpenSearch={openSearch}
            />

            {/* 中间区域 */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* 对话标签 */}
                <ConversationTabs
                    conversations={conversations}
                    currentConversationId={currentConversationId}
                    onSwitchConversation={switchConversation}
                    onNewConversation={startNewConversation}
                    onDeleteConversation={deleteConversation}
                    currentTitle={currentConversation?.title}
                />

                {/* 问 AI 主区域 */}
                <AIQueryPanel
                    currentUser={currentUser}
                    messages={currentConversation?.messages || []}
                    onAddMessage={addMessage}
                    onUpdateMessage={updateMessage}
                    onReferencesUpdate={handleReferencesUpdate}
                    searchScopeValue={searchScope}
                    onSearchScopeChange={setSearchScope}
                />
            </div>

            {/* 右侧引用面板 */}
            <ReferencePanel
                isOpen={isReferencePanelOpen}
                onClose={() => setIsReferencePanelOpen(false)}
                references={currentReferences}
                totalCount={currentReferences.length}
            />

            {/* 全局搜索弹窗 */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={closeSearch}
                userId={currentUser.uid}
                searchScope="all"
            />
        </div>
    );
}
