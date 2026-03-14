import { useState } from 'react';
import { TRANSACTIONS } from '../data/mock';
import { REWARDS_RATES } from '../data/rewards';

const CATEGORY_ICONS = {
  Groceries: '🛒', Home: '🏠', Gas: '⛽', Dining: '☕', Health: '💊', Auto: '🔧',
};

export function Activity({ onSelectTx, isNewUser }) {
  const [filter, setFilter] = useState('all');

  const txData = isNewUser ? [] : TRANSACTIONS;
  const categories = ['all', ...new Set(txData.map(t => t.category))];
  const filtered = filter === 'all' ? txData : txData.filter(t => t.category === filter);

  return (
    <div className="screen">
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Transactions</div>

      {/* Empty state for new users */}
      {txData.length === 0 ? (
        <div className="card mt-12" style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'var(--text-muted)',
          fontSize: 14,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>○</div>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>No transactions yet</div>
          <div style={{ fontSize: 13 }}>
            Your first Walmart purchase will appear here — along with the rewards you earned.
          </div>
        </div>
      ) : (
        <>
          {/* Filter pills */}
          <div className="flex gap-8" style={{ overflowX: 'auto', paddingBottom: 8 }}>
            {categories.map(c => (
              <button
                key={c}
                className={`btn btn-sm ${filter === c ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilter(c)}
                style={{ flexShrink: 0, textTransform: 'capitalize' }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Transaction list */}
          <div className="card mt-12">
            {filtered.map(tx => (
              <div
                key={tx.id}
                className="tx-item"
                onClick={() => onSelectTx(tx)}
                tabIndex={0}
                role="button"
                aria-label={`${tx.merchant}, ${tx.amount} dollars, earned ${tx.reward} dollars reward`}
                onKeyDown={e => e.key === 'Enter' && onSelectTx(tx)}
              >
                <div className="tx-icon">{CATEGORY_ICONS[tx.category] || '●'}</div>
                <div className="tx-info">
                  <div className="tx-merchant">{tx.merchant}</div>
                  <div className="tx-meta">{tx.date} &middot; {tx.category}</div>
                  {tx.rewardLabel && (
                    <span style={{ fontSize: 12, color: 'var(--success)', display: 'block', marginTop: 2 }}>
                      {tx.rewardLabel}
                    </span>
                  )}
                </div>
                <div className="tx-amounts">
                  <div className="tx-amount">-${tx.amount.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly summary — computed from data */}
          {(() => {
            const totalSpent = txData.reduce((s, t) => s + t.amount, 0);
            const totalRewards = txData.reduce((s, t) => s + t.reward, 0);
            const effectiveRate = totalSpent > 0 ? ((totalRewards / totalSpent) * 100).toFixed(2) : '0.00';
            return (
              <div className="card">
                <div className="card-title">March Summary</div>
                <div className="receipt-line"><span>Total spent</span><strong>${totalSpent.toFixed(2)}</strong></div>
                <div className="receipt-line"><span>Total rewards earned</span><strong className="text-success">${totalRewards.toFixed(2)}</strong></div>
                <div className="receipt-line"><span>Effective savings rate</span><strong>{effectiveRate}%</strong></div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}

export function TransactionDetail({ tx, onBack, onHowRewards, showGVTip }) {
  const [expanded, setExpanded] = useState(false);

  if (!tx) return null;

  const isWalmart = tx.merchant.includes('Walmart');
  const rateDesc = isWalmart
    ? `Walmart purchase · ${(REWARDS_RATES.walmart * 100)}% earn rate · calculated pre-tax`
    : `Standard purchase · ${(REWARDS_RATES.other * 100)}% earn rate · calculated pre-tax`;

  return (
    <div className="screen no-nav">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>-${tx.amount.toFixed(2)}</div>
          <div className="text-muted">{tx.merchant}</div>
          <div className="text-sm text-muted">{tx.date} &middot; {tx.items} item{tx.items > 1 ? 's' : ''}</div>
        </div>

        {/* Reward earned — dollar-first, outcome before explanation */}
        <div style={{ background: 'var(--success-bg)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--success)' }}>+${tx.reward.toFixed(2)} earned</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4 }}>
            {rateDesc}
          </div>
        </div>

        {/* Full calculation — expandable */}
        <div style={{ marginBottom: 16 }}>
          <button
            className="expandable-header"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            <span>See full calculation</span>
            <span>{expanded ? '▲' : '▼'}</span>
          </button>
          {expanded && (
            <div style={{ paddingTop: 4 }}>
              <div className="receipt">
                <div className="receipt-line"><span>Purchase total</span><span>${tx.amount.toFixed(2)}</span></div>
                <div className="receipt-line"><span>Tax (HST)</span><span>-${tx.tax.toFixed(2)}</span></div>
                <div className="receipt-divider" />
                <div className="receipt-line"><span><strong>Pre-tax amount</strong></span><span><strong>${tx.preTaxAmount.toFixed(2)}</strong></span></div>
                <div className="receipt-line"><span>Rate applied</span><span>{(tx.rate * 100).toFixed(0)}%</span></div>
                <div className="receipt-divider" />
                <div className="receipt-line"><span><strong>Reward</strong></span><span className="text-success"><strong>${tx.reward.toFixed(2)}</strong></span></div>
              </div>
              <div className="text-sm text-muted mt-8" style={{ fontStyle: 'italic' }}>
                Rewards are always calculated on the pre-tax amount.
              </div>
            </div>
          )}
        </div>

        {/* Category visualization */}
        <div>
          <div className="card-title">Category</div>
          <div className="cat-bar">
            <div className="cat-bar-fill" style={{ width: '60%', background: 'var(--accent)' }} />
            <span className="cat-bar-label">{tx.category}</span>
          </div>
        </div>

        {/* Competent-friend nudge — contextual to transaction */}
        <div className="friend-nudge mt-16">
          <div className="friend-nudge-icon">?</div>
          <div>
            {isWalmart
              ? <>This purchase earned the <strong>3% Walmart rate</strong>. Buying Great Value brands here doesn't change your rate, but it lowers what you spend — so your rewards go further.</>
              : <>This earned the <strong>1% standard rate</strong>. The same items at Walmart.ca would earn 3% — that's an extra ${(tx.preTaxAmount * 0.02).toFixed(2)} on this purchase.</>
            }
          </div>
        </div>

        {/* Great Value tip — shown only when preference is on and tip data exists */}
        {showGVTip && tx.gvTip && (
          <div style={{
            marginTop: 12,
            padding: '12px 14px',
            background: '#f0f7ec',
            border: '1px solid #c0dd97',
            borderRadius: 'var(--radius)',
            fontSize: 13,
            lineHeight: 1.5,
          }}>
            <div style={{
              fontWeight: 600,
              color: '#3B6D11',
              marginBottom: 4,
              fontSize: 13,
            }}>
              Great Value tip
            </div>
            <div style={{ color: '#444', marginBottom: 6 }}>
              On a shop like this, switching {tx.gvTip.itemCount} item{tx.gvTip.itemCount > 1 ? 's' : ''} to
              Great Value could save around <strong>${tx.gvTip.estimatedSaving.toFixed(2)}</strong> —
              with no change to your rewards rate.
            </div>
            <div style={{ fontSize: 12, color: '#5F5E5A' }}>
              For example: {tx.gvTip.example}.
            </div>
          </div>
        )}

        <button
          className="btn btn-sm btn-ghost mt-16"
          onClick={onHowRewards}
          style={{ width: 'auto' }}
        >
          How rewards work →
        </button>
      </div>
    </div>
  );
}

export function HowRewardsWork({ onBack }) {
  return (
    <div className="screen no-nav">
      <div className="card">
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>How Rewards Work</h2>

        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>

          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>How you earn</p>
          <p style={{ marginBottom: 8 }}>Every time you use your card, Reward Dollars are added to your balance automatically.</p>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li>Walmart purchases (in-store, Walmart.ca, Marketplace): <strong>$3 back for every $100</strong></li>
            <li>Everywhere else Mastercard is accepted: <strong>$1 back for every $100</strong></li>
            <li>Calculated on the pre-tax amount, rounded down to the nearest cent</li>
            <li>Posted to your balance within 1–2 business days</li>
          </ul>

          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Your balance builds automatically</p>
          <p style={{ marginBottom: 16 }}>No categories to track. No caps to worry about. Reward Dollars sit in your balance until you're ready to use them — and they never expire.</p>

          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Using your Reward Dollars</p>
          <p style={{ marginBottom: 8 }}>Only at Walmart — in-store or on Walmart.ca.</p>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li><strong>In-store:</strong> Swipe your card at checkout. The terminal will ask if you want to apply Reward Dollars. Choose your amount in $5 increments.</li>
            <li><strong>On Walmart.ca:</strong> At checkout, select "Redeem Reward Dollars" and choose your amount in $5 increments.</li>
            <li><strong>Want to skip it?</strong> Just don't apply them — your balance stays and never expires.</li>
          </ul>

          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>The $5 rule</p>
          <p style={{ marginBottom: 16 }}>You redeem in $5 increments. If your balance is $7.43, you can use $5.00 at checkout — the remaining $2.43 stays in your balance for next time.</p>

          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>What Reward Dollars aren't</p>
          <p>They're not cash and can't be used to pay your credit card bill. They work like dollars — but only at Walmart.</p>

        </div>
      </div>
    </div>
  );
}
