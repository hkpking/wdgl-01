"use client";

import React from 'react';
import { Users, Lock, Globe, ChevronRight } from 'lucide-react';
import type { Team } from '@/types/team';

interface TeamCardProps {
    team: Team;
    onClick: () => void;
    memberCount?: number;
}

export default function TeamCard({ team, onClick, memberCount }: TeamCardProps) {
    const getVisibilityIcon = () => {
        switch (team.visibility) {
            case 'public': return <Globe size={12} className="text-green-500" />;
            case 'private': return <Lock size={12} className="text-gray-400" />;
            default: return <Users size={12} className="text-blue-500" />;
        }
    };

    return (
        <button
            onClick={onClick}
            className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition group"
        >
            <div className="flex items-start gap-4">
                {/* 团队头像 */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                    {team.avatarUrl ? (
                        <img src={team.avatarUrl} alt={team.name} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                        '👥'
                    )}
                </div>

                {/* 团队信息 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-700">
                            {team.name}
                        </h3>
                        {getVisibilityIcon()}
                    </div>
                    {team.description && (
                        <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                            {team.description}
                        </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Users size={12} />
                            {memberCount ?? '?'} 成员
                        </span>
                    </div>
                </div>

                {/* 箭头 */}
                <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 flex-shrink-0 mt-1" />
            </div>
        </button>
    );
}
