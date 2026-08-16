interface ScorePopupProps {
  x: number;
  y: number;
  value: number;
}

export default function ScorePopup({ x, y, value }: ScorePopupProps) {
  return (
    <div
      className="absolute pointer-events-none score-fly text-yellow-300 font-bold text-2xl"
      style={{ left: x - 16, top: y - 24, zIndex: 20 }}
    >
      +{value}
    </div>
  );
}
