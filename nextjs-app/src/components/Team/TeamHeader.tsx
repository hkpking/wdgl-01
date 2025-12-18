"use client";

import React from 'react';
import { Settings, Users, Plus, Image } from 'lucide-react';
import type { Team, TeamMemberRole } from '@/types/team';
import { getTeamPermissions } from '@/types/team';

interface TeamHeaderProps {
    team: Team;
    userRole: TeamMemberRole | null;
    memberCount: number;
    onSettings?: () => void;
    onInvite?: () => void;
    onChangeCover?: () => void;
}

export default function TeamHeader({
    team,
    userRole,
    memberCount,
    onSettings,
    onInvite,
    onChangeCover
}: TeamHeaderProps) {
    const permissions = getTeamPermissions(userRole);

    return (
        <div className="relative">
            {/* 封面图 */}
            <div className="h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
                {team.coverUrl && (
                    <img
                        src={team.coverUrl}
                        alt="团队封面"
                        className="w-full h-full object-cover"
                    />
                )}

                {/* 更换封面按钮 */}
                {permissions.canEdit && onChangeCover && (
                    <button
                        onClick={onChangeCover}
                        className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/30 hover:bg-black/50 text-white text-sm rounded-lg transition"
                    >
                        <Image size={14} />
                        添加封面
                    </button>
                )}

                {/* 设置按钮 */}
                {permissions.canEdit && onSettings && (
                    <button
                        onClick={onSettings}
                        className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-lg transition"
                    >
                        <Settings size={18} />
                    </button>
                )}
            </div>

            {/* 团队信息区 */}
            <div className="px-6 pb-6">
                <div className="flex items-end gap-4 -mt-10 relative z-10">
                    {/* 团队头像 */}
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl border-4 border-white">
                        {team.avatarUrl ? (
                            <img src={team.avatarUrl} alt={team.name} className="w-full h-full rounded-xl object-cover" />
                        ) : (
                            '👥'
                        )}
                    </div>

                    {/* 团队名称和描述 */}
                    <div className="flex-1 min-w-0 pb-1">
                        <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
                        {team.description && (
                            <p className="text-gray-500 line-clamp-1 mt-0.5">{team.description}</p>
                        )}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-2 pb-1">
                        {permissions.canManageMembers && onInvite && (
                            <button
                                onClick={onInvite}
                                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                            >
                                <Plus size={16} />
                                邀请成员
                            </button>
                        )}
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                            <Users size={16} />
                            {memberCount} 成员
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
