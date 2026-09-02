import { useMemo } from 'react';

interface BullseyeProps {
  x: number;
  y: number;
  size: number;
  onClick: (e: React.MouseEvent | React.TouchEvent) => void;
  shrinking: boolean;
}

export default function Bullseye({ x, y, size, onClick, shrinking }: BullseyeProps) {
  const outerSize = size;
  const midSize = size * 0.68;
  const innerSize = size * 0.36;
  const coreSize = size * 0.15;

  const ringStyle = (s: number, color: string, border: string) => ({
    width: s,
    height: s,
    backgroundColor: color,
    border: `2px solid ${border}`,
  });

  const glowSize = useMemo(() => {
    return shrinking ? '0 0 30px rgba(239,68,68,0.7), 0 0 80px rgba(239,68,68,0.3)' : '0 0 20px rgba(239,68,68,0.4), 0 0 60px rgba(239,68,68,0.1)';
  }, [shrinking]);

  return (
    <div
      className="absolute bullseye-enter cursor-pointer"
      style={{
        left: x - outerSize / 2,
        top: y - outerSize / 2,
        width: outerSize,
        height: outerSize,
        zIndex: 10,
      }}
      onClick={onClick}
      onTouchStart={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <div
        className="rounded-full absolute inset-0 flex items-center justify-center"
        style={{
          ...ringStyle(outerSize, '#dc2626', '#991b1b'),
          boxShadow: glowSize,
          animation: 'pulse-glow 1.5s ease-in-out infinite',
          transition: 'box-shadow 0.3s',
        }}
      >
        <div
          className="rounded-full flex items-center justify-center"
          style={ringStyle(midSize, '#ffffff', '#e5e5e5')}
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={ringStyle(innerSize, '#dc2626', '#991b1b')}
          >
            <div
              className="rounded-full"
              style={{
                width: coreSize,
                height: coreSize,
                backgroundColor: '#ffffff',
                border: '1px solid #e5e5e5',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
