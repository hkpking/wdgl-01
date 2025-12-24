"use client";

import React, { useState, useEffect } from 'react';
import { X, FileText, FileSpreadsheet, ChevronRight, Loader2, GitBranch } from 'lucide-react';
import * as teamService from '@/lib/services/teamService';
import * as kbService from '@/lib/services/kbService';
import type { Team, KnowledgeBase } from '@/types/team';

interface CreateItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser?: { uid: string; email?: string; displayName?: string } | null;
    // 如果在知识库上下文中，直接使用这些值
    defaultTeamId?: string;
    defaultKbId?: string;
    onCreateDocument: (teamId: string, kbId: string) => void;
    onCreateSpreadsheet: (teamId: string, kbId: string) => void;
    onCreateFlowchart?: (teamId: string, kbId: string) => void;
}

type ItemType = 'document' | 'spreadsheet' | 'flowchart';

export default function CreateItemModal({
    isOpen,
    onClose,
    currentUser,
    defaultTeamId,
    defaultKbId,
    onCreateDocument,
    onCreateSpreadsheet,
    onCreateFlowchart,
}: CreateItemModalProps) {
    const [step, setStep] = useState<'type' | 'team' | 'kb'>('type');
    const [selectedType, setSelectedType] = useState<ItemType | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(defaultTeamId || null);
    const [selectedKbId, setSelectedKbId] = useState<string | null>(defaultKbId || null);

    const [teams, setTeams] = useState<Team[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [loading, setLoading] = useState(false);

    // 重置状态
    useEffect(() => {
        if (isOpen) {
            // 如果有默认值，直接进入类型选择
            if (defaultTeamId && defaultKbId) {
                setSelectedTeamId(defaultTeamId);
                setSelectedKbId(defaultKbId);
                setStep('type');
            } else {
                setStep('type');
                setSelectedType(null);
                setSelectedTeamId(null);
                setSelectedKbId(null);
            }
        }
    }, [isOpen, defaultTeamId, defaultKbId]);

    // 加载团队列表
    useEffect(() => {
        if (isOpen && currentUser?.uid && step === 'team') {
            loadTeams();
        }
    }, [isOpen, currentUser?.uid, step]);

    // 加载知识库列表
    useEffect(() => {
        if (isOpen && selectedTeamId && step === 'kb') {
            loadKnowledgeBases(selectedTeamId);
        }
    }, [isOpen, selectedTeamId, step]);

    const loadTeams = async () => {
        if (!currentUser?.uid) return;
        setLoading(true);
        try {
            const data = await teamService.getVisibleTeams(currentUser.uid);
            setTeams(data);
        } catch (error) {
            console.error('加载团队失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadKnowledgeBases = async (teamId: string) => {
        setLoading(true);
        try {
            const data = await kbService.getKnowledgeBases(teamId);
            setKnowledgeBases(data);
        } catch (error) {
            console.error('加载知识库失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTypeSelect = (type: ItemType) => {
        setSelectedType(type);
        // 如果有默认知识库，直接创建
        if (defaultTeamId && defaultKbId) {
            handleCreate(type, defaultTeamId, defaultKbId);
        } else {
            setStep('team');
        }
    };

    const handleTeamSelect = (teamId: string) => {
        setSelectedTeamId(teamId);
        setStep('kb');
    };

    const handleKbSelect = (kbId: string) => {
        setSelectedKbId(kbId);
        if (selectedType && selectedTeamId) {
            handleCreate(selectedType, selectedTeamId, kbId);
        }
    };

    const handleCreate = (type: ItemType, teamId: string, kbId: string) => {
        if (type === 'document') {
            onCreateDocument(teamId, kbId);
        } else if (type === 'spreadsheet') {
            onCreateSpreadsheet(teamId, kbId);
        } else if (type === 'flowchart' && onCreateFlowchart) {
            onCreateFlowchart(teamId, kbId);
        }
        onClose();
    };

    const handleBack = () => {
        if (step === 'kb') {
            setStep('team');
            setSelectedKbId(null);
        } else if (step === 'team') {
            setStep('type');
            setSelectedTeamId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        {step !== 'type' && (
                            <button
                                onClick={handleBack}
                                className="p-1 hover:bg-gray-100 rounded transition"
                            >
                                <ChevronRight size={18} className="rotate-180 text-gray-500" />
                            </button>
                        )}
                        <h2 className="font-semibold text-gray-900">
                            {step === 'type' && '新建'}
                            {step === 'team' && '选择团队'}
                            {step === 'kb' && '选择知识库'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {step === 'type' && (
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => handleTypeSelect('document')}
                                className="flex flex-col items-center gap-3 p-5 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                            >
                                <FileText size={28} className="text-gray-400 group-hover:text-blue-600" />
                                <span className="font-medium text-sm text-gray-700 group-hover:text-blue-700">文档</span>
                            </button>
                            <button
                                onClick={() => handleTypeSelect('spreadsheet')}
                                className="flex flex-col items-center gap-3 p-5 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition group"
                            >
                                <FileSpreadsheet size={28} className="text-gray-400 group-hover:text-green-600" />
                                <span className="font-medium text-sm text-gray-700 group-hover:text-green-700">表格</span>
                            </button>
                            <button
                                onClick={() => handleTypeSelect('flowchart')}
                                className="flex flex-col items-center gap-3 p-5 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group"
                            >
                                <GitBranch size={28} className="text-gray-400 group-hover:text-purple-600" />
                                <span className="font-medium text-sm text-gray-700 group-hover:text-purple-700">流程图</span>
                            </button>
                        </div>
                    )}

                    {step === 'team' && (
                        <div className="space-y-2">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 size={24} className="animate-spin text-gray-400" />
                                </div>
                            ) : teams.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>暂无团队</p>
                                    <p className="text-sm mt-1">请先在侧边栏创建团队</p>
                                </div>
                            ) : (
                                teams.map(team => (
                                    <button
                                        key={team.id}
                                        onClick={() => handleTeamSelect(team.id)}
                                        className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                                    >
                                        <span className="font-medium text-gray-700">{team.name}</span>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {step === 'kb' && (
                        <div className="space-y-2">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 size={24} className="animate-spin text-gray-400" />
                                </div>
                            ) : knowledgeBases.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>暂无知识库</p>
                                    <p className="text-sm mt-1">请先在团队中创建知识库</p>
                                </div>
                            ) : (
                                knowledgeBases.map(kb => (
                                    <button
                                        key={kb.id}
                                        onClick={() => handleKbSelect(kb.id)}
                                        className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{kb.icon || '📁'}</span>
                                            <span className="font-medium text-gray-700">{kb.name}</span>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
