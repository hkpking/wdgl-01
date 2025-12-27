"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, Check, User } from 'lucide-react';
import DepartmentTree from '@/components/Department/DepartmentTree';
import type { Department, DepartmentMember } from '@/types/team';
import * as deptService from '@/lib/services/departmentService';

interface MemberSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (userIds: string[]) => void;
    excludeUserIds?: string[];
    title?: string;
}

interface UserInfo {
    id: string;
    displayName: string;
    avatarUrl?: string;
}

export default function MemberSelector({
    isOpen,
    onClose,
    onSelect,
    excludeUserIds = [],
    title = '选择成员'
}: MemberSelectorProps) {
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const [members, setMembers] = useState<DepartmentMember[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // 加载部门成员
    useEffect(() => {
        if (selectedDept) {
            loadMembers(selectedDept.id);
        } else {
            setMembers([]);
        }
    }, [selectedDept]);

    const loadMembers = async (deptId: string) => {
        setLoading(true);
        try {
            const data = await deptService.getDepartmentMembers(deptId);
            setMembers(data.filter(m => !excludeUserIds.includes(m.userId)));
        } catch (error) {
            console.error('加载成员失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 切换选中
    const toggleSelect = (userId: string) => {
        setSelectedUserIds(prev => {
            const next = new Set(prev);
            if (next.has(userId)) {
                next.delete(userId);
            } else {
                next.add(userId);
            }
            return next;
        });
    };

    // 确认选择
    const handleConfirm = () => {
        onSelect(Array.from(selectedUserIds));
        setSelectedUserIds(new Set());
        onClose();
    };

    // 过滤成员
    const filteredMembers = searchQuery
        ? members.filter(m =>
            m.user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : members;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden h-[80vh] flex flex-col">
                {/* 头部 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <X size={20} />
                    </button>
                </div>

                {/* 内容区 */}
                <div className="flex-1 flex min-h-0">
                    {/* 左侧：部门树 */}
                    <div className="w-64 border-r border-gray-200 overflow-auto p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">选择部门</h3>
                        <DepartmentTree
                            onSelectDepartment={setSelectedDept}
                            selectedId={selectedDept?.id}
                            editable={false}
                        />
                    </div>

                    {/* 中间：成员列表 */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* 搜索 */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="搜索成员..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* 成员列表 */}
                        <div className="flex-1 overflow-auto p-4">
                            {!selectedDept ? (
                                <div className="text-center py-12 text-gray-500">
                                    请先选择部门
                                </div>
                            ) : loading ? (
                                <div className="text-center py-12 text-gray-500">加载中...</div>
                            ) : filteredMembers.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    {searchQuery ? '未找到匹配成员' : '该部门暂无成员'}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredMembers.map(member => (
                                        <label
                                            key={member.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${selectedUserIds.has(member.userId)
                                                    ? 'bg-blue-50 border border-blue-200'
                                                    : 'hover:bg-gray-50 border border-transparent'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedUserIds.has(member.userId)}
                                                onChange={() => toggleSelect(member.userId)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedUserIds.has(member.userId)
                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                    : 'border-gray-300'
                                                }`}>
                                                {selectedUserIds.has(member.userId) && <Check size={14} />}
                                            </div>

                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                {member.user?.avatarUrl ? (
                                                    <img src={member.user.avatarUrl} alt="" className="w-full h-full rounded-full" />
                                                ) : (
                                                    <User size={16} className="text-gray-400" />
                                                )}
                                            </div>

                                            <span className="font-medium text-gray-900">
                                                {member.user?.displayName || '未知用户'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 右侧：已选列表 */}
                    <div className="w-56 border-l border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-sm font-medium text-gray-700">
                                已选择 ({selectedUserIds.size})
                            </h3>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            {selectedUserIds.size === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    未选择成员
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {Array.from(selectedUserIds).map(userId => {
                                        const member = members.find(m => m.userId === userId);
                                        return (
                                            <div key={userId} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <User size={12} className="text-gray-400" />
                                                </div>
                                                <span className="flex-1 text-sm truncate">
                                                    {member?.user?.displayName || userId.slice(0, 8)}
                                                </span>
                                                <button
                                                    onClick={() => toggleSelect(userId)}
                                                    className="text-gray-400 hover:text-red-600"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 底部按钮 */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={selectedUserIds.size === 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        确定添加 ({selectedUserIds.size})
                    </button>
                </div>
            </div>
        </div>
    );
}
