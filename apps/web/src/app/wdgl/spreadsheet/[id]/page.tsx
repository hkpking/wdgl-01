'use client';

/**
 * 表格编辑页 - 使用 Shell-Content 架构
 * 
 * 这是一个薄包装层，组合 SpreadsheetEditorModule
 */

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/services/supabase';
import dynamic from 'next/dynamic';

// 动态导入编辑器模块
const SpreadsheetEditorModule = dynamic(
    () => import('@/components/Spreadsheet/SpreadsheetEditorModule'),
    {
        ssr: false,
        loading: () => (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">加载表格编辑器...</div>
            </div>
        )
    }
);

export default function SpreadsheetPage() {
    const params = useParams();
    const router = useRouter();
    const spreadsheetId = params.id as string;

    const [userId, setUserId] = useState<string | null>(null);

    // 获取用户信息
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            } else {
                router.push('/login');
            }
        };
        getUser();
    }, [router]);

    // 等待用户认证
    if (!userId) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">加载中...</div>
            </div>
        );
    }

    return (
        <SpreadsheetEditorModule
            spreadsheetId={spreadsheetId}
            userId={userId}
            mode="standalone"
            showBackButton={true}
            showHeader={true}
        />
    );
}
