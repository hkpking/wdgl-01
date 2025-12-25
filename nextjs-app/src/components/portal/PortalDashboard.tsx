'use client';

import React from 'react';
import { AppCenter } from './PortalLayout';

/**
 * 门户首页仪表盘 (架构版)
 * 主要用于展示布局结构，暂无实际业务内容
 */
export function PortalDashboard() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-lg border border-gray-100 m-4 shadow-sm min-h-[400px]">
            <div className="text-center">
                <p className="text-lg font-medium mb-2">欢迎使用 WDGL Portal</p>
                <p className="text-sm">请从左侧菜单选择应用进入</p>
            </div>

            {/* 也可以保留 AppCenter 作为快捷入口，视需求而定，但用户说"不需要内容" */}
            {/* <div className="mt-8">
                 <AppCenter />
            </div> */}
        </div>
    );
}
