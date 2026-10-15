// A tailor's tape measure, drawn as a decorative divider.
export default function Tape({ className = '' }) {
  const ticks = [];
  for (let i = 0; i <= 120; i += 1) {
    const x = i * 10;
    const long = i % 10 === 0;
    const mid = i % 5 === 0;
    ticks.push(<line key={i} x1={x} x2={x} y1="0" y2={long ? 18 : mid ? 12 : 7} />);
    if (long && i > 0 && i < 120) {
      ticks.push(
        <text key={`t${i}`} x={x} y="31" textAnchor="middle">
          {i / 10}
        </text>
      );
    }
  }
  return (
    <svg className={`tape ${className}`} viewBox="0 0 1200 40" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="1200" height="40" className="tape__band" />
      <g className="tape__ticks">{ticks}</g>
    </svg>
  );
}
