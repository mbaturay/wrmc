import { useState, useEffect, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { motion, useReducedMotion } from 'framer-motion';
import { REWARDS } from '../data/mock';
import { redeemableAmount } from '../data/rewards';

// ─── Reusable AnimatedNumber ───
// Counts from 0 to `value` over `duration`ms with easeOut cubic
// Displays as currency: $XX.XX
function AnimatedNumber({ value, duration = 900, delay = 0, prefix = '$' }) {
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(prefersReduced ? value : 0);
  const rafRef = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (prefersReduced || hasRun.current) return;
    hasRun.current = true;

    const delayMs = delay * 1000;
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(value * eased);
        if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      }
      rafRef.current = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, delay, prefersReduced]);

  // After mount animation, track prop changes (for proto controls)
  const prevValue = useRef(value);
  useEffect(() => {
    if (!hasRun.current) return;
    if (value === prevValue.current) return;
    prevValue.current = value;
    const start = display;
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / 600, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (value - start) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [value]);

  return <span>{prefix}{display.toFixed(2)}</span>;
}

// ─── Shared styles ───
const sectionLabel = {
  fontSize: 13, fontWeight: 600, color: '#6B7280',
  textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1, px: 0.5,
};
const card = {
  bgcolor: '#fff', borderRadius: '16px', border: '0.5px solid #E5E7EB',
  overflow: 'hidden',
};

// ─── Stagger wrapper ───
function FadeUp({ delay, skip, children, style }) {
  if (skip) return <div style={style}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── Main component ───

export function Home({
  thisMonth,
  lifetime,
  rewardsAvailable,
  navigate,
  isNewUser,
}) {
  const prefersReduced = useReducedMotion();
  const skip = !!prefersReduced;

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

  // ─── New user empty state (no animation) ───
  if (isNewUser) {
    return (
      <Box sx={{ flex: 1, bgcolor: '#F5F7FA', pb: '80px' }}>
        <HeroSection
          rewardsAvailable={displayRewardsAvailable}
          thisMonth={displayThisMonth}
          lifetime={displayLifetime}
          shimmer={shimmer}
          microFeedback={microFeedback}
          skip
        />
        <Box sx={{ px: 2, mt: 3, textAlign: 'center' }}>
          <Box sx={{ ...card, px: 4, py: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 56, color: '#9CA3AF', mb: 2 }} />
            <Typography variant="h6" fontWeight={700} gutterBottom>Start earning rewards</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 260 }}>
              Use your Walmart card to earn cash back automatically
            </Typography>
            <Button
              variant="contained" size="large" fullWidth
              onClick={() => navigate('activity')}
              sx={{ bgcolor: '#FFC220', color: '#1a1a1a', fontWeight: 700, borderRadius: '14px', '&:hover': { bgcolor: '#e6ad00' } }}
            >
              See how it works
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // ─── Returning user ───
  return (
    <Box sx={{ flex: 1, bgcolor: '#F5F7FA', pb: '80px' }}>

      {/* 1. HERO */}
      <HeroSection
        rewardsAvailable={displayRewardsAvailable}
        thisMonth={displayThisMonth}
        lifetime={displayLifetime}
        shimmer={shimmer}
        microFeedback={microFeedback}
        skip={skip}
      />

      {/* 2. CTA BUTTON */}
      <FadeUp delay={1.05} skip={skip} style={{ padding: '0 16px', marginTop: '-12px' }}>
        <Box
          onClick={() => navigate('rewards')}
          sx={{
            ...card,
            bgcolor: '#FFC220', borderColor: '#e6ad00', borderRadius: '14px',
            px: 2.5, py: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'transform 0.12s, box-shadow 0.12s',
            '&:hover': { transform: 'scale(0.985)', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
            '&:active': { transform: 'scale(0.975)' },
          }}
        >
          <Box>
            <Typography fontWeight={800} fontSize={16} sx={{ color: '#1a1a1a' }}>
              ${redeemableAmount(displayRewardsAvailable).toFixed(2)} ready to use
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.55)', fontSize: 13 }}>
              Just use your card at checkout
            </Typography>
          </Box>
          <ArrowForwardIcon sx={{ color: '#1a1a1a', fontSize: 22 }} />
        </Box>
      </FadeUp>

      {/* 3. YOUR MILESTONE */}
      <FadeUp delay={1.3} skip={skip} style={{ padding: '0 16px', marginTop: '24px' }}>
        <Typography sx={sectionLabel}>Your milestone</Typography>
        <Box sx={{
          ...card, p: 2.5,
          border: milestoneGlow ? '2px solid #0071CE' : card.border,
          transition: 'border 0.3s',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography fontWeight={700} fontSize={15}>{milestoneName}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: 13 }}>
                {milestoneReached ? 'Milestone reached!' : 'One grocery run away from your next badge'}
              </Typography>
            </Box>
            {!milestoneReached ? (
              <Box sx={{
                bgcolor: '#EBF5FF', color: '#0071CE',
                px: 1.5, py: 0.5, borderRadius: '20px',
                fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0, ml: 1.5,
              }}>
                ${milestoneGap.toFixed(0)} away
              </Box>
            ) : (
              <Box sx={{
                bgcolor: '#e8f5e9', color: '#2d7a3a',
                px: 1.5, py: 0.5, borderRadius: '20px',
                fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0, ml: 1.5,
                opacity: showBadge ? 1 : 0, transition: 'opacity 0.4s',
              }}>
                Achieved
              </Box>
            )}
          </Box>

          {/* Animated progress bar */}
          <Box sx={{ height: 8, borderRadius: 4, bgcolor: '#E5E7EB', overflow: 'hidden' }}>
            <motion.div
              initial={skip ? false : { width: '0%' }}
              animate={{ width: `${milestoneProgress}%` }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: skip ? 0 : 1.4 }}
              style={{ height: '100%', backgroundColor: '#0071CE', borderRadius: 4 }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
            <Typography variant="caption" color="text.secondary">${displayLifetime.toFixed(0)} saved</Typography>
            <Typography variant="caption" color="text.secondary">${milestoneTarget}</Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#0071CE', fontWeight: 600, mt: 0.5, display: 'block' }}>
            {Math.round(milestoneProgress)}% there
          </Typography>
        </Box>
      </FadeUp>

      {/* 4. EARNING STREAK */}
      <FadeUp delay={1.6} skip={skip} style={{ padding: '0 16px', marginTop: '24px' }}>
        <Typography sx={sectionLabel}>Earning streak</Typography>
        <Box sx={{ ...card, px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '12px', bgcolor: '#FFF8E6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
          }}>
            🔥
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={700} fontSize={15}>{displayStreak}-day streak</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {30 - displayStreak} days to hit your 30-day goal
            </Typography>
            {/* Animated streak bar */}
            <Box sx={{ height: 5, borderRadius: 3, bgcolor: '#E5E7EB', overflow: 'hidden', mt: 1 }}>
              <motion.div
                initial={skip ? false : { width: '0%' }}
                animate={{ width: `${streakProgress}%` }}
                transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: skip ? 0 : 1.7 }}
                style={{ height: '100%', backgroundColor: '#FFC220', borderRadius: 3 }}
              />
            </Box>
          </Box>
        </Box>
      </FadeUp>

      {/* 5. INSIGHT */}
      <FadeUp delay={1.9} skip={skip} style={{ padding: '0 16px', marginTop: '24px' }}>
        <Typography sx={sectionLabel}>Insight</Typography>
        <Box
          onClick={() => setInsightIdx((safeIdx + 1) % INSIGHTS.length)}
          sx={{ ...card, px: 2.5, py: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5, cursor: 'pointer' }}
        >
          <Box sx={{
            width: 8, height: 8, borderRadius: '50%', bgcolor: '#0071CE',
            flexShrink: 0, mt: 0.75,
          }} />
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {INSIGHTS[safeIdx].main}
          </Typography>
        </Box>
      </FadeUp>

    </Box>
  );
}

