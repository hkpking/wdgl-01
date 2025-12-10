/**
 * 协作用户在线状态组件
 * 显示当前文档中的协作用户和连接状态
 */
import React from 'react';
import { Users, Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

export default function CollaborationStatus({
    connectedUsers = [],
    isConnected,
    connectionError,
    reconnectAttempts = 0,
    onReconnect
}) {
    // 连接错误状态
    if (connectionError) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={14} className="text-red-500" />
                <span className="text-xs text-red-600">{connectionError}</span>
                {onReconnect && (
                    <button
                        onClick={onReconnect}
                        className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded transition"
                        title="重新连接"
                    >
                        <RefreshCw size={12} />
                    </button>
                )}
            </div>
        );
    }

    // 正在重连
    if (!isConnected && reconnectAttempts > 0) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                <RefreshCw size={14} className="text-yellow-600 animate-spin" />
                <span className="text-xs text-yellow-700">
                    正在重连... ({reconnectAttempts}/5)
                </span>
            </div>
        );
    }

    // 离线状态
    if (!isConnected) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <WifiOff size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500">离线模式</span>
                {onReconnect && (
                    <button
                        onClick={onReconnect}
                        className="ml-1 p-1 text-gray-500 hover:bg-gray-200 rounded transition"
                        title="连接协作"
                    >
                        <RefreshCw size={12} />
                    </button>
                )}
            </div>
        );
    }

    // 正常连接状态
    return (
        <div className="flex items-center gap-2">
            {/* 连接状态指示器 */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-lg">
                <Wifi size={12} className="text-green-500" />
                <span className="text-xs text-green-600">已连接</span>
            </div>

            {/* 用户头像列表 */}
            {connectedUsers.length > 0 && (
                <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-2">
                        {connectedUsers.slice(0, 5).map((user, index) => (
                            <div
                                key={user.id || index}
                                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm"
                                style={{ backgroundColor: user.color || '#6B7280' }}
                                title={user.name || '匿名用户'}
                            >
                                {(user.name || '匿')[0].toUpperCase()}
                            </div>
                        ))}
                        {connectedUsers.length > 5 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center text-xs font-medium text-white shadow-sm">
                                +{connectedUsers.length - 5}
                            </div>
                        )}
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users size={12} />
                        {connectedUsers.length}
                    </span>
                </div>
            )}
        </div>
    );
}
