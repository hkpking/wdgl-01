"use client";

import React, { useState } from 'react';
import { X, Users, Globe, Lock, Eye } from 'lucide-react';
import type { CreateTeamInput, TeamVisibility } from '@/types/team';

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (input: CreateTeamInput) => Promise<void>;
}

const VISIBILITY_OPTIONS: { value: TeamVisibility; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: 'public', label: '公开', icon: <Globe size={16} />, desc: '所有用户可见' },
    { value: 'team', label: '团队可见', icon: <Users size={16} />, desc: '仅团队成员可见' },
    { value: 'private', label: '私有', icon: <Lock size={16} />, desc: '仅管理员可见' },
];

export default function CreateTeamModal({ isOpen, onClose, onSubmit }: CreateTeamModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<TeamVisibility>('team');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('请输入团队名称');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await onSubmit({
                name: name.trim(),
                description: description.trim() || undefined,
                visibility
            });
            // 重置表单
            setName('');
            setDescription('');
            setVisibility('team');
            onClose();
        } catch (err) {
            setError('创建失败，请重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 遮罩层 */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* 弹窗内容 */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* 头部 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">新建团队</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 表单 */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* 团队图标和名称 */}
                    <div className="flex gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                            👥
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="请输入团队名称"
                                className="w-full px-0 py-2 text-lg font-medium border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* 团队介绍 */}
                    <div>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="请输入团队介绍"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
                        />
                    </div>

                    {/* 可见性设置 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            可见性设置
                        </label>
                        <div className="space-y-2">
                            {VISIBILITY_OPTIONS.map(option => (
                                <label
                                    key={option.value}
                                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${visibility === option.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value={option.value}
                                        checked={visibility === option.value}
                                        onChange={() => setVisibility(option.value)}
                                        className="sr-only"
                                    />
                                    <span className={`${visibility === option.value ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {option.icon}
                                    </span>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{option.label}</div>
                                        <div className="text-xs text-gray-500">{option.desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 错误提示 */}
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    {/* 按钮 */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {isSubmitting ? '创建中...' : '新建团队'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
