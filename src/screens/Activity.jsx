import { useState } from 'react';
import { TRANSACTIONS } from '../data/mock';
import { getRateLabel } from '../data/rewards';

const CATEGORY_ICONS = {
  Groceries: '🛒', Home: '🏠', Gas: '⛽', Dining: '☕', Health: '💊', Auto: '🔧',
};

function getRewardSummary(tx) {
  return `You earned $${tx.reward.toFixed(2)} from the ${getRateLabel(tx.merchant)}, calculated on $${tx.preTaxAmount.toFixed(2)} before tax.`;
}

export function Activity({ onSelectTx }) {
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...new Set(TRANSACTIONS.map(t => t.category))];
  const filtered = filter === 'all' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.category === filter);

  return (
    <div className="screen">
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Transactions</div>

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
            </div>
            <div className="tx-amounts">
              <div className="tx-amount">-${tx.amount.toFixed(2)}</div>
              <div className="tx-reward">+${tx.reward.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly summary — computed from data */}
      {(() => {
        const totalSpent = TRANSACTIONS.reduce((s, t) => s + t.amount, 0);
        const totalRewards = TRANSACTIONS.reduce((s, t) => s + t.reward, 0);
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
    </div>
  );
}

export function TransactionDetail({ tx, onBack, onHowRewards }) {
  const [expanded, setExpanded] = useState(false);

  if (!tx) return null;

  const isWalmart = tx.merchant.includes('Walmart');
  const summary = getRewardSummary(tx);

  return (
    <div className="screen no-nav">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>-${tx.amount.toFixed(2)}</div>
          <div className="text-muted">{tx.merchant}</div>
          <div className="text-sm text-muted">{tx.date} &middot; {tx.items} item{tx.items > 1 ? 's' : ''}</div>
        </div>

        {/* Reward earned — one-sentence summary + expandable math */}
        <div style={{ background: 'var(--success-bg)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <div className="flex justify-between items-center">
            <span style={{ fontWeight: 600 }}>Reward Earned</span>
            <span className="text-success" style={{ fontSize: 18, fontWeight: 700 }}>+${tx.reward.toFixed(2)}</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.4 }}>
            {summary}
          </div>
        </div>

        {/* "Why did I earn this?" — summary visible, math expandable */}
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
                <div className="receipt-line"><span>Rate applied</span><span>{(tx.rate * 100).toFixed(2)}%</span></div>
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
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>How Rewards Work</h2>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          <p><strong>Earning</strong></p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            <li>3% on Walmart purchases (in-store, Walmart.ca, Marketplace)</li>
            <li>1% everywhere else Mastercard is accepted</li>
            <li>Calculated on the pre-tax amount, rounded down to the nearest cent</li>
            <li>Reward Dollars are posted within 1-2 business days</li>
          </ul>
          <p><strong>Accumulating</strong></p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            <li>Reward Dollars never expire</li>
            <li>They sit in your balance until you choose to use them</li>
          </ul>
          <p><strong>Using Your Reward Dollars</strong></p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            <li><strong>In-store:</strong> Swipe your card at checkout — the terminal will ask if you want to apply Reward Dollars. Choose your amount in $5 increments.</li>
            <li><strong>Walmart.ca:</strong> At checkout, select "Redeem Reward Dollars" and choose your amount in $5 increments.</li>
          </ul>
          <p><strong>The $5 Rule</strong></p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            <li>You must redeem in $5 increments</li>
            <li>If your balance is $7.43, you can redeem $5.00 — the remaining $2.43 stays in your balance</li>
          </ul>
          <p><strong>What Reward Dollars Can't Do</strong></p>
          <ul style={{ paddingLeft: 20 }}>
            <li>Cannot be used to pay your credit card bill</li>
            <li>Cannot be converted to cash</li>
            <li>Cannot be used at non-Walmart stores</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
