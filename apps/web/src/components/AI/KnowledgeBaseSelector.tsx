"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, Database, Users, FolderOpen, FileText, Search, Check, Loader2 } from 'lucide-react';
import * as teamService from '@/lib/services/teamService';
import * as kbService from '@/lib/services/kbService';
import { getKBDocuments } from '@/lib/services/api/documentService';
import type { Team, KnowledgeBase } from '@/types/team';

// 搜索范围类型
export interface SearchScope {
    type: 'all' | 'team' | 'knowledgeBase' | 'document';
    teamId?: string;
    knowledgeBaseId?: string;
    documentId?: string;
    label: string;
}

interface Document {
    id: string;
    title: string;
}

interface KnowledgeBaseSelectorProps {
    userId: string;
    value: SearchScope;
    onChange: (scope: SearchScope) => void;
}

export default function KnowledgeBaseSelector({
    userId,
    value,
    onChange
}: KnowledgeBaseSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [teams, setTeams] = useState<Team[]>([]);
    const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
    const [expandedKB, setExpandedKB] = useState<string | null>(null);
    const [kbsByTeam, setKbsByTeam] = useState<Record<string, KnowledgeBase[]>>({});
    const [docsByKB, setDocsByKB] = useState<Record<string, Document[]>>({});
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [loadingKBs, setLoadingKBs] = useState<string | null>(null);
    const [loadingDocs, setLoadingDocs] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const menuRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 加载用户可访问的团队
    const loadTeams = useCallback(async () => {
        if (teams.length > 0) return; // 已加载
        setLoadingTeams(true);
        try {
            const userTeams = await teamService.getVisibleTeams(userId);
            setTeams(userTeams);
        } catch (error) {
            console.error('加载团队失败:', error);
        } finally {
            setLoadingTeams(false);
        }
    }, [userId, teams.length]);

    // 打开时加载团队
    useEffect(() => {
        if (isOpen && teams.length === 0) {
            loadTeams();
        }
    }, [isOpen, loadTeams, teams.length]);

    // 加载团队下的知识库
    const loadKnowledgeBases = async (teamId: string) => {
        if (kbsByTeam[teamId]) return; // 已加载
        setLoadingKBs(teamId);
        try {
            const kbs = await kbService.getKnowledgeBases(teamId);
            setKbsByTeam(prev => ({ ...prev, [teamId]: kbs }));
        } catch (error) {
            console.error('加载知识库失败:', error);
        } finally {
            setLoadingKBs(null);
        }
    };

    // 加载知识库下的文档
    const loadDocuments = async (kbId: string) => {
        if (docsByKB[kbId]) return; // 已加载
        setLoadingDocs(kbId);
        try {
            const docs = await getKBDocuments(kbId);
            setDocsByKB(prev => ({ ...prev, [kbId]: docs }));
        } catch (error) {
            console.error('加载文档失败:', error);
        } finally {
            setLoadingDocs(null);
        }
    };

    // 展开团队
    const handleExpandTeam = (teamId: string) => {
        if (expandedTeam === teamId) {
            setExpandedTeam(null);
        } else {
            setExpandedTeam(teamId);
            loadKnowledgeBases(teamId);
        }
        setExpandedKB(null);
    };

    // 展开知识库
    const handleExpandKB = (kbId: string) => {
        if (expandedKB === kbId) {
            setExpandedKB(null);
        } else {
            setExpandedKB(kbId);
            loadDocuments(kbId);
        }
    };

    // 选择全部知识库
    const handleSelectAll = () => {
        onChange({ type: 'all', label: '全部知识库' });
        setIsOpen(false);
    };

    // 选择团队
    const handleSelectTeam = (team: Team) => {
        onChange({
            type: 'team',
            teamId: team.id,
            label: team.name
        });
        setIsOpen(false);
    };

    // 选择知识库
    const handleSelectKB = (kb: KnowledgeBase, teamName: string) => {
        onChange({
            type: 'knowledgeBase',
            teamId: kb.teamId,
            knowledgeBaseId: kb.id,
            label: `${teamName} / ${kb.name}`
        });
        setIsOpen(false);
    };

    // 选择文档
    const handleSelectDocument = (doc: Document, kbName: string) => {
        onChange({
            type: 'document',
            documentId: doc.id,
            label: doc.title
        });
        setIsOpen(false);
    };

    // 过滤团队
    const filteredTeams = searchQuery
        ? teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : teams;

    return (
        <div className="relative" ref={menuRef}>
            {/* 触发按钮 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
                <Database size={14} className="text-blue-500" />
                <span className="max-w-[150px] truncate">{value.label}</span>
                <ChevronRight size={14} className={`text-gray-400 transition ${isOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* 下拉菜单 */}
            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    {/* 搜索框 */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-lg">
                            <Search size={14} className="text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="搜索团队或知识库"
                                className="flex-1 text-sm bg-transparent border-none outline-none placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* 选项列表 */}
                    <div className="max-h-80 overflow-auto">
                        {/* 全部知识库 */}
                        <button
                            onClick={handleSelectAll}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 text-left"
                        >
                            <Database size={14} className="text-blue-500" />
                            <span className="flex-1">全部知识库</span>
                            {value.type === 'all' && <Check size={14} className="text-blue-600" />}
                        </button>

                        {/* 分隔线 */}
                        <div className="border-t border-gray-100 my-1" />

                        {/* 加载中 */}
                        {loadingTeams && (
                            <div className="flex items-center justify-center gap-2 py-4 text-gray-400 text-sm">
                                <Loader2 size={14} className="animate-spin" />
                                加载团队...
                            </div>
                        )}

                        {/* 团队列表 */}
                        {filteredTeams.map(team => (
                            <div key={team.id}>
                                {/* 团队行 */}
                                <div className="flex items-center hover:bg-gray-50">
                                    <button
                                        onClick={() => handleExpandTeam(team.id)}
                                        className="p-2 text-gray-400 hover:text-gray-600"
                                    >
                                        {loadingKBs === team.id ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <ChevronRight size={14} className={`transition ${expandedTeam === team.id ? 'rotate-90' : ''}`} />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleSelectTeam(team)}
                                        className="flex-1 flex items-center gap-2 py-2 pr-3 text-sm text-left"
                                    >
                                        <Users size={14} className="text-purple-500" />
                                        <span className="flex-1 truncate">{team.name}</span>
                                        {value.type === 'team' && value.teamId === team.id && (
                                            <Check size={14} className="text-blue-600" />
                                        )}
                                    </button>
                                </div>

                                {/* 知识库列表 */}
                                {expandedTeam === team.id && kbsByTeam[team.id] && (
                                    <div className="ml-4 border-l border-gray-100">
                                        {kbsByTeam[team.id].map(kb => (
                                            <div key={kb.id}>
                                                {/* 知识库行 */}
                                                <div className="flex items-center hover:bg-gray-50">
                                                    <button
                                                        onClick={() => handleExpandKB(kb.id)}
                                                        className="p-2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {loadingDocs === kb.id ? (
                                                            <Loader2 size={12} className="animate-spin" />
                                                        ) : (
                                                            <ChevronRight size={12} className={`transition ${expandedKB === kb.id ? 'rotate-90' : ''}`} />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleSelectKB(kb, team.name)}
                                                        className="flex-1 flex items-center gap-2 py-1.5 pr-3 text-sm text-left"
                                                    >
                                                        <span className="text-base">{kb.icon || '📁'}</span>
                                                        <span className="flex-1 truncate">{kb.name}</span>
                                                        {value.type === 'knowledgeBase' && value.knowledgeBaseId === kb.id && (
                                                            <Check size={14} className="text-blue-600" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* 文档列表 */}
                                                {expandedKB === kb.id && docsByKB[kb.id] && (
                                                    <div className="ml-4 border-l border-gray-100">
                                                        {docsByKB[kb.id].length === 0 ? (
                                                            <div className="px-3 py-2 text-xs text-gray-400">暂无文档</div>
                                                        ) : (
                                                            docsByKB[kb.id].map(doc => (
                                                                <button
                                                                    key={doc.id}
                                                                    onClick={() => handleSelectDocument(doc, kb.name)}
                                                                    className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-50 text-left"
                                                                >
                                                                    <FileText size={12} className="text-gray-400" />
                                                                    <span className="flex-1 truncate">{doc.title}</span>
                                                                    {value.type === 'document' && value.documentId === doc.id && (
                                                                        <Check size={14} className="text-blue-600" />
                                                                    )}
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {kbsByTeam[team.id].length === 0 && (
                                            <div className="px-3 py-2 text-xs text-gray-400">暂无知识库</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* 无团队 */}
                        {!loadingTeams && filteredTeams.length === 0 && (
                            <div className="py-4 text-center text-sm text-gray-400">
                                {searchQuery ? '未找到匹配的团队' : '暂无可访问的团队'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
