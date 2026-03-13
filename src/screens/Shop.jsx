import { useState } from 'react';

export function Shop({ cartItems, switchToGV, checkedOut, setCheckedOut }) {
  const [showReceipt, setShowReceipt] = useState(false);

  const items = cartItems.map(i => {
    if (i.switched && i.gvAlt) {
      return { ...i, name: i.gvAlt.name, price: i.gvAlt.price, brand: 'Great Value', isWalmartBrand: true };
    }
    return i;
  });

  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const tax = +(subtotal * 0.13).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  const expectedReward = +(subtotal * 0.0125).toFixed(2);
  const totalSavingsFromSwitch = cartItems.reduce((s, i) => s + (i.switched && i.gvAlt ? i.gvAlt.savings : 0), 0);
  const switchableCount = cartItems.filter(i => i.gvAlt && !i.switched).length;
  const potentialSavings = cartItems.reduce((s, i) => s + (i.gvAlt && !i.switched ? i.gvAlt.savings : 0), 0);

  if (showReceipt) {
    return (
      <div className="screen">
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Order Complete</div>
          <div className="text-muted">Here's your receipt breakdown</div>
        </div>
        <div className="receipt">
          {items.map(i => (
            <div className="receipt-line" key={i.id}>
              <span>{i.name}</span>
              <span>${i.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="receipt-divider" />
          <div className="receipt-line"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="receipt-line"><span>HST (13%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="receipt-divider" />
          <div className="receipt-line"><span><strong>Total</strong></span><span><strong>${total.toFixed(2)}</strong></span></div>
          <div className="receipt-divider" />
          <div className="receipt-line" style={{ color: 'var(--success)' }}>
            <span><strong>Rewards earned</strong></span>
            <span><strong>+${expectedReward.toFixed(2)}</strong></span>
          </div>
          {totalSavingsFromSwitch > 0 && (
            <div className="receipt-line" style={{ color: 'var(--warning)' }}>
              <span><strong>Saved by switching</strong></span>
              <span><strong>${totalSavingsFromSwitch.toFixed(2)}</strong></span>
            </div>
          )}
          <div className="receipt-divider" />
          <div className="receipt-line">
            <span><strong>Effective savings</strong></span>
            <span><strong>${(expectedReward + totalSavingsFromSwitch).toFixed(2)}</strong></span>
          </div>
          <div className="text-sm text-muted mt-8" style={{ fontStyle: 'italic' }}>
            Rewards calculated on pre-tax amount of ${subtotal.toFixed(2)}
          </div>
        </div>
        <button className="btn btn-secondary mt-16" onClick={() => { setShowReceipt(false); setCheckedOut(false); }}>
          Shop Again
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Cart Preview</div>
      <div className="text-sm text-muted mb-16">{items.length} items &middot; See your rewards before checkout</div>

      {/* Competent-friend nudge — cart level */}
      {switchableCount > 0 && (
        <div className="friend-nudge mb-16">
          <div className="friend-nudge-icon">?</div>
          <div>
            {switchableCount === 1
              ? <>There's <strong>1 item</strong> with a Great Value alternative. Switching saves you <strong>${potentialSavings.toFixed(2)}</strong> with no change to your reward rate.</>
              : <>There are <strong>{switchableCount} items</strong> with Great Value alternatives. Switching them all saves <strong>${potentialSavings.toFixed(2)}</strong> — same rewards, lower bill.</>
            }
          </div>
        </div>
      )}

      {items.map(item => {
        const original = cartItems.find(c => c.id === item.id);
        return (
          <div key={item.id} className="card" style={{ padding: 12 }}>
            <div className="flex justify-between items-center">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                <div className="flex gap-8 items-center mt-8">
                  <span style={{ fontSize: 15, fontWeight: 700 }}>${item.price.toFixed(2)}</span>
                  {item.isWalmartBrand && <span className="tag tag-success">Earn 1.25%</span>}
                  {!item.isWalmartBrand && <span className="tag tag-default">Earn 1.25%</span>}
                </div>
                <div className="text-sm text-muted mt-8">
                  Est. reward: +${(item.price * item.rate).toFixed(2)}
                </div>
              </div>
            </div>
            {/* Nudge for GV alternatives */}
            {original.gvAlt && !original.switched && (
              <div className="nudge">
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                  Switch to <strong>{original.gvAlt.name}</strong> and save ${original.gvAlt.savings.toFixed(2)}
                </div>
                <div className="nudge-actions">
                  <button className="btn btn-sm btn-primary" onClick={() => switchToGV(item.id)}>
                    Switch
                  </button>
                  <button className="btn btn-sm btn-ghost">Keep</button>
                </div>
              </div>
            )}
            {original.switched && (
              <div className="tag tag-success mt-8">Switched — saving ${original.gvAlt.savings.toFixed(2)}</div>
            )}
          </div>
        );
      })}

      {/* Predictive reward preview */}
      <div className="card" style={{ background: 'var(--success-bg)', borderColor: 'var(--success)' }}>
        <div className="card-title" style={{ color: 'var(--success)' }}>Reward Preview</div>
        <div className="receipt-line">
          <span>Subtotal (pre-tax)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="receipt-line">
          <span>Expected rewards</span>
          <span style={{ color: 'var(--success)', fontWeight: 700 }}>+${expectedReward.toFixed(2)}</span>
        </div>
        {totalSavingsFromSwitch > 0 && (
          <div className="receipt-line">
            <span>Product switch savings</span>
            <span style={{ color: 'var(--warning)', fontWeight: 700 }}>${totalSavingsFromSwitch.toFixed(2)}</span>
          </div>
        )}
        <div className="receipt-divider" />
        <div className="receipt-line">
          <span><strong>Total effective savings</strong></span>
          <span><strong>${(expectedReward + totalSavingsFromSwitch).toFixed(2)}</strong></span>
        </div>
      </div>

      <button className="btn btn-primary mt-12" onClick={() => setShowReceipt(true)}>
        Checkout
      </button>
    </div>
  );
}
