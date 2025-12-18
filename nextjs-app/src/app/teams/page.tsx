"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, Loader2 } from 'lucide-react';
import AppSidebar from '@/components/layout/AppSidebar';
import TeamCard from '@/components/Team/TeamCard';
import CreateTeamModal from '@/components/Team/CreateTeamModal';
import { useStorage } from '@/contexts/StorageContext';
import * as teamService from '@/lib/services/teamService';
import type { Team, CreateTeamInput } from '@/types/team';

export default function TeamsPage() {
    const router = useRouter();
    const { currentUser, loading: authLoading, signOut } = useStorage();

    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // 加载团队列表
    useEffect(() => {
        if (currentUser?.uid) {
            loadTeams();
        }
    }, [currentUser?.uid]);

    const loadTeams = async () => {
        if (!currentUser?.uid) return;
        setLoading(true);
        try {
            const data = await teamService.getUserTeams(currentUser.uid);
            setTeams(data);
        } catch (error) {
            console.error('加载团队列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 创建团队
    const handleCreateTeam = async (input: CreateTeamInput) => {
        if (!currentUser?.uid) return;
        const team = await teamService.createTeam(currentUser.uid, input);
        if (team) {
            setTeams(prev => [team, ...prev]);
            // 跳转到团队主页
            router.push(`/teams/${team.id}`);
        }
    };

    // 跳转到团队主页
    const handleTeamClick = (teamId: string) => {
        router.push(`/teams/${teamId}`);
    };

    // 登出
    const handleLogout = async () => {
        if (confirm('确定要退出吗?')) {
            await signOut();
            router.push('/login');
        }
    };

    // 认证加载中
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // 未登录
    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">请先登录</p>
                    <a href="/login" className="text-blue-600 hover:underline">前往登录页面</a>
                </div>
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
            />

            {/* 主内容区 */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    {/* 页面头部 */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">我的团队</h1>
                            <p className="text-gray-500 mt-1">管理您的团队和知识库</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus size={18} />
                            新建团队
                        </button>
                    </div>

                    {/* 团队列表 */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : teams.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无团队</h3>
                            <p className="text-gray-500 mb-6">创建您的第一个团队，开始协作</p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Plus size={18} />
                                新建团队
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {teams.map(team => (
                                <TeamCard
                                    key={team.id}
                                    team={team}
                                    onClick={() => handleTeamClick(team.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* 创建团队弹窗 */}
            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateTeam}
            />
        </div>
    );
}
