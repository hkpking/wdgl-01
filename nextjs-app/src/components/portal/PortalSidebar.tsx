'use client';

import React, { useState } from 'react';
import {
    FileText,
    Menu,
    GraduationCap,
    ExternalLink
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/services/supabase';

interface MenuItem {
    id: string;
    title: string;
    icon: React.ElementType;
    path: string;
    isExternal?: boolean;  // 是否外部链接
    ssoEnabled?: boolean;  // 是否需要 SSO
}

const MENU_ITEMS: MenuItem[] = [
    {
        id: 'docs',
        title: '制度流程文档管理',
        icon: FileText,
        path: '/dashboard',
        isExternal: true,
        ssoEnabled: false  // 同域，不需要 SSO
    },
    {
        id: 'lctmr',
        title: '流程天命人',
        icon: GraduationCap,
        path: 'http://process.xjio.cn',
        isExternal: true,
        ssoEnabled: true  // 外部域名，需要 SSO
    },
];

export function PortalSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // SSO 跳转处理
    const handleNavigate = async (item: MenuItem) => {
        if (!item.isExternal) {
            router.push(item.path);
            return;
        }

        if (item.ssoEnabled) {
            // 需要 SSO：获取 Token 并携带跳转
            setLoading(item.id);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;

                if (token) {
                    // 携带 Token 跳转（使用 sso_token 参数）
                    const ssoUrl = `${item.path}?sso_token=${encodeURIComponent(token)}`;
                    window.open(ssoUrl, '_blank');
                } else {
                    // 未登录，跳转到登录页
                    router.push('/portal/login');
                }
            } catch (err) {
                console.error('获取 SSO Token 失败:', err);
                // 降级：直接打开（用户需手动登录）
                window.open(item.path, '_blank');
            } finally {
                setLoading(null);
            }
        } else {
            // 不需要 SSO，直接打开
            window.open(item.path, '_blank');
        }
    };

    return (
        <div
            className={`bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'
                }`}
        >
            {/* 折叠按钮 */}
            <div
                className="h-10 flex items-center justify-center border-b border-gray-100 cursor-pointer hover:bg-gray-50 text-gray-400"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <Menu size={16} /> : <div className="flex items-center gap-2 text-xs"><Menu size={14} /> 收起菜单</div>}
            </div>

            {/* 菜单列表 */}
            <div className="flex-1 overflow-y-auto py-4">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/portal' && pathname.startsWith(item.path));
                    const isLoading = loading === item.id;

                    return (
                        <div
                            key={item.id}
                            onClick={() => !isLoading && handleNavigate(item)}
                            className={`
                                flex items-center px-4 py-3 cursor-pointer mb-1 transition-colors relative
                                ${isActive
                                    ? 'bg-pink-50 text-pink-600 border-r-2 border-pink-500'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-pink-500'
                                }
                                ${isLoading ? 'opacity-50 cursor-wait' : ''}
                            `}
                            title={collapsed ? item.title : ''}
                        >
                            <item.icon size={20} className={isActive ? 'text-pink-600' : 'text-gray-500'} />
                            {!collapsed && (
                                <>
                                    <span className="ml-3 text-sm font-medium truncate flex-1">
                                        {item.title}
                                    </span>
                                    {item.isExternal && (
                                        <ExternalLink size={12} className="text-gray-400 ml-1" />
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 底部信息 */}
            {!collapsed && (
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs">
                            V2
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-700">WDGL Portal</p>
                            <p className="text-[10px] text-gray-400">Pro Version 2.0</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

