import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, ChevronRight, ChevronDown, Check, X, GitCompare } from 'lucide-react';
import * as versionService from '@/lib/services/versionService';
import VersionDiff from '@/components/VersionDiff';

export default function VersionHistorySidebar({ docId, currentUser, onSelectVersion, currentVersionId, onClose }) {
    const [versions, setVersions] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState({ '今天': true });

    // Renaming state
    const [editingVersionId, setEditingVersionId] = useState(null);
    const [editName, setEditName] = useState('');
    const [activeMenuVersionId, setActiveMenuVersionId] = useState(null);
    const menuRef = useRef(null);
    const inputRef = useRef(null);

    // 版本对比状态
    const [compareMode, setCompareMode] = useState(false);
    const [compareOldVersion, setCompareOldVersion] = useState(null);
    const [compareNewVersion, setCompareNewVersion] = useState(null);

    useEffect(() => {
        loadVersions();
    }, [docId, currentUser]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuVersionId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus input when editing starts
    useEffect(() => {
        if (editingVersionId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingVersionId]);

    const loadVersions = async () => {
        if (docId && currentUser) {
            try {
                const history = await versionService.getVersions({ type: 'document', id: docId });
                // versionService 返回的字段是 createdAt，转换为兼容的 savedAt 格式
                const formatted = history.map(v => ({
                    ...v,
                    savedAt: v.createdAt, // 兼容旧代码使用的 savedAt
                    name: v.label, // versionService 使用 label，转换为 name
                }));
                // Sort by date desc
                const sorted = formatted.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
                setVersions(sorted);
            } catch (error) {
                console.error('加载版本历史失败:', error);
                setVersions([]);
            }
        }
    };

    // Group versions by date (simplified)
    const groupedVersions = versions.reduce((acc, version) => {
        const date = new Date(version.savedAt);
        const today = new Date();
        let key = '更早之前';

        if (date.toDateString() === today.toDateString()) {
            key = '今天';
        }

        if (!acc[key]) acc[key] = [];
        acc[key].push(version);
        return acc;
    }, {});

    const toggleGroup = (group) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    };

    const handleStartRename = (version) => {
        setEditingVersionId(version.id);
        setEditName(version.name || '');
        setActiveMenuVersionId(null);
    };

    const handleSaveRename = async (versionId) => {
        if (editName.trim()) {
            try {
                await versionService.updateVersionLabel(versionId, editName.trim());
                loadVersions(); // Reload to show new name
            } catch (error) {
                console.error('重命名版本失败:', error);
            }
        }
        setEditingVersionId(null);
    };

    const handleCancelRename = () => {
        setEditingVersionId(null);
    };

    // 版本对比处理
    const handleStartCompare = (version) => {
        setCompareMode(true);
        setCompareOldVersion(version);
        setCompareNewVersion(null); // 等待选择第二个版本
        setActiveMenuVersionId(null);
    };

    const handleSelectCompareVersion = (version) => {
        if (compareMode && compareOldVersion) {
            if (version.id !== compareOldVersion.id) {
                // 确保旧版本在前
                const oldDate = new Date(compareOldVersion.savedAt);
                const newDate = new Date(version.savedAt);
                if (oldDate > newDate) {
                    setCompareNewVersion(compareOldVersion);
                    setCompareOldVersion(version);
                } else {
                    setCompareNewVersion(version);
                }
            }
        }
    };

    const handleCloseCompare = () => {
        setCompareMode(false);
        setCompareOldVersion(null);
        setCompareNewVersion(null);
    };

    // 如果正在对比，显示对比视图
    if (compareMode && compareOldVersion && compareNewVersion) {
        return (
            <div className="w-[600px] h-full bg-white border-l border-gray-200 flex flex-col shadow-xl z-30">
                <VersionDiff
                    oldVersion={compareOldVersion}
                    newVersion={compareNewVersion}
                    onClose={handleCloseCompare}
                />
            </div>
        );
    }

    return (
        <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col shadow-xl z-30">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-medium text-gray-800">版本记录</h2>
                <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-1 rounded">
                    <span className="sr-only">关闭</span>
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {/* 对比模式提示 */}
                {compareMode && !compareNewVersion && (
                    <div className="mb-4 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        <div className="flex items-center gap-2 mb-1">
                            <GitCompare size={14} />
                            <span className="font-medium">选择要对比的版本</span>
                        </div>
                        <div className="text-xs text-yellow-600">
                            已选择: {compareOldVersion?.name || formatDate(compareOldVersion?.savedAt)}
                        </div>
                        <button
                            onClick={handleCloseCompare}
                            className="mt-2 text-xs text-yellow-700 hover:underline"
                        >
                            取消对比
                        </button>
                    </div>
                )}

                {/* Current Version (Live) - Mock representation */}
                <div className="mb-4">
                    <div className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 mb-2 cursor-pointer">
                        <div>
                            <div className="font-medium text-sm text-gray-900">当前版本</div>
                            <div className="text-xs text-gray-500">{currentUser?.displayName || '未知用户'}</div>
                        </div>
                    </div>
                </div>

                {Object.entries(groupedVersions).map(([group, groupVersions]) => (
                    <div key={group} className="mb-4">
                        <button
                            onClick={() => toggleGroup(group)}
                            className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-50 rounded text-sm font-medium text-gray-600 mb-1"
                        >
                            {expandedGroups[group] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            {group}
                        </button>

                        {expandedGroups[group] && (
                            <div className="space-y-1 ml-2">
                                {groupVersions.map((version) => {
                                    const isSelected = currentVersionId === version.id;
                                    const isEditing = editingVersionId === version.id;
                                    const isMenuOpen = activeMenuVersionId === version.id;
                                    const isCompareSource = compareOldVersion?.id === version.id;

                                    const handleVersionClick = () => {
                                        if (isEditing) return;
                                        if (compareMode && !compareNewVersion) {
                                            handleSelectCompareVersion(version);
                                        } else {
                                            onSelectVersion(version);
                                        }
                                    };

                                    return (
                                        <div
                                            key={version.id}
                                            className={`group relative flex items-start justify-between p-3 rounded-lg cursor-pointer transition-colors border ${isCompareSource
                                                ? 'bg-yellow-50 border-yellow-300'
                                                : isSelected
                                                    ? 'bg-blue-50 border-blue-200'
                                                    : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                                                }`}
                                            onClick={handleVersionClick}
                                        >
                                            <div className="flex-1 min-w-0">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-1 mb-1" onClick={e => e.stopPropagation()}>
                                                        <input
                                                            ref={inputRef}
                                                            type="text"
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleSaveRename(version.id);
                                                                if (e.key === 'Escape') handleCancelRename();
                                                            }}
                                                            className="w-full text-sm border border-blue-500 rounded px-1 py-0.5 outline-none"
                                                            placeholder="输入版本名称"
                                                        />
                                                        <button onClick={() => handleSaveRename(version.id)} className="text-green-600 hover:bg-green-100 p-0.5 rounded">
                                                            <Check size={14} />
                                                        </button>
                                                        <button onClick={handleCancelRename} className="text-red-600 hover:bg-red-100 p-0.5 rounded">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-sm text-gray-900 truncate">
                                                            {version.name || `${formatDate(version.savedAt)} ${formatTime(version.savedAt)}`}
                                                        </span>
                                                        {version.name && (
                                                            <span className="text-xs text-gray-400">
                                                                {formatTime(version.savedAt)}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                                    <span className="text-xs text-gray-500 truncate">
                                                        {currentUser?.displayName || '用户'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Menu Button */}
                                            {!isEditing && (
                                                <div className="relative" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => setActiveMenuVersionId(isMenuOpen ? null : version.id)}
                                                        className={`p-1 hover:bg-gray-200 rounded text-gray-500 ${isMenuOpen ? 'opacity-100 bg-gray-200' : 'opacity-0 group-hover:opacity-100'}`}
                                                    >
                                                        <MoreVertical size={14} />
                                                    </button>

                                                    {/* Context Menu */}
                                                    {isMenuOpen && (
                                                        <div
                                                            ref={menuRef}
                                                            className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 w-36 py-1"
                                                        >
                                                            <button
                                                                onClick={() => handleStartRename(version)}
                                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                命名此版本
                                                            </button>
                                                            <button
                                                                onClick={() => handleStartCompare(version)}
                                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                            >
                                                                <GitCompare size={14} />
                                                                对比此版本
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}

                {versions.length === 0 && (
                    <div className="text-center text-gray-400 text-sm mt-10">
                        暂无历史版本
                    </div>
                )}
            </div>
        </div>
    );
}
