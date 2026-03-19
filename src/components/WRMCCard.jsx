import '../onboarding.css';
import { WalmartSpark } from './WalmartSpark';

// Fixed barcode pattern (deterministic, not random)
const BARCODE_BARS = [
  2,1,3,1,2,1,1,2,4,1,2,1,3,2,1,1,2,1,3,1,
  1,2,1,3,2,1,4,1,2,1,1,3,1,2,1,2,3,1,1,2,
];
const BARCODE_GAPS = [
  1,2,1,1,2,1,2,1,1,2,1,1,2,1,2,1,1,2,1,1,
  2,1,2,1,1,2,1,1,2,1,2,1,1,2,1,2,1,1,2,1,
];

function Barcode() {
  const VB_WIDTH = 200;
  const PAD = 10;
  const usable = VB_WIDTH - PAD * 2;
  // Calculate raw total width of bars+gaps
  let rawTotal = 0;
  for (let i = 0; i < BARCODE_BARS.length; i++) {
    rawTotal += BARCODE_BARS[i] + (BARCODE_GAPS[i] || 0);
  }
  // Last bar has no trailing gap
  rawTotal -= BARCODE_GAPS[BARCODE_BARS.length - 1] || 0;
  const scale = usable / rawTotal;
  let x = PAD;
  const rects = BARCODE_BARS.map((w, i) => {
    const sw = w * scale;
    const rect = <rect key={i} x={x} y={0} width={sw} height={52} fill="#111" rx={0.5} />;
    x += sw + (BARCODE_GAPS[i] || 0) * scale;
    return rect;
  });
  return (
    <svg width="100%" height={52} viewBox={`0 0 ${VB_WIDTH} 52`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {rects}
    </svg>
  );
}

export function WRMCCard({ variant = 'card', masked = true, active = false, frozen = false, name = 'S. MARTIN' }) {
  const fullNumber = '4821 1234 5678 4821';
  const maskedNumber = '•••• •••• •••• 4821';
  const displayNumber = masked ? maskedNumber : fullNumber;

  const showActive = variant === 'active' || active;

  if (variant === 'tsp') {
    return (
      <div className="wrmc-card">
        {/* Top row */}
        <div className="wrmc-card-top">
          <WalmartSpark size={28} />
          <div className="wrmc-card-top-right">
            <span className="wrmc-card-brand">TEMPORARY SHOPPING PASS</span>
          </div>
        </div>

        {/* Barcode */}
        <div style={{ margin: '12px auto 0', textAlign: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#FFFFFF', borderRadius: 6, padding: '10px 14px',
            width: '80%', maxWidth: 200, margin: '0 auto',
            boxSizing: 'border-box', overflow: 'hidden',
          }}>
            <Barcode />
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
            Scan at Walmart checkout
          </div>
        </div>
      </div>
    );
  }

  // variant="card" or variant="active"
  return (
    <div className="wrmc-card">
      {/* Top row */}
      <div className="wrmc-card-top">
        <WalmartSpark size={28} />
        <div className="wrmc-card-top-right">
          <span className="wrmc-card-brand">WALMART REWARDS</span>
          {showActive && <span className="wrmc-card-active-badge">ACTIVE</span>}
          {frozen && <span className="wrmc-card-frozen-badge">FROZEN</span>}
        </div>
      </div>

      {/* Card number */}
      <div className="wrmc-card-number">{displayNumber}</div>

      {/* Bottom row */}
      <div className="wrmc-card-bottom">
        <div className="wrmc-card-info">
          <span className="wrmc-card-name">{name}</span>
          <span className="wrmc-card-expiry">VALID THRU 03/29</span>
        </div>
        <div className="wrmc-card-mastercard">
          <div className="wrmc-card-mc-circle wrmc-card-mc-red" />
          <div className="wrmc-card-mc-circle wrmc-card-mc-orange" />
        </div>
      </div>
    </div>
  );
}
