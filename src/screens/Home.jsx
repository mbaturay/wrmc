import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { REWARDS, PAYMENT } from '../data/mock';
import { redeemableAmount } from '../data/rewards';

export function Home({
  thisMonth,
  lifetime,
  rewardsAvailable,
  navigate,
  isNewUser,
}) {
  const displayThisMonth = isNewUser ? 3.82 : thisMonth;
  const displayLifetime = isNewUser ? 3.82 : lifetime;
  const displayRewardsAvailable = isNewUser ? 3.82 : rewardsAvailable;
  const displayStreak = isNewUser ? 1 : REWARDS.streakDays;

  const milestoneTarget = isNewUser ? 50 : REWARDS.nextMilestone;
  const milestoneName = isNewUser ? 'First $50 saved' : REWARDS.milestoneName;
  const milestoneGap = Math.max(0, milestoneTarget - displayLifetime);
  const milestoneProgress = Math.min((displayLifetime / milestoneTarget) * 100, 100);
  const streakProgress = (displayStreak / 30) * 100;
  const milestoneReached = displayLifetime >= milestoneTarget;

  const RETURNING_INSIGHTS = [
    { main: `You earned $${displayThisMonth.toFixed(2)} in rewards this month.`, sub: 'Just from your regular Walmart shopping — no extra steps.' },
    { main: `$${redeemableAmount(displayRewardsAvailable).toFixed(2)} is ready to use at your next Walmart checkout.`, sub: 'Tell the terminal how much to apply — in $5 increments.' },
    { main: `You're $${Math.max(0, milestoneTarget - displayLifetime).toFixed(0)} away from $${milestoneTarget} in lifetime savings.`, sub: 'One regular grocery run should get you there.' },
  ];
  const NEW_USER_INSIGHTS = [
    { main: 'Welcome — your first $3.82 is already waiting.', sub: 'Use your card at Walmart to keep earning.' },
    { main: 'Earn $3 back for every $100 at Walmart.', sub: 'Your rewards build automatically — no extra steps.' },
    { main: 'Your Reward Dollars never expire.', sub: 'Save them up or use them at your next checkout.' },
  ];
  const INSIGHTS = isNewUser ? NEW_USER_INSIGHTS : RETURNING_INSIGHTS;

  const [insightIdx, setInsightIdx] = useState(0);
  const safeIdx = insightIdx % INSIGHTS.length;
  const [shimmer, setShimmer] = useState(true);
  const [microFeedback, setMicroFeedback] = useState(null);
  const [milestoneGlow, setMilestoneGlow] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const prevThisMonth = useRef(thisMonth);
  const prevLifetime = useRef(lifetime);

  useEffect(() => { const t = setTimeout(() => setShimmer(false), 1200); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const delta = +(thisMonth - prevThisMonth.current).toFixed(2);
    if (delta > 0 && prevThisMonth.current > 0) {
      setMicroFeedback(`+$${delta.toFixed(2)}`);
      setShimmer(true);
      const t1 = setTimeout(() => setMicroFeedback(null), 1800);
      const t2 = setTimeout(() => setShimmer(false), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    prevThisMonth.current = thisMonth;
  }, [thisMonth]);

  useEffect(() => {
    if (lifetime >= milestoneTarget && prevLifetime.current < milestoneTarget) {
      setMilestoneGlow(true);
      setTimeout(() => setShowBadge(true), 600);
      setTimeout(() => setMilestoneGlow(false), 2000);
    }
    prevLifetime.current = lifetime;
  }, [lifetime, milestoneTarget]);

  useEffect(() => { if (milestoneReached) setShowBadge(true); }, [milestoneReached]);

  return (
    <Box sx={{ flex: 1, p: 2, pb: 10 }}>

      {/* HERO */}
      <Box sx={{ textAlign: 'center', py: 3, position: 'relative' }}>
        <Typography variant="body2" color="text.secondary">You've saved this month</Typography>
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            py: 1,
            transition: 'opacity 0.3s',
            opacity: shimmer ? 0.6 : 1,
          }}
        >
          <AnimatedCounter value={displayThisMonth} />
        </Typography>
        {microFeedback && (
          <Typography
            sx={{
              position: 'absolute', top: 12, right: 24,
              color: 'success.main', fontWeight: 700, fontSize: 16,
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            {microFeedback}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Earned automatically on your Walmart purchases
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700}>${redeemableAmount(displayRewardsAvailable).toFixed(2)}</Typography>
            <Typography variant="caption" color="text.secondary">Ready to Redeem</Typography>
          </Box>
          <Box sx={{ width: 1, bgcolor: 'divider', alignSelf: 'stretch' }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700}><AnimatedCounter value={displayLifetime} /></Typography>
            <Typography variant="caption" color="text.secondary">Saved lifetime</Typography>
          </Box>
        </Box>
      </Box>

      {/* MOMENTUM */}
      <Card sx={{ mb: 2, border: milestoneGlow ? '2px solid' : 'none', borderColor: 'primary.main', transition: 'border 0.3s' }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            {isNewUser ? 'Day 1 of your earning streak' : `${displayStreak}-Day Earning Streak`}
          </Typography>

          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">${displayLifetime.toFixed(0)}</Typography>
              <Typography variant="caption">${milestoneTarget}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={milestoneProgress} sx={{ height: 8, borderRadius: 4 }} />
            {!milestoneReached ? (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                ${milestoneGap.toFixed(0)} to reach <strong>{milestoneName}</strong>
              </Typography>
            ) : (
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5, display: 'inline-block', px: 1.5, py: 0.5,
                  bgcolor: 'success.light', color: 'success.main',
                  borderRadius: 2, fontWeight: 600,
                  opacity: showBadge ? 1 : 0, transition: 'opacity 0.4s',
                }}
              >
                {milestoneName}
              </Typography>
            )}
          </Box>

          {!milestoneReached && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
              {isNewUser
                ? 'Keep using your card at Walmart — your rewards build with every purchase.'
                : `One regular grocery run and you'll hit your $${milestoneTarget} milestone.`
              }
            </Typography>
          )}

          {!isNewUser && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption">{displayStreak} days</Typography>
                <Typography variant="caption">30-day goal</Typography>
              </Box>
              <LinearProgress variant="determinate" value={streakProgress} color="secondary" sx={{ height: 6, borderRadius: 3 }} />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* CTA */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        {displayRewardsAvailable > 0 ? (
          <>
            <Button variant="contained" size="large" fullWidth onClick={() => navigate('rewards')}>
              ${redeemableAmount(displayRewardsAvailable).toFixed(2)} ready to use at Walmart
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              No codes, no coupons — just use your card
            </Typography>
          </>
        ) : (
          <>
            <Button variant="contained" size="large" fullWidth onClick={() => navigate('main', 'payment')}>
              Make a Payment
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Due {PAYMENT.dueDate}
            </Typography>
          </>
        )}
      </Box>

      {/* INSIGHT */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AutoAwesomeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="overline" color="primary.main">Insight</Typography>
          </Box>
          <Typography variant="body2" fontWeight={600} gutterBottom>{INSIGHTS[safeIdx].main}</Typography>
          <Typography variant="body2" color="text.secondary">{INSIGHTS[safeIdx].sub}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1.5 }}>
            <IconButton size="small" onClick={() => setInsightIdx((safeIdx - 1 + INSIGHTS.length) % INSIGHTS.length)}>
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {INSIGHTS.map((_, i) => (
                <Box key={i} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: i === safeIdx ? 'primary.main' : 'grey.300' }} />
              ))}
            </Box>
            <IconButton size="small" onClick={() => setInsightIdx((safeIdx + 1) % INSIGHTS.length)}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
