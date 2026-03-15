import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BoltIcon from '@mui/icons-material/Bolt';

export function ProtoControls({ show, setShow, onSimulateReward, onSimulateMilestone, onSimulateRedemption, onToggleRewards, onResetOnboarding, isNewUser, setIsNewUser }) {
  return (
    <>
      <Fab
        size="small"
        color="secondary"
        onClick={() => setShow(!show)}
        aria-label="Prototype controls"
        sx={{ position: 'fixed', bottom: 80, right: { xs: 16, sm: 'calc(50% - 200px)' }, zIndex: 200 }}
      >
        <BoltIcon sx={{ fontSize: 18 }} />
      </Fab>
      {show && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed', bottom: 120, right: { xs: 16, sm: 'calc(50% - 200px)' },
            zIndex: 200, p: 2, width: 260, borderRadius: 3,
          }}
        >
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Prototype Controls
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Button size="small" onClick={onSimulateReward} sx={{ justifyContent: 'flex-start', fontSize: 12 }}>
              + Simulate reward earned +$3.00
            </Button>
            <Button size="small" onClick={onSimulateRedemption} sx={{ justifyContent: 'flex-start', fontSize: 12 }}>
              - Simulate Walmart redemption -$5.00
            </Button>
            <Button size="small" onClick={onSimulateMilestone} sx={{ justifyContent: 'flex-start', fontSize: 12 }}>
              ★ Trigger milestone celebration
            </Button>
            <Button size="small" onClick={onToggleRewards} sx={{ justifyContent: 'flex-start', fontSize: 12 }}>
              ↔ Toggle rewards balance
            </Button>
            <Button size="small" onClick={onResetOnboarding} sx={{ justifyContent: 'flex-start', fontSize: 12 }}>
              ↺ Replay onboarding
            </Button>
            <Button size="small" onClick={() => setIsNewUser(v => !v)} sx={{ justifyContent: 'flex-start', fontSize: 12 }}>
              {isNewUser ? '◉ Switch to returning user' : '○ Switch to new user'}
            </Button>
            <Button size="small" onClick={() => setShow(false)} sx={{ justifyContent: 'flex-start', fontSize: 12 }}>
              Close
            </Button>
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, display: 'block' }}>
            <Box component="span" fontWeight={600}>Onboarding triggers</Box><br />
            Card not activated: enter <strong>0000</strong><br />
            <Box sx={{ pl: 1, fontSize: 10 }}>→ "I've activated" → confirm → 1st check fails → "Try again" → succeeds → OTP</Box>
            Card not found: enter any other number<br />
            Happy path: starts with <strong>4829</strong> (pre-filled)<br />
            OTP code: <strong>123456</strong><br />
            Wrong password: use <strong>wrong123</strong>
          </Typography>
        </Paper>
      )}
    </>
  );
}
