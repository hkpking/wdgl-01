import Link from 'next/link';
import { BookOpen, Trophy } from 'lucide-react';

export default function LctmrLobby() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-12">
            <div className="text-center space-y-4 max-w-2xl animate-fade-in-up">
                <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                    选择你的试炼之旅
                </h2>
                <p className="text-cyan-100/70 text-xl font-light tracking-wide">
                    重铸流程秩序，觉醒天命之力
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
                {/* Story Mode Card */}
                <Link
                    href="/lctmr/map"
                    className="group relative bg-black/40 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-10 hover:border-cyan-400 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] flex flex-col items-center text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="w-24 h-24 rounded-full bg-cyan-900/30 flex items-center justify-center mb-8 border border-cyan-500/30 group-hover:scale-110 group-hover:bg-cyan-900/50 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <BookOpen className="w-10 h-10 text-cyan-300" />
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">剧情模式</h3>
                    <p className="text-gray-300 mb-8 relative z-10 leading-relaxed text-lg">
                        跟随《无字真书》的指引，像玄奘西行一样，
                        经历八十一难，探索流程真经的奥秘。
                    </p>

                    <span className="px-8 py-3 rounded-full bg-cyan-600/20 border border-cyan-500/50 text-cyan-300 font-bold group-hover:bg-cyan-500 group-hover:text-black transition-all shadow-lg hover:shadow-cyan-500/50">
                        开始旅程 →
                    </span>
                </Link>

                {/* Arcade Mode Card (More features) */}
                <div className="group relative bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/30 p-10 hover:border-purple-400 transition-all duration-300 flex flex-col items-center text-center overflow-hidden grayscale hover:grayscale-0 cursor-not-allowed opacity-80 hover:opacity-100">
                    <div className="absolute top-4 right-4 px-2 py-1 bg-purple-900/80 text-purple-200 text-xs rounded border border-purple-500/50 font-mono">
                        COMING SOON
                    </div>

                    <div className="w-24 h-24 rounded-full bg-purple-900/30 flex items-center justify-center mb-8 border border-purple-500/30">
                        <Trophy className="w-10 h-10 text-purple-300" />
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4">天梯排位</h3>
                    <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                        与其他天命人一决高下，通过知识问答挑战，
                        争夺流程宗师的荣耀。
                    </p>

                    <span className="px-8 py-3 rounded-full border border-gray-600 text-gray-400 font-medium">
                        等待开启
                    </span>
                </div>
            </div>
        </div>
    );
}
