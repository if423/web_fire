import { useState, useCallback, useRef, useEffect } from 'react';
import StatusBar from './components/StatusBar';
import Bullseye from './components/Bullseye';
import StarField from './components/StarField';
import GameOverlay from './components/GameOverlay';
import ScorePopup from './components/ScorePopup';
import { useSound } from './hooks/useSound';

const GAME_DURATION = 30;
const BASE_SIZE = 70;
const SHRINK_FACTOR = 0.9;
const MARGIN = 60;

interface Popup {
  id: number;
  x: number;
  y: number;
}

function getHighScore(): number {
  try {
    return parseInt(localStorage.getItem('bullseye_high_score') || '0', 10);
  } catch {
    return 0;
  }
}

function setHighScore(score: number) {
  try {
    localStorage.setItem('bullseye_high_score', String(score));
  } catch {}
}

function randomPosition(areaW: number, areaH: number, size: number) {
  const pad = size / 2 + MARGIN;
  return {
    x: Math.random() * (areaW - pad * 2) + pad,
    y: Math.random() * (areaH - pad * 2) + pad,
  };
}

type GameState = 'idle' | 'playing' | 'over';

function App() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScoreState] = useState(getHighScore);
  const [soundOn, setSoundOn] = useState(true);
  const [targetPos, setTargetPos] = useState({ x: 300, y: 300 });
  const [popups, setPopups] = useState<Popup[]>([]);
  const [targetKey, setTargetKey] = useState(0);

  const areaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupIdRef = useRef(0);
  const { playDing, playGameOver } = useSound();

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const moveTarget = useCallback(() => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const size = timeLeft <= 10 ? BASE_SIZE * SHRINK_FACTOR : BASE_SIZE;
    const pos = randomPosition(rect.width, rect.height, size);
    setTargetPos(pos);
    setTargetKey((k) => k + 1);
  }, [timeLeft]);

  const endGame = useCallback(() => {
    clearTimer();
    setGameState('over');
    if (soundOn) playGameOver();
  }, [clearTimer, soundOn, playGameOver]);

  const startGame = useCallback(() => {
    clearTimer();
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
    setPopups([]);

    if (areaRef.current) {
      const rect = areaRef.current.getBoundingClientRect();
      const pos = randomPosition(rect.width, rect.height, BASE_SIZE);
      setTargetPos(pos);
      setTargetKey((k) => k + 1);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [clearTimer]);

  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
  }, [timeLeft, gameState, endGame]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft <= 10) {
      moveTarget();
    }
  }, [timeLeft <= 10]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    if (gameState === 'over') {
      const finalScore = score;
      if (finalScore > highScore) {
        setHighScoreState(finalScore);
        setHighScore(finalScore);
      }
    }
  }, [gameState]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleHit = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (gameState !== 'playing') return;
      e.stopPropagation();

      setScore((s) => s + 1);
      if (soundOn) playDing();

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top;

      const id = popupIdRef.current++;
      setPopups((p) => [...p, { id, x: cx, y: cy }]);
      setTimeout(() => setPopups((p) => p.filter((pp) => pp.id !== id)), 600);

      moveTarget();
    },
    [gameState, soundOn, playDing, moveTarget]
  );

  const targetSize = gameState === 'playing' && timeLeft <= 10 ? BASE_SIZE * SHRINK_FACTOR : BASE_SIZE;
  const shrinking = gameState === 'playing' && timeLeft <= 10;

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-emerald-950 flex flex-col">
      <StatusBar
        timeLeft={timeLeft}
        score={score}
        highScore={highScore}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((s) => !s)}
        gameActive={gameState === 'playing'}
      />

      <div ref={areaRef} className="flex-1 relative overflow-hidden">
        <StarField />

        {gameState === 'playing' && (
          <>
            <Bullseye
              key={targetKey}
              x={targetPos.x}
              y={targetPos.y}
              size={targetSize}
              onClick={handleHit}
              shrinking={shrinking}
            />
            {popups.map((p) => (
              <ScorePopup key={p.id} x={p.x} y={p.y} value={1} />
            ))}
          </>
        )}

        {gameState !== 'playing' && (
          <GameOverlay
            gameOver={gameState === 'over'}
            score={score}
            highScore={highScore}
            isNewHighScore={gameState === 'over' && score > 0 && score >= highScore}
            onStart={startGame}
          />
        )}

        {shrinking && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600/80 text-white text-sm font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm animate-pulse z-20">
            靶心缩小! 难度升级!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
