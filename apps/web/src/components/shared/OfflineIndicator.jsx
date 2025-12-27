/**
 * 离线状态显示组件
 * 当应用处于离线状态时显示提示
 */
import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            // 恢复在线时短暂显示提示
            setShowBanner(true);
            setTimeout(() => setShowBanner(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowBanner(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // 在线且不显示 banner 时隐藏
    if (isOnline && !showBanner) {
        return null;
    }

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${isOnline
                    ? 'bg-green-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
        >
            {isOnline ? (
                <>
                    <Wifi size={20} />
                    <span className="font-medium">已恢复在线</span>
                </>
            ) : (
                <>
                    <WifiOff size={20} />
                    <span className="font-medium">离线模式 - 更改将在恢复连接后同步</span>
                </>
            )}
        </div>
    );
}
