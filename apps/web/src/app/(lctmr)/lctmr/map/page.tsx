import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LearningMapPage() {
    const supabase = await createClient();

    // 1. 获取用户信息
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        // 未登录重定向到登录页
        redirect('/login?next=/lctmr/map');
    }

    // 2. 获取章节和节
    const { data: chapters, error: chaptersError } = await supabase
        .from('lctmr_chapters')
        .select(`
      *,
      sections:lctmr_sections(*)
    `)
        .order('sort_order', { ascending: true });

    if (chaptersError) {
        console.error('Failed to fetch chapters:', chaptersError);
    }

    // 3. 获取用户进度 (已完成的 Blocks)
    const { data: userProgress } = await supabase
        .from('lctmr_user_progress')
        .select('block_id')
        .eq('user_id', user.id)
        .eq('is_completed', true);

    const completedBlockIds = new Set(userProgress?.map(p => p.block_id));

    // 获取所有 section 下的 blocks 以便计算 section 完成度
    // 这里简化处理：我们假设每个 section 有一个完成状态
    // 实际上应该查询 block 的完成度
    const { data: allBlocks } = await supabase
        .from('lctmr_blocks') // 使用 lctmr_blocks
        .select('id, section_id');

    const sectionBlockMap = new Map<string, string[]>();
    allBlocks?.forEach(b => {
        const blocks = sectionBlockMap.get(b.section_id) || [];
        blocks.push(b.id);
        sectionBlockMap.set(b.section_id, blocks);
    });

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-fade-in">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    西行路 · 学习地图
                </h1>
                <p className="text-white/60 font-light tracking-wide">完成试炼，解锁下一难</p>
            </div>

            <div className="space-y-12">
                {chapters?.map((chapter, index) => (
                    <div key={chapter.id} className="relative">
                        {/* Chapter Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-gradient-to-br from-amber-600 to-yellow-700 text-white px-4 py-1.5 rounded-lg shadow-lg border border-amber-400/30 font-bold text-sm tracking-widest uppercase">
                                第 {index + 1} 章
                            </div>
                            <h3 className="text-2xl font-bold text-white shadow-black drop-shadow-md tracking-wide">
                                {chapter.title}
                            </h3>
                        </div>

                        {/* Sections Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                            {chapter.sections?.sort((a: any, b: any) => a.sort_order - b.sort_order).map((section: any) => {
                                // 计算进度
                                const sectionBlocks = sectionBlockMap.get(section.id) || [];
                                const totalBlocks = sectionBlocks.length;
                                const completedCount = sectionBlocks.filter(id => completedBlockIds.has(id)).length;
                                const isCompleted = totalBlocks > 0 && completedCount === totalBlocks;
                                const isLocked = false; // TODO: Implement locking logic based on previous chapter completion

                                return (
                                    <Link
                                        key={section.id}
                                        href={`/lctmr/play/${section.id}`}
                                        className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 flex items-center gap-5
                       ${isCompleted
                                                ? 'bg-cyan-900/20 border-cyan-500/30 hover:bg-cyan-900/40 hover:border-cyan-400'
                                                : 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/30'
                                            }
                     `}
                                    >
                                        <div className={`
                        w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 shadow-lg group-hover:scale-105
                        ${isCompleted
                                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-cyan-500/20'
                                                : 'bg-white/5 border-white/10 text-white/40'
                                            }
                      `}>
                                            {isCompleted ? (
                                                <CheckCircle className="w-7 h-7" />
                                            ) : (
                                                <PlayCircle className="w-7 h-7 group-hover:text-cyan-300 transition-colors" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`font-bold text-lg truncate transition-colors ${isCompleted ? 'text-cyan-100' : 'text-gray-200 group-hover:text-white'}`}>
                                                    {section.title}
                                                </h4>
                                                {isCompleted && (
                                                    <span className="text-xs bg-cyan-900/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                                                        已完成
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                                                {section.description || "暂无描述"}
                                            </p>

                                            {/* Progress Bar */}
                                            {totalBlocks > 0 && (
                                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-cyan-500 transition-all duration-500"
                                                        style={{ width: `${(completedCount / totalBlocks) * 100}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
