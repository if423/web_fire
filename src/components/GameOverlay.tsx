import { Play, RotateCcw, Trophy, Target } from 'lucide-react';

interface GameOverlayProps {
  gameOver: boolean;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onStart: () => void;
}

export default function GameOverlay({ gameOver, score, highScore, isNewHighScore, onStart }: GameOverlayProps) {
  if (gameOver) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30">
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-8 sm:p-12 text-center max-w-sm mx-4 shadow-2xl">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-white mb-2">游戏结束</h2>
          <div className="flex items-center justify-center gap-2 text-amber-400 text-3xl font-bold mb-2">
            <Target size={28} />
            {score}
          </div>
          <p className="text-slate-400 text-sm mb-1">
            本次得分
          </p>
          {isNewHighScore && (
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              <Trophy size={14} />
              新纪录!
            </div>
          )}
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-sm mb-6">
            <Trophy size={14} />
            历史最高: {highScore}
          </div>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/30"
          >
            <RotateCcw size={18} />
            再玩一次
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
      <div className="text-center">
        <div className="text-8xl mb-6">🎯</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
          靶心射手
        </h1>
        <p className="text-slate-300 text-lg mb-2 max-w-xs mx-auto">
          30秒内尽可能多地点击移动的靶心!
        </p>
        <p className="text-slate-400 text-sm mb-8">
          最后10秒靶心会缩小，挑战升级
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-lg rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/30"
        >
          <Play size={22} />
          开始游戏
        </button>
      </div>
    </div>
  );
}