// ─── Hero sub-component ───

function HeroSection({ rewardsAvailable, thisMonth, lifetime, shimmer, microFeedback, skip }) {
  return (
    <Box sx={{
      bgcolor: '#0071CE',
      borderRadius: '0 0 24px 24px',
      px: 2.5, pt: 4, pb: 5,
      position: 'relative',
    }}>
      {/* Micro-feedback */}
      {microFeedback && (
        <Typography sx={{
          position: 'absolute', top: 16, right: 20,
          color: '#FFC220', fontWeight: 700, fontSize: 16,
          animation: 'fadeInUp 0.3s ease',
        }}>
          {microFeedback}
        </Typography>
      )}

      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 500, mb: 0.5 }}>
          Ready to redeem
        </Typography>

        {/* Hero amount — AnimatedNumber roll-up, 900ms */}
        <Typography sx={{
          color: '#fff', fontSize: 48, fontWeight: 800, lineHeight: 1, letterSpacing: '-1px',
          transition: 'opacity 0.3s', opacity: shimmer ? 0.7 : 1,
        }}>
          <AnimatedNumber value={rewardsAvailable} duration={900} delay={0} />
        </Typography>

        {/* Subtitle + stats row fade-up at 0.6s */}
        <FadeUp delay={0.6} skip={skip}>
          <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, mt: 1 }}>
            Use automatically at Walmart — no codes needed
          </Typography>
        </FadeUp>
      </Box>

      {/* Stats row — fade-up at 0.6s, numbers roll at 0.8s / 0.85s */}
      <FadeUp delay={0.6} skip={skip}>
        <Box sx={{
          mt: 3, mx: 0.5,
          bgcolor: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          borderRadius: '14px',
          display: 'flex',
        }}>
          <Box sx={{ flex: 1, textAlign: 'center', py: 2 }}>
            <Typography sx={{ color: '#FFC220', fontSize: 20, fontWeight: 800, lineHeight: 1 }}>
              <AnimatedNumber value={thisMonth} duration={700} delay={skip ? 0 : 0.8} />
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, mt: 0.5 }}>
              This month
            </Typography>
          </Box>
          <Box sx={{ width: '1px', bgcolor: 'rgba(255,255,255,0.15)', my: 1.5 }} />
          <Box sx={{ flex: 1, textAlign: 'center', py: 2 }}>
            <Typography sx={{ color: '#FFC220', fontSize: 20, fontWeight: 800, lineHeight: 1 }}>
              <AnimatedNumber value={lifetime} duration={800} delay={skip ? 0 : 0.85} />
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, mt: 0.5 }}>
              Lifetime
            </Typography>
          </Box>
        </Box>
      </FadeUp>
    </Box>
  );
}
