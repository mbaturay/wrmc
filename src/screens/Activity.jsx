import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { TRANSACTIONS } from '../data/mock';
import { REWARDS_RATES } from '../data/rewards';

const CATEGORY_ICONS = {
  Groceries: '🛒', Home: '🏠', Gas: '⛽', Dining: '☕', Health: '💊', Auto: '🔧',
};

export function Activity({ onSelectTx, isNewUser, prefGV }) {
  const [filter, setFilter] = useState('all');
  const [seenTips, setSeenTips] = useState(new Set());

  function showGVDot(tx) {
    return prefGV && tx.gvTip && !seenTips.has(tx.id);
  }

  const txData = isNewUser ? [] : TRANSACTIONS;
  const categories = ['all', ...new Set(txData.map(t => t.category))];
  const filtered = filter === 'all' ? txData : txData.filter(t => t.category === filter);

  return (
    <Box sx={{ flex: 1, p: 2, pb: 10 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>Transactions</Typography>

      {txData.length === 0 ? (
        <Card sx={{ mt: 1.5 }}>
          <CardContent sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
            <Typography variant="h4" sx={{ mb: 1.5 }}>○</Typography>
            <Typography fontWeight={500} gutterBottom>No transactions yet</Typography>
            <Typography variant="body2">
              Your first Walmart purchase will appear here — along with the rewards you earned.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filter pills */}
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
            {categories.map(c => (
              <Chip
                key={c}
                label={c}
                variant={filter === c ? 'filled' : 'outlined'}
                color={filter === c ? 'primary' : 'default'}
                onClick={() => setFilter(c)}
                sx={{ textTransform: 'capitalize' }}
              />
            ))}
          </Box>

          {/* Transaction list */}
          <Card sx={{ mt: 1.5 }}>
            <List disablePadding>
              {filtered.map((tx, i) => (
                <ListItemButton
                  key={tx.id}
                  onClick={() => {
                    if (tx.gvTip) setSeenTips(prev => new Set([...prev, tx.id]));
                    onSelectTx(tx);
                  }}
                  divider={i < filtered.length - 1}
                  sx={{ alignItems: 'flex-start', py: 1.5 }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'grey.100', fontSize: 18 }}>
                      {CATEGORY_ICONS[tx.category] || '●'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={tx.merchant}
                    secondary={`${tx.date} · ${tx.category}`}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                    secondaryTypographyProps={{ fontSize: 12 }}
                  />
                  <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 1 }}>
                    <Typography fontWeight={600} fontSize={15}>-${tx.amount.toFixed(2)}</Typography>
                    {tx.rewardLabel && (
                      <Typography variant="caption" color="success.main" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        {tx.rewardLabel}
                        {showGVDot(tx) && (
                          <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main', display: 'inline-block' }} />
                        )}
                      </Typography>
                    )}
                  </Box>
                </ListItemButton>
              ))}
            </List>
          </Card>

          {/* Monthly summary */}
          {(() => {
            const totalSpent = txData.reduce((s, t) => s + t.amount, 0);
            const totalRewards = txData.reduce((s, t) => s + t.reward, 0);
            const effectiveRate = totalSpent > 0 ? ((totalRewards / totalSpent) * 100).toFixed(2) : '0.00';
            return (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>March Summary</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <span>Total spent</span><strong>${totalSpent.toFixed(2)}</strong>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <span>Total rewards earned</span><Typography component="strong" color="success.main" fontWeight={700}>${totalRewards.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <span>Effective savings rate</span><strong>{effectiveRate}%</strong>
                  </Box>
                </CardContent>
              </Card>
            );
          })()}
        </>
      )}
    </Box>
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
    <Box sx={{ flex: 1, p: 2, pb: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h4" fontWeight={700}>-${tx.amount.toFixed(2)}</Typography>
            <Typography color="text.secondary">{tx.merchant}</Typography>
            <Typography variant="body2" color="text.secondary">
              {tx.date} · {tx.items} item{tx.items > 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Reward earned */}
          <Alert severity="success" icon={false} sx={{ mb: 2, '& .MuiAlert-message': { width: '100%' } }}>
            <Typography variant="h6" fontWeight={700} color="success.main">+${tx.reward.toFixed(2)} earned</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{rateDesc}</Typography>
          </Alert>

          {/* Expandable calculation */}
          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ justifyContent: 'space-between', color: 'text.primary' }}
            >
              See full calculation
            </Button>
            <Collapse in={expanded}>
              <Box sx={{ px: 1, pt: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}><span>Purchase total</span><span>${tx.amount.toFixed(2)}</span></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}><span>Tax (HST)</span><span>-${tx.tax.toFixed(2)}</span></Box>
                <Divider sx={{ my: 0.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}><strong>Pre-tax amount</strong><strong>${tx.preTaxAmount.toFixed(2)}</strong></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}><span>Rate applied</span><span>{(tx.rate * 100).toFixed(0)}%</span></Box>
                <Divider sx={{ my: 0.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}><strong>Reward</strong><Typography component="strong" color="success.main" fontWeight={700}>${tx.reward.toFixed(2)}</Typography></Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1, display: 'block' }}>
                  Rewards are always calculated on the pre-tax amount.
                </Typography>
              </Box>
            </Collapse>
          </Box>

          {/* Category */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Category</Typography>
            <Chip label={tx.category} variant="outlined" />
          </Box>

          {/* Friend nudge */}
          <Box sx={{ display: 'flex', gap: 1.5, p: 1.5, bgcolor: 'grey.50', borderRadius: 2, mb: 1 }}>
            <HelpOutlineIcon sx={{ color: 'text.secondary', fontSize: 20, mt: 0.25 }} />
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
              {isWalmart
                ? <>This purchase earned the <strong>3% Walmart rate</strong>. Buying Great Value brands here doesn't change your rate, but it lowers what you spend — so your rewards go further.</>
                : <>This earned the <strong>1% standard rate</strong>. The same items at Walmart.ca would earn 3% — that's an extra ${(tx.preTaxAmount * 0.02).toFixed(2)} on this purchase.</>
              }
            </Typography>
          </Box>

          {/* GV tip */}
          {showGVTip && tx.gvTip && (
            <Alert severity="success" variant="outlined" sx={{ mt: 1.5, '& .MuiAlert-message': { fontSize: 13 } }}>
              <Typography fontWeight={600} fontSize={13} sx={{ mb: 0.5 }}>Great Value tip</Typography>
              On a shop like this, switching {tx.gvTip.itemCount} item{tx.gvTip.itemCount > 1 ? 's' : ''} to
              Great Value could save around <strong>${tx.gvTip.estimatedSaving.toFixed(2)}</strong> —
              with no change to your rewards rate.
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                For example: {tx.gvTip.example}.
              </Typography>
            </Alert>
          )}

          <Button variant="text" onClick={onHowRewards} sx={{ mt: 2 }}>
            How rewards work →
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export function HowRewardsWork({ onBack }) {
  return (
    <Box sx={{ flex: 1, p: 2, pb: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>How Rewards Work</Typography>
          <Box sx={{ fontSize: 14, lineHeight: 1.7, color: 'text.secondary' }}>
            <Typography variant="body2" fontWeight={600} color="text.primary">How you earn</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>Every time you use your card, Reward Dollars are added to your balance automatically.</Typography>
            <Box component="ul" sx={{ pl: 2.5, mb: 2 }}>
              <li>Walmart purchases (in-store, Walmart.ca, Marketplace): <strong>$3 back for every $100</strong></li>
              <li>Everywhere else Mastercard is accepted: <strong>$1 back for every $100</strong></li>
              <li>Calculated on the pre-tax amount, rounded down to the nearest cent</li>
              <li>Posted to your balance within 1–2 business days</li>
            </Box>

            <Typography variant="body2" fontWeight={600} color="text.primary">Your balance builds automatically</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>No categories to track. No caps to worry about. Reward Dollars sit in your balance until you're ready to use them — and they never expire.</Typography>

            <Typography variant="body2" fontWeight={600} color="text.primary">Using your Reward Dollars</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>Only at Walmart — in-store or on Walmart.ca.</Typography>
            <Box component="ul" sx={{ pl: 2.5, mb: 2 }}>
              <li><strong>In-store:</strong> Swipe your card at checkout. The terminal will ask if you want to apply Reward Dollars. Choose your amount in $5 increments.</li>
              <li><strong>On Walmart.ca:</strong> At checkout, select "Redeem Reward Dollars" and choose your amount in $5 increments.</li>
              <li><strong>Want to skip it?</strong> Just don't apply them — your balance stays and never expires.</li>
            </Box>

            <Typography variant="body2" fontWeight={600} color="text.primary">The $5 rule</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>You redeem in $5 increments. If your balance is $7.43, you can use $5.00 at checkout — the remaining $2.43 stays in your balance for next time.</Typography>

            <Typography variant="body2" fontWeight={600} color="text.primary">What Reward Dollars aren't</Typography>
            <Typography variant="body2">They're not cash and can't be used to pay your credit card bill. They work like dollars — but only at Walmart.</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
