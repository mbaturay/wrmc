import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { REDEMPTION_INCREMENT, redeemableAmount } from '../data/rewards';
import { REWARDS } from '../data/mock';

export function Rewards({ rewardsAvailable, redemptions }) {
  const redeemable = redeemableAmount(rewardsAvailable);
  const remainder = +(rewardsAvailable - redeemable).toFixed(2);
  const untilNext5 = +(REDEMPTION_INCREMENT - remainder).toFixed(2);

  return (
    <Box sx={{ flex: 1, p: 2, pb: 10 }}>
      {/* Balance card */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="overline" color="text.secondary">Walmart Reward Dollars</Typography>
          <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1 }}>${rewardsAvailable.toFixed(2)}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Ready to use at Walmart</Typography>
          {REWARDS.pendingRewards > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'text.secondary' }}>
                <span>Pending</span>
                <span>+${REWARDS.pendingRewards.toFixed(2)}</span>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Earned on recent purchases — posts within 1–2 business days
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Balance breakdown */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>Your balance</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
            <span>Available now</span><strong>${rewardsAvailable.toFixed(2)}</strong>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
            <span>Ready to use at checkout</span><Typography component="strong" color="success.main" fontWeight={700}>${redeemable.toFixed(2)}</Typography>
          </Box>
          {remainder > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, color: 'text.secondary' }}>
              <span>Building toward your next $5</span><span>${remainder.toFixed(2)}</span>
            </Box>
          )}
          {redeemable < REDEMPTION_INCREMENT && (
            <Alert severity="warning" sx={{ mt: 1.5, fontSize: 13 }}>
              Keep going — ${untilNext5.toFixed(2)} more and you'll have $5 to use at checkout.
            </Alert>
          )}
          {redeemable >= REDEMPTION_INCREMENT && (
            <Alert severity="success" sx={{ mt: 1.5, fontSize: 13 }}>
              You have ${redeemable.toFixed(2)} ready to use at your next Walmart checkout.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* How to use */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>How to Use Your Reward Dollars</Typography>
          <Box sx={{ fontSize: 14, lineHeight: 1.7, color: 'text.secondary' }}>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="body2" fontWeight={600} color="text.primary">At Walmart checkout</Typography>
              Swipe your physical card at the terminal. It will ask if you want to apply Reward Dollars. Choose your amount in $5 increments.
            </Box>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="body2" fontWeight={600} color="text.primary">On Walmart.ca</Typography>
              At checkout, select "Redeem Reward Dollars" and choose your amount in $5 increments.
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={600} color="text.primary">Want to save up?</Typography>
              Skip it at checkout anytime — your balance never expires and there's no pressure to use it.
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* History */}
      {redemptions.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Recent Redemptions</Typography>
            <List disablePadding>
              {redemptions.map((r, i) => (
                <ListItem key={r.id} disablePadding divider={i < redemptions.length - 1} sx={{ py: 1 }}>
                  <ListItemText
                    primary={<Typography fontWeight={600}>-${r.amount.toFixed(2)}</Typography>}
                    secondary={r.type}
                  />
                  <Typography variant="body2" color="text.secondary">{r.date}</Typography>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {redemptions.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', color: 'text.secondary', py: 3 }}>
            No redemptions yet — your balance is building.
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
