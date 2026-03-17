import '../onboarding.css';

export function WRMCCard({ masked = true, active = false, frozen = false, name = 'S. MARTIN' }) {
  const fullNumber = '4821 1234 5678 4821';
  const maskedNumber = '•••• •••• •••• 4821';
  const displayNumber = masked ? maskedNumber : fullNumber;

  return (
    <div className="wrmc-card">
      {/* Top row */}
      <div className="wrmc-card-top">
        <svg className="wrmc-card-spark" viewBox="0 0 32 32" width="32" height="32">
          <polygon
            points="16,0 19.5,11.5 32,12 22,20 25.5,32 16,24 6.5,32 10,20 0,12 12.5,11.5"
            fill="#FFC220"
          />
        </svg>
        <div className="wrmc-card-top-right">
          <span className="wrmc-card-brand">WALMART REWARDS</span>
          {active && <span className="wrmc-card-active-badge">ACTIVE</span>}
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
