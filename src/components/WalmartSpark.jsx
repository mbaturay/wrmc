export function WalmartSpark({ size = 28, color = '#FFC220' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <g transform="translate(50,50)">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path
            key={angle}
            d="M0,-8 L5,-38 L0,-44 L-5,-38 Z"
            fill={color}
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
    </svg>
  );
}
