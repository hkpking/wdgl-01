"use client";

import React, { useState } from 'react';
import { X, Book, Globe, Lock, Users } from 'lucide-react';
import type { CreateKBInput, KBVisibility } from '@/types/team';

interface CreateKBModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (input: CreateKBInput) => Promise<void>;
    teamId: string;
    teamName: string;
}

const ICON_OPTIONS = ['📚', '📖', '📝', '💡', '🎯', '🔧', '📊', '🎨', '🚀', '💼'];

export default function CreateKBModal({ isOpen, onClose, onSubmit, teamId, teamName }: CreateKBModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('📚');
    const [visibility, setVisibility] = useState<KBVisibility>('team');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('请输入知识库名称');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await onSubmit({
                name: name.trim(),
                description: description.trim() || undefined,
                icon,
                teamId,
                visibility
            });
            setName('');
            setDescription('');
            setIcon('📚');
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
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* 头部 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">新建知识库</h2>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* 图标和名称 */}
                    <div className="flex gap-4">
                        <div className="relative">
                            <button
                                type="button"
                                className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center text-3xl hover:bg-yellow-200 transition"
                            >
                                {icon}
                            </button>
                            {/* 图标选择器 */}
                            <div className="absolute top-full left-0 mt-2 p-2 bg-white border rounded-lg shadow-lg hidden group-hover:grid grid-cols-5 gap-1 z-10">
                                {ICON_OPTIONS.map(i => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setIcon(i)}
                                        className={`w-8 h-8 rounded hover:bg-gray-100 ${icon === i ? 'bg-blue-100' : ''}`}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="请输入知识库名称"
                                className="w-full px-0 py-2 text-lg font-medium border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* 简介 */}
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="请输入知识库简介"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    />

                    {/* 归属团队 */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">新建到团队：</span>
                        <span className="font-medium text-gray-900">{teamName}</span>
                    </div>

                    {/* 图标选择 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">选择图标</label>
                        <div className="flex gap-2 flex-wrap">
                            {ICON_OPTIONS.map(i => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setIcon(i)}
                                    className={`w-10 h-10 rounded-lg text-xl hover:bg-gray-100 transition ${icon === i ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-50'
                                        }`}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? '创建中...' : '新建知识库'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
