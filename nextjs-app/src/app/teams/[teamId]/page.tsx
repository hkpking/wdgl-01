"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Loader2, FileText, Clock } from 'lucide-react';
import AppSidebar from '@/components/layout/AppSidebar';
import KBCard, { CreateKBCard } from '@/components/KnowledgeBase/KBCard';
import CreateKBModal from '@/components/KnowledgeBase/CreateKBModal';
import { useStorage } from '@/contexts/StorageContext';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import SearchModal from '@/components/shared/SearchModal';
import * as teamService from '@/lib/services/teamService';
import * as kbService from '@/lib/services/kbService';
import type { Team, TeamMember, KnowledgeBase, CreateKBInput } from '@/types/team';

export default function TeamHomePage() {
    const router = useRouter();
    const params = useParams();
    const teamId = params.teamId as string;
    const { currentUser, loading: authLoading, signOut } = useStorage();
    const { isOpen: isSearchOpen, openSearch, closeSearch } = useGlobalSearch();

    const [team, setTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateKBModalOpen, setIsCreateKBModalOpen] = useState(false);

    // 加载数据
    useEffect(() => {
        if (teamId && currentUser?.uid) {
            loadData();
        }
    }, [teamId, currentUser?.uid]);

    const loadData = async () => {
        if (!teamId || !currentUser?.uid) return;
        setLoading(true);
        try {
            const [teamData, membersData, kbData] = await Promise.all([
                teamService.getTeam(teamId),
                teamService.getTeamMembers(teamId),
                kbService.getKnowledgeBases(teamId)
            ]);
            setTeam(teamData);
            setMembers(membersData);
            setKnowledgeBases(kbData);
        } catch (error) {
            console.error('加载团队数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 创建知识库
    const handleCreateKB = async (input: CreateKBInput) => {
        if (!currentUser?.uid) return;
        const kb = await kbService.createKnowledgeBase(currentUser.uid, input);
        if (kb) {
            setKnowledgeBases(prev => [kb, ...prev]);
        }
    };

    // 进入知识库
    const handleKBClick = (kbId: string) => {
        router.push(`/teams/${teamId}/kb/${kbId}`);
    };

    // 登出
    const handleLogout = async () => {
        if (confirm('确定要退出吗?')) {
            await signOut();
            router.push('/login');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!team) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">团队不存在或无权访问</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* 左侧导航 */}
            <AppSidebar
                currentUser={currentUser}
                onLogout={handleLogout}
                onCreateDoc={() => { }}
                onUpload={() => { }}
                folders={[]}
                selectedFolderId={null}
                onSelectFolder={() => { }}
                onOpenSearch={openSearch}
            />

            {/* 主内容区 */}
            <main className="flex-1 overflow-auto">
                {/* 顶部标题栏 */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="text-sm text-gray-500 mb-1">团队主页</div>
                </header>

                <div className="p-6">
                    {/* 团队信息卡片 */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                                {team.avatarUrl ? (
                                    <img src={team.avatarUrl} alt={team.name} className="w-full h-full rounded-2xl object-cover" />
                                ) : (
                                    '👥'
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
                                <p className="text-gray-500">{team.description || ''}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsCreateKBModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus size={18} />
                            新建知识库
                        </button>
                    </div>

                    {/* 知识库区域 */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            团队知识库
                            <span className="text-sm font-normal text-gray-400">{knowledgeBases.length}</span>
                        </h2>

                        {knowledgeBases.length === 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <CreateKBCard onClick={() => setIsCreateKBModalOpen(true)} />
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {knowledgeBases.map(kb => (
                                    <KBCard
                                        key={kb.id}
                                        kb={kb}
                                        onClick={() => handleKBClick(kb.id)}
                                    />
                                ))}
                                <CreateKBCard onClick={() => setIsCreateKBModalOpen(true)} />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* 创建知识库弹窗 */}
            <CreateKBModal
                isOpen={isCreateKBModalOpen}
                onClose={() => setIsCreateKBModalOpen(false)}
                onSubmit={handleCreateKB}
                teamId={teamId}
                teamName={team.name}
            />

            {/* 搜索弹窗 */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={closeSearch}
                userId={currentUser?.uid}
                teamId={teamId}
                searchScope="team"
            />
        </div>
    );
}
