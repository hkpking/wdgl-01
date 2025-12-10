/**
 * PWA 更新提示组件
 * 当有新版本可用时提示用户刷新
 */
import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWAUpdatePrompt() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW 已注册:', r);
        },
        onRegisterError(error) {
            console.log('SW 注册失败:', error);
        },
    });

    const close = () => {
        setNeedRefresh(false);
    };

    if (!needRefresh) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">新版本可用</h4>
                    <p className="text-sm text-gray-500 mt-1">
                        点击更新以获取最新功能
                    </p>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => updateServiceWorker(true)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                        >
                            立即更新
                        </button>
                        <button
                            onClick={close}
                            className="px-3 py-1.5 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg transition"
                        >
                            稍后
                        </button>
                    </div>
                </div>
                <button
                    onClick={close}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
