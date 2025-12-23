"use client";

/**
 * 文档编辑页 - 使用 Shell-Content 架构
 * 
 * 这是一个薄包装层，组合 EditorShell + DocumentEditorModule
 */

import React from 'react';
import { useParams } from 'next/navigation';
import { useStorage } from '@/contexts/StorageContext';
import dynamic from 'next/dynamic';

// 动态导入编辑器模块（带加载状态）
const DocumentEditorModule = dynamic(
    () => import('@/components/Editor/DocumentEditorModule'),
    {
        ssr: false,
        loading: () => (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">加载编辑器...</div>
            </div>
        )
    }
);

export default function EditorPage() {
    const params = useParams();
    const id = params.id as string;

    // 使用 Storage Context 获取用户和存储 API
    const storageContext = useStorage() as any;
    const {
        currentUser,
        loading: authLoading,
        getComments,
        addComment,
        addReply,
        updateCommentStatus,
        deleteComment,
        saveDocument,
        saveVersion
    } = storageContext;

    // 等待认证完成
    if (authLoading || !currentUser) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">加载中...</div>
            </div>
        );
    }

    // 构建存储 API
    const storageApi = {
        saveDocument,
        saveVersion,
        getComments,
        addComment,
        addReply,
        updateCommentStatus,
        deleteComment,
    };

    return (
        <DocumentEditorModule
            documentId={id}
            currentUser={currentUser}
            storageApi={storageApi}
            mode="standalone"
            showBackButton={true}
        />
    );
}
