/**
 * 协作用户上线/下线通知 Toast 组件
 * 显示用户加入或离开协作的轻量级通知
 */
import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, UserMinus, X } from 'lucide-react';

// Toast 项组件
function ToastItem({ toast, onDismiss }) {
    const isJoin = toast.type === 'join';

    return (
        <div
            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border
                ${isJoin
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }
                animate-slide-in
            `}
            style={{
                animation: 'slideIn 0.3s ease-out',
            }}
        >
            {/* 用户头像 */}
            <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                style={{ backgroundColor: toast.user.color || '#6B7280' }}
            >
                {(toast.user.name || '匿')[0].toUpperCase()}
            </div>

            {/* 消息内容 */}
            <div className="flex-1 min-w-0">
                <span className="font-medium">{toast.user.name || '匿名用户'}</span>
                <span className="ml-1.5 text-sm opacity-75">
                    {isJoin ? '已加入协作' : '已离开'}
                </span>
            </div>

            {/* 图标 */}
            <div className={`flex-shrink-0 ${isJoin ? 'text-green-500' : 'text-gray-400'}`}>
                {isJoin ? <UserPlus size={16} /> : <UserMinus size={16} />}
            </div>

            {/* 关闭按钮 */}
            <button
                onClick={() => onDismiss(toast.id)}
                className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    );
}

/**
 * CollaborationToast Hook
 * 管理 Toast 通知的状态和自动消失
 */
export function useCollaborationToast() {
    const [toasts, setToasts] = useState([]);

    // 添加 Toast
    const addToast = useCallback((type, user) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const toast = { id, type, user, timestamp: Date.now() };

        setToasts(prev => [...prev, toast]);

        // 3秒后自动消失
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    // 手动关闭 Toast
    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // 用户加入通知
    const notifyUserJoined = useCallback((user) => {
        addToast('join', user);
    }, [addToast]);

    // 用户离开通知
    const notifyUserLeft = useCallback((user) => {
        addToast('leave', user);
    }, [addToast]);

    return {
        toasts,
        dismissToast,
        notifyUserJoined,
        notifyUserLeft,
    };
}

/**
 * CollaborationToast 容器组件
 * 显示所有 Toast 通知
 */
export default function CollaborationToast({ toasts, onDismiss }) {
    if (!toasts || toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>

            {toasts.map(toast => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onDismiss={onDismiss}
                />
            ))}
        </div>
    );
}
