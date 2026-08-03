import { Clock, Trophy, Target, Volume2, VolumeX } from 'lucide-react';

interface StatusBarProps {
  timeLeft: number;
  score: number;
  highScore: number;
  soundOn: boolean;
  onToggleSound: () => void;
  gameActive: boolean;
}

export default function StatusBar({ timeLeft, score, highScore, soundOn, onToggleSound, gameActive }: StatusBarProps) {
  const isUrgent = timeLeft <= 10 && gameActive;

  return (
    <div className="flex items-center justify-between px-4 sm:px-8 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-4 sm:gap-8">
        <div className={`flex items-center gap-2 ${isUrgent ? 'text-red-400 countdown-pulse' : 'text-slate-200'}`}>
          <Clock size={18} />
          <span className="font-mono text-lg font-semibold tabular-nums min-w-[2ch] text-center">
            {timeLeft}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">秒</span>
        </div>
        <div className="flex items-center gap-2 text-amber-400">
          <Target size={18} />
          <span className="font-mono text-lg font-semibold tabular-nums min-w-[2ch] text-center">
            {score}
          </span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400">
          <Trophy size={18} />
          <span className="font-mono text-lg font-semibold tabular-nums min-w-[2ch] text-center">
            {highScore}
          </span>
        </div>
      </div>
      <button
        onClick={onToggleSound}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
        title={soundOn ? '关闭音效' : '开启音效'}
      >
        {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
}
