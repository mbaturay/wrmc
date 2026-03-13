import { useState } from 'react';
import { TRANSACTIONS } from '../data/mock';

const CATEGORY_ICONS = {
  Groceries: '🛒', Home: '🏠', Gas: '⛽', Dining: '☕', Health: '💊', Auto: '🔧',
};

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

      {/* Monthly summary */}
      <div className="card">
        <div className="card-title">March Summary</div>
        <div className="receipt-line"><span>Total spent</span><strong>$564.83</strong></div>
        <div className="receipt-line"><span>Total rewards earned</span><strong className="text-success">$6.71</strong></div>
        <div className="receipt-line"><span>Effective savings rate</span><strong>1.19%</strong></div>
      </div>
    </div>
  );
}

export function TransactionDetail({ tx, onBack, onHowRewards }) {
  const [expanded, setExpanded] = useState(false);

  if (!tx) return null;

  return (
    <div className="screen no-nav">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>-${tx.amount.toFixed(2)}</div>
          <div className="text-muted">{tx.merchant}</div>
          <div className="text-sm text-muted">{tx.date} &middot; {tx.items} item{tx.items > 1 ? 's' : ''}</div>
        </div>

        {/* Reward breakdown */}
        <div style={{ background: 'var(--success-bg)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <div className="flex justify-between items-center">
            <span style={{ fontWeight: 600 }}>Reward Earned</span>
            <span className="text-success" style={{ fontSize: 18, fontWeight: 700 }}>+${tx.reward.toFixed(2)}</span>
          </div>
          <div className="text-sm text-muted mt-8">
            Rate: {(tx.rate * 100).toFixed(2)}% &middot; {tx.merchant.includes('Walmart') ? 'Walmart purchase' : 'Non-Walmart purchase'}
          </div>
        </div>

        {/* Pre-tax explanation */}
        <div className="card-title">Calculation</div>
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
          Rewards are calculated on the pre-tax purchase amount.
        </div>

        {/* Category visualization */}
        <div className="mt-16">
          <div className="card-title">Category</div>
          <div className="cat-bar">
            <div className="cat-bar-fill" style={{ width: '60%', background: 'var(--accent)' }} />
            <span className="cat-bar-label">{tx.category}</span>
          </div>
        </div>

        {/* Expandable "Why did I earn this?" */}
        <div className="mt-16">
          <button
            className="expandable-header"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            <span>Why did I earn this?</span>
            <span>{expanded ? '▲' : '▼'}</span>
          </button>
          {expanded && (
            <div style={{ padding: '8px 0', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <p>
                Your Walmart Rewards Mastercard earns <strong>1.25% cashback</strong> on purchases
                at Walmart and Walmart.ca, and <strong>1% cashback</strong> everywhere else.
              </p>
              <p style={{ marginTop: 8 }}>
                Rewards are always calculated on the <strong>pre-tax amount</strong> of your purchase.
                This means sales tax (HST/GST/PST) is excluded before calculating your reward.
              </p>
              <p style={{ marginTop: 8 }}>
                For this ${tx.amount.toFixed(2)} purchase, ${tx.tax.toFixed(2)} was tax,
                leaving ${tx.preTaxAmount.toFixed(2)} eligible for the {(tx.rate * 100).toFixed(2)}% rate.
              </p>
              <button
                className="btn btn-sm btn-ghost mt-12"
                onClick={onHowRewards}
                style={{ width: 'auto' }}
              >
                How rewards work →
              </button>
            </div>
          )}
        </div>
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
          <p><strong>Earn rates:</strong></p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            <li>1.25% on Walmart & Walmart.ca purchases</li>
            <li>1% on all other purchases</li>
          </ul>
          <p><strong>How it's calculated:</strong></p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            <li>Rewards are earned on the pre-tax amount</li>
            <li>Tax (HST/GST/PST) is excluded before calculation</li>
            <li>Rewards are posted within 1-2 business days</li>
          </ul>
          <p><strong>Redemption:</strong></p>
          <ul style={{ paddingLeft: 20 }}>
            <li>Redeem as statement credit or in-store</li>
            <li>No minimum redemption amount</li>
            <li>Auto-apply option available</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
