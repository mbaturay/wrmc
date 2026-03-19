import { useState } from 'react';
import { REDEMPTION_INCREMENT, redeemableAmount } from '../data/rewards';

export function Rewards({ rewardsAvailable, redemptions, earningHistory, pendingRewards, welcomeBonus, isNewUser, onRedeem }) {
  const redeemable = redeemableAmount(rewardsAvailable);
  const remainder = +(rewardsAvailable - redeemable).toFixed(2);
  const untilNext5 = +(REDEMPTION_INCREMENT - remainder).toFixed(2);

  return (
    <div className="screen">

      {/* Balance card */}
      <div className="card" style={{ textAlign: 'center', paddingTop: 24, paddingBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
          Walmart Reward Dollars
        </div>
        <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>
          ${rewardsAvailable.toFixed(2)}
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: 'var(--text-muted)' }}>
          Ready to use at Walmart
        </div>

        {/* Pending — explicit, not hidden */}
        {pendingRewards > 0 && (
          <div style={{
            marginTop: 16, paddingTop: 16,
            borderTop: '1px solid var(--border)',
            fontSize: 13,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Pending</span>
              <span>+${pendingRewards.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Earned on recent purchases — posts within 1–2 business days
            </div>
          </div>
        )}
      </div>

      {/* Redemption simulation */}
      {redeemable >= 5 ? (
        <RedemptionSection rewardsAvailable={rewardsAvailable} redeemable={redeemable} onRedeem={onRedeem} />
      ) : rewardsAvailable > 0 && rewardsAvailable < 5 ? (
        <div style={{
          padding: '12px 16px', background: 'var(--bg)', borderRadius: 12,
          fontSize: 13, color: 'var(--text-muted)', textAlign: 'center',
        }}>
          Keep earning — ${(5 - rewardsAvailable).toFixed(2)} more until your next $5 redemption
        </div>
      ) : null}

      {/* Earned this year */}
      <div className="card">
        <div className="card-title">Earned this year</div>
        {earningHistory.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '10px 0', lineHeight: 1.5 }}>
            No rewards earned yet — your first purchase will show up here.
          </div>
        ) : (
          <>
            {earningHistory.map((entry, i) => (
              <div
                key={entry.month}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: i < earningHistory.length - 1 ? '1px solid var(--accent-light)' : 'none',
                }}
              >
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{entry.month}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--success)' }}>+${entry.amount.toFixed(2)}</span>
              </div>
            ))}
            {/* Progress note toward next $5 */}
            {remainder > 0 && redeemable < rewardsAvailable && (
              <div style={{
                marginTop: 10, padding: '8px 10px',
                background: 'var(--accent-light)',
                borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--text-muted)',
              }}>
                ${untilNext5.toFixed(2)} more to unlock your next reward dollar
              </div>
            )}
          </>
        )}
      </div>

      {/* Earning rate reminder */}
      <div
        className="card"
        style={{
          background: 'var(--bg)',
          border: 'none',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          You earn 3% back at Walmart and 1% everywhere else — automatically.
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Use your card in-store, on Walmart.ca, or anywhere Mastercard is accepted
        </div>
      </div>

      {/* How to use */}
      <div className="card">
        <div className="card-title">How to Use Your Reward Dollars</div>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>At Walmart checkout</div>
            Swipe your physical card at the terminal. It will ask if you want to apply Reward Dollars. Choose your amount in $5 increments.
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>On Walmart.ca</div>
            At checkout, select "Redeem Reward Dollars" and choose your amount in $5 increments.
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Want to save up?</div>
            Skip it at checkout anytime — your balance never expires and there's no pressure to use it.
          </div>
        </div>
      </div>

      {/* History */}
      {redemptions.length > 0 && (
        <div className="card">
          <div className="card-title">Recent Redemptions</div>
          {redemptions.map((r, i) => (
            <div
              key={r.id}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < redemptions.length - 1 ? '1px solid var(--accent-light)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>-${r.amount.toFixed(2)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.type}</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.date}</div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {redemptions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: 20 }}>
          No redemptions yet — your balance is building.
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// RedemptionSection — button + bottom sheet
// ═══════════════════════════════════════════════════════
function RedemptionSection({ rewardsAvailable, redeemable, onRedeem }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetStep, setSheetStep] = useState(1); // 1 | 2 | 3
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const pillAmounts = [5, 10, 15, 20, 25].filter((a) => a <= redeemable);
  const amount = selectedAmount || 0;
  const customNum = +customValue || 0;
  const activeAmount = customMode ? customNum : amount;
  const customValid = customNum > 0 && customNum <= redeemable && customNum % 5 === 0;
  const canContinue = customMode ? customValid : amount > 0;

  function openSheet() {
    setSheetStep(1);
    setSelectedAmount(null);
    setCustomMode(false);
    setCustomValue('');
    setSheetOpen(true);
  }

  function handleConfirm() {
    onRedeem(activeAmount);
    setSheetStep(3);
  }

  return (
    <>
      <div>
        <button
          onClick={openSheet}
          style={{
            width: '100%', padding: '14px 20px',
            background: 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 12, cursor: 'pointer',
            fontSize: 15, fontWeight: 600,
          }}
        >
          Redeem Reward Dollars
        </button>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
          Redeemable in $5 increments at Walmart checkout or Walmart.ca
        </div>
      </div>

      {/* Bottom sheet overlay */}
      {sheetOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          }}
          onClick={(e) => { if (e.target === e.currentTarget && sheetStep !== 3) setSheetOpen(false); }}
        >
          <div style={{
            background: 'var(--surface)', borderRadius: '20px 20px 0 0',
            padding: '24px 20px', paddingBottom: 'calc(var(--nav-height, 70px) + 24px)',
            maxHeight: '80vh', overflowY: 'auto',
          }}>

            {/* ── Step 1: Choose amount ── */}
            {sheetStep === 1 && (
              <>
                <div style={{
                  width: 36, height: 4, borderRadius: 2, background: '#DDD',
                  margin: '0 auto 20px',
                }} />
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                  How much would you like to redeem?
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                  ${rewardsAvailable.toFixed(2)} available
                </div>

                {/* Pill selector */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {pillAmounts.map((a) => (
                    <button
                      key={a}
                      onClick={() => { setSelectedAmount(a); setCustomMode(false); setCustomValue(''); }}
                      style={{
                        padding: '10px 18px', borderRadius: 20, cursor: 'pointer',
                        fontSize: 15, fontWeight: 600, border: '1.5px solid',
                        transition: 'all 0.15s',
                        ...(selectedAmount === a && !customMode
                          ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }
                          : { background: 'var(--surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }),
                      }}
                    >
                      ${a}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                {!customMode ? (
                  <button
                    onClick={() => { setCustomMode(true); setSelectedAmount(null); }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 13, color: 'var(--accent)', fontWeight: 500,
                      padding: 0, marginBottom: 20,
                    }}
                  >
                    Enter different amount
                  </button>
                ) : (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                        fontSize: 15, color: 'var(--text-muted)',
                      }}>$</span>
                      <input
                        type="number"
                        className="input"
                        placeholder="0"
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        min={5}
                        max={redeemable}
                        step={5}
                        style={{ paddingLeft: 28 }}
                        autoFocus
                      />
                    </div>
                    {customValue && !customValid && (
                      <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>
                        Must be a multiple of $5{customNum > redeemable ? ` and cannot exceed $${redeemable.toFixed(0)}` : ''}
                      </div>
                    )}
                  </div>
                )}

                <button
                  className="btn btn-primary"
                  onClick={() => setSheetStep(2)}
                  disabled={!canContinue}
                  style={{ opacity: canContinue ? 1 : 0.5 }}
                >
                  Continue
                </button>
              </>
            )}

            {/* ── Step 2: Confirm ── */}
            {sheetStep === 2 && (
              <>
                <div style={{
                  width: 36, height: 4, borderRadius: 2, background: '#DDD',
                  margin: '0 auto 20px',
                }} />
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
                  Confirm redemption
                </div>

                <div style={{
                  padding: 16, background: '#FAFAFA', borderRadius: 12,
                  border: '1px solid var(--border)', marginBottom: 16,
                }}>
                  {[
                    { label: 'Redeeming', value: `$${activeAmount.toFixed(2)}` },
                    { label: 'Remaining after', value: `$${(rewardsAvailable - activeAmount).toFixed(2)}` },
                    { label: 'Use at', value: 'Walmart stores or Walmart.ca' },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                      borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                      fontSize: 14,
                    }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                      <span style={{ fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  padding: '10px 14px', background: '#FFFBEB', borderRadius: 8,
                  border: '0.5px solid #E6D5A0', fontSize: 12, color: '#8D6E00',
                  lineHeight: 1.5, marginBottom: 20,
                }}>
                  Your Reward Dollars will be applied at the checkout terminal automatically when you pay with your Walmart Rewards Mastercard.
                </div>

                <button className="btn btn-primary" style={{ marginBottom: 10 }} onClick={handleConfirm}>
                  Confirm
                </button>
                <button className="btn btn-secondary" onClick={() => setSheetStep(1)}>
                  Go back
                </button>
              </>
            )}

            {/* ── Step 3: Queued ── */}
            {sheetStep === 3 && (
              <>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  textAlign: 'center', padding: '20px 0',
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'var(--success-bg)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20, animation: 'scaleIn 0.4s ease-out',
                  }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path
                        d="M9 16L14 21L23 11"
                        stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: 'drawCheck 0.5s ease-out 0.3s forwards' }}
                      />
                    </svg>
                  </div>
                  <style>{`
                    @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
                    @keyframes drawCheck { to { stroke-dashoffset: 0; } }
                  `}</style>

                  <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>You're all set</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                    ${activeAmount.toFixed(2)} in Reward Dollars will be applied at your next Walmart checkout automatically.
                  </div>
                  <div style={{
                    fontSize: 16, fontWeight: 600, marginBottom: 16,
                  }}>
                    New balance: ${rewardsAvailable.toFixed(2)}
                  </div>
                  <div style={{
                    padding: '10px 14px', background: 'var(--bg)', borderRadius: 8,
                    fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 20,
                    width: '100%',
                  }}>
                    This is a prototype simulation. In the real app, redemption happens automatically at the POS terminal.
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setSheetOpen(false)}>
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
