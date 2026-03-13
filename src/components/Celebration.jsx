export function Celebration({ show }) {
  if (!show) return null;
  const pieces = Array.from({ length: 12 }, (_, i) => ({
    left: `${10 + Math.random() * 80}%`,
    delay: `${Math.random() * 0.4}s`,
    bg: ['#999', '#bbb', '#666', '#444'][i % 4],
  }));
  return (
    <div
      style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 420, height: '100%', pointerEvents: 'none', zIndex: 300,
      }}
      role="status"
      aria-label="Celebration"
    >
      {pieces.map((p, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: p.left, top: '30%',
            background: p.bg, animationDelay: p.delay,
            borderRadius: i % 2 ? '50%' : '2px',
          }}
        />
      ))}
      <div className="celebrate" style={{
        position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)',
        background: 'white', padding: '24px 32px', borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)', textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>★</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Milestone Reached!</div>
        <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Keep earning rewards</div>
      </div>
    </div>
  );
}
