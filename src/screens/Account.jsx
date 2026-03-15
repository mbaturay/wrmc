import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PaymentIcon from '@mui/icons-material/Payment';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import GavelIcon from '@mui/icons-material/Gavel';
import LanguageIcon from '@mui/icons-material/Language';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import { USER, PAYMENT } from '../data/mock';

export function Account({ navigate, frozen }) {
  const menuItems = [
    { icon: <PersonOutlineIcon />, label: 'Profile', sub: null, action: () => navigate('main', 'profile') },
    { icon: <PaymentIcon />, label: 'Make a Payment', sub: `Due ${PAYMENT.dueDate}`, action: () => navigate('main', 'payment') },
    { icon: <LockOutlinedIcon />, label: 'Card Controls', sub: frozen ? 'Card frozen' : 'Card active', action: () => navigate('main', 'freeze') },
    { icon: <DescriptionOutlinedIcon />, label: 'Statements', sub: null, action: () => navigate('main', 'statements') },
  ];

  return (
    <Box sx={{ flex: 1, p: 2, pb: 4 }}>
      {/* Card visual */}
      <Card sx={{ bgcolor: '#2a2a2a', color: 'white', mb: 2 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>Walmart Rewards Mastercard</Typography>
            <img src="/logo.svg" alt="" style={{ width: 24, height: 24, filter: 'invert(1)', opacity: 0.7 }} />
          </Box>
          <Typography sx={{ fontSize: 18, letterSpacing: 2, mb: 2 }}>•••• •••• •••• {USER.cardLast4}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7, fontSize: 12 }}>
            <span>{USER.name}</span>
            <span>Member since {USER.memberSince}</span>
          </Box>
          {frozen && (
            <Chip label="Card Frozen" size="small" sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} />
          )}
        </CardContent>
      </Card>

      {/* Balance */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="overline" color="text.secondary">Current Balance</Typography>
              <Typography variant="h5" fontWeight={700}>${PAYMENT.currentBalance.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="overline" color="text.secondary">Available Credit</Typography>
              <Typography variant="h6" fontWeight={600}>${PAYMENT.availableCredit.toFixed(2)}</Typography>
            </Box>
          </Box>
          <LinearProgress variant="determinate" value={(PAYMENT.currentBalance / PAYMENT.creditLimit) * 100} sx={{ mt: 1.5, height: 8, borderRadius: 4 }} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            ${PAYMENT.creditLimit.toFixed(2)} credit limit
          </Typography>
        </CardContent>
      </Card>

      {/* Menu */}
      <Card>
        <List disablePadding>
          {menuItems.map((item, i) => (
            <ListItemButton key={i} onClick={item.action} divider={i < menuItems.length - 1}>
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.sub}
                secondaryTypographyProps={{
                  color: frozen && item.label === 'Card Controls' ? 'warning.main' : 'text.secondary',
                  fontSize: 12,
                }}
              />
              <ChevronRightIcon color="action" />
            </ListItemButton>
          ))}
        </List>
      </Card>
    </Box>
  );
}

export function FreezeCard({ frozen, setFrozen, onBack }) {
  return (
    <Box sx={{ flex: 1, p: 2, pb: 4 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          {frozen ? <PlayArrowIcon sx={{ fontSize: 48, mb: 2 }} /> : <AcUnitIcon sx={{ fontSize: 48, mb: 2 }} />}
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Card is {frozen ? 'Frozen' : 'Active'}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {frozen
              ? 'Your card is temporarily frozen. No new purchases can be made.'
              : 'Your card is active and ready to use.'
            }
          </Typography>
          <Button variant="contained" color={frozen ? 'success' : 'primary'} onClick={() => setFrozen(!frozen)} fullWidth>
            {frozen ? 'Unfreeze Card' : 'Freeze Card'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export function MakePayment({ onBack, paymentMade, setPaymentMade }) {
  const [payAmount, setPayAmount] = useState(PAYMENT.statementBalance.toString());
  const [selected, setSelected] = useState('statement');
  const [submitted, setSubmitted] = useState(false);

  const daysUntilDue = Math.max(0, Math.round((new Date(PAYMENT.dueDate) - new Date()) / 86400000));
  const utilizationPct = ((PAYMENT.currentBalance / PAYMENT.creditLimit) * 100).toFixed(0);
  const amount = +payAmount || 0;
  const remainingAfter = Math.max(0, PAYMENT.currentBalance - amount);

  function selectPreset(key, value) { setSelected(key); setPayAmount(value.toString()); }
  function handleCustomChange(e) { setSelected('custom'); setPayAmount(e.target.value); }
  function handlePay() { if (amount > 0) { setSubmitted(true); setPaymentMade(true); } }

  if (submitted) {
    return (
      <Box sx={{ flex: 1, p: 2, pb: 4, textAlign: 'center', pt: 6 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 56, color: 'success.main', mb: 1.5 }} />
        <Typography variant="h5" fontWeight={700}>Payment Submitted</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>${amount.toFixed(2)} will be applied to your balance</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Usually processes within 1-2 business days</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Your Reward Dollars balance is unaffected.
        </Typography>
        <Card sx={{ mt: 3, textAlign: 'left' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}><span>Amount paid</span><strong>${amount.toFixed(2)}</strong></Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}><span>Remaining balance</span><span>${remainingAfter.toFixed(2)}</span></Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}><span>Payment method</span><span>Bank account ••89</span></Box>
          </CardContent>
        </Card>
        <Button variant="outlined" onClick={onBack} sx={{ mt: 3 }} fullWidth>Done</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, p: 2, pb: 4 }}>
      <Alert severity="info" sx={{ mb: 1.5, fontSize: 12 }}>
        This pays your credit card balance — separate from your Reward Dollars.
      </Alert>

      {daysUntilDue <= 14 && (
        <Alert severity={daysUntilDue <= 5 ? 'error' : 'warning'} sx={{ mb: 2, fontSize: 13 }}>
          Payment due in <strong>{daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}</strong> ({PAYMENT.dueDate}).
          {selected === 'min' && ' Paying only the minimum will result in interest charges.'}
        </Alert>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
            <Box>
              <Typography variant="overline" color="text.secondary">Current Balance</Typography>
              <Typography variant="h5" fontWeight={700}>${PAYMENT.currentBalance.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">{utilizationPct}% of limit</Typography>
              <Typography variant="body2" color="text.secondary">${PAYMENT.creditLimit.toFixed(0)} limit</Typography>
            </Box>
          </Box>
          <LinearProgress variant="determinate" value={+utilizationPct} sx={{ height: 6, borderRadius: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, fontSize: 13, color: 'text.secondary' }}>
            <span>Statement: ${PAYMENT.statementBalance.toFixed(2)}</span>
            <span>Min due: ${PAYMENT.minimumDue.toFixed(2)}</span>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>Choose Amount</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            {[
              { key: 'min', label: 'Minimum due', value: PAYMENT.minimumDue, note: 'Interest will apply' },
              { key: 'statement', label: 'Statement balance', value: PAYMENT.statementBalance, note: 'Recommended — avoids interest' },
              { key: 'full', label: 'Full balance', value: PAYMENT.currentBalance, note: 'Includes recent charges' },
            ].map(opt => (
              <Button
                key={opt.key}
                variant={selected === opt.key ? 'contained' : 'outlined'}
                onClick={() => selectPreset(opt.key, opt.value)}
                sx={{ justifyContent: 'space-between', py: 1.5, px: 2, textAlign: 'left' }}
                fullWidth
              >
                <Box>
                  <Typography variant="body2" fontWeight={600}>{opt.label}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>{opt.note}</Typography>
                </Box>
                <Typography fontWeight={700}>${opt.value.toFixed(2)}</Typography>
              </Button>
            ))}
          </Box>

          <TextField
            label="Or enter a custom amount"
            type="number"
            value={selected === 'custom' ? payAmount : ''}
            onChange={handleCustomChange}
            onFocus={() => { setSelected('custom'); setPayAmount(''); }}
            InputProps={{ startAdornment: <Typography color="text.secondary" sx={{ mr: 0.5 }}>$</Typography> }}
            sx={{ mb: 2 }}
          />

          {amount > 0 && (
            <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <Typography variant="body2" color="text.secondary">Balance after payment</Typography>
              <Typography variant="body2" fontWeight={700}>${remainingAfter.toFixed(2)}</Typography>
            </Box>
          )}

          <Button variant="contained" fullWidth onClick={handlePay} disabled={amount <= 0}>
            Pay ${amount.toFixed(2)}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export function Statements() {
  const statements = [
    { period: 'Feb 2026', amount: 412.33, paid: true },
    { period: 'Jan 2026', amount: 389.56, paid: true },
    { period: 'Dec 2025', amount: 567.12, paid: true },
  ];
  return (
    <Box sx={{ flex: 1, p: 2, pb: 4 }}>
      <Card>
        <List disablePadding>
          {statements.map((s, i) => (
            <ListItemButton key={i} divider={i < statements.length - 1}>
              <ListItemIcon sx={{ minWidth: 40 }}><DescriptionOutlinedIcon /></ListItemIcon>
              <ListItemText primary={s.period} secondary={`$${s.amount.toFixed(2)} · ${s.paid ? 'Paid' : 'Due'}`} />
              <ChevronRightIcon color="action" />
            </ListItemButton>
          ))}
        </List>
      </Card>
    </Box>
  );
}

export function Settings({ navigate, prefGV, setPrefGV }) {
  const [notifPush, setNotifPush] = useState(true);
  const [notifRewards, setNotifRewards] = useState(true);
  const [notifPayment, setNotifPayment] = useState(true);
  const [prefBiometric, setPrefBiometric] = useState(false);

  const SectionLabel = ({ children }) => (
    <Typography variant="overline" color="text.secondary" sx={{ px: 0.5, pt: 2, pb: 0.5, display: 'block' }}>
      {children}
    </Typography>
  );

  const ToggleItem = ({ label, sub, checked, onChange, last }) => (
    <ListItem divider={!last} sx={{ py: 1 }}>
      <ListItemText primary={label} secondary={sub} secondaryTypographyProps={{ fontSize: 12 }} />
      <Switch checked={checked} onChange={onChange} />
    </ListItem>
  );

  return (
    <Box sx={{ flex: 1, p: 2, pb: 10 }}>
      <SectionLabel>Notifications</SectionLabel>
      <Card sx={{ mb: 1 }}>
        <List disablePadding>
          <ToggleItem label="Push notifications" checked={notifPush} onChange={() => setNotifPush(v => !v)} />
          <ToggleItem label="Reward alerts" sub="When you earn Reward Dollars" checked={notifRewards} onChange={() => setNotifRewards(v => !v)} />
          <ToggleItem label="Payment reminders" sub="Before your due date" checked={notifPayment} onChange={() => setNotifPayment(v => !v)} last />
        </List>
      </Card>

      <SectionLabel>Preferences</SectionLabel>
      <Card sx={{ mb: 1 }}>
        <List disablePadding>
          <ToggleItem label="Great Value suggestions" sub="Savings tips on your Walmart transactions" checked={prefGV} onChange={() => setPrefGV(v => !v)} />
          <ToggleItem label="Biometric login" sub="Face ID or fingerprint" checked={prefBiometric} onChange={() => setPrefBiometric(v => !v)} last />
          <ListItemButton divider={false}>
            <ListItemIcon sx={{ minWidth: 40 }}><LanguageIcon /></ListItemIcon>
            <ListItemText primary="Language" secondary="English" secondaryTypographyProps={{ fontSize: 12 }} />
            <ChevronRightIcon color="action" />
          </ListItemButton>
        </List>
      </Card>

      <SectionLabel>Learn</SectionLabel>
      <Card sx={{ mb: 1 }}>
        <List disablePadding>
          <ListItemButton onClick={() => navigate('main', 'howRewards')}>
            <ListItemIcon sx={{ minWidth: 40 }}><HelpOutlineIcon /></ListItemIcon>
            <ListItemText primary="How Rewards Work" />
            <ChevronRightIcon color="action" />
          </ListItemButton>
        </List>
      </Card>

      <SectionLabel>Support</SectionLabel>
      <Card sx={{ mb: 1 }}>
        <List disablePadding>
          <ListItemButton divider>
            <ListItemIcon sx={{ minWidth: 40 }}><PhoneIcon /></ListItemIcon>
            <ListItemText primary="Help & Support" secondary="1-888-331-6133" secondaryTypographyProps={{ fontSize: 12 }} />
            <ChevronRightIcon color="action" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon sx={{ minWidth: 40 }}><GavelIcon /></ListItemIcon>
            <ListItemText primary="Legal & Privacy" />
            <ChevronRightIcon color="action" />
          </ListItemButton>
        </List>
      </Card>

      <SectionLabel>App</SectionLabel>
      <Card>
        <List disablePadding>
          <ListItemButton onClick={() => navigate('main', 'about')} divider>
            <ListItemIcon sx={{ minWidth: 40 }}><InfoOutlinedIcon /></ListItemIcon>
            <ListItemText primary="About" secondary="Version 1.0.0" secondaryTypographyProps={{ fontSize: 12 }} />
            <ChevronRightIcon color="action" />
          </ListItemButton>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 40 }}><SystemUpdateIcon /></ListItemIcon>
            <ListItemText primary="Check for updates" />
            <Typography variant="body2" color="success.main">Up to date</Typography>
          </ListItem>
        </List>
      </Card>
    </Box>
  );
}

export function Profile() {
  const [editing, setEditing] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [newValue, setNewValue] = useState('');

  const fields = [
    { key: 'card', label: 'Card', value: '•••• 4829', editable: false },
    { key: 'email', label: 'Email', value: 'sarah@example.com', editable: true },
    { key: 'phone', label: 'Phone', value: '+1 (416) •••-••89', editable: true },
    { key: 'address', label: 'Address', value: '123 Main St, Toronto ON', editable: true },
  ];

  if (editing) {
    const field = fields.find(f => f.key === editing);
    return (
      <Box sx={{ flex: 1, p: 2, pb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Update {field.label}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Current: {field.value}</Typography>
            <TextField
              fullWidth
              placeholder={`New ${field.label.toLowerCase()}`}
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              autoFocus
              sx={{ mb: 1.5 }}
            />
            <Alert severity="warning" sx={{ mb: 2, fontSize: 12 }}>
              Changes take 1–2 business days and may require identity verification.
            </Alert>
            <Button variant="contained" fullWidth disabled={!newValue.trim()} onClick={() => { setSubmitted(field.label); setEditing(null); setNewValue(''); }}>
              Submit request
            </Button>
            <Button fullWidth sx={{ mt: 1 }} onClick={() => { setEditing(null); setNewValue(''); }}>Cancel</Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, p: 2, pb: 4 }}>
      {submitted && (
        <Alert severity="success" sx={{ mb: 1.5, fontSize: 13 }}>
          Your {submitted.toLowerCase()} update request has been submitted. Changes typically take 1–2 business days.
        </Alert>
      )}

      <Card sx={{ mb: 2, textAlign: 'center' }}>
        <CardContent>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'grey.200', mx: 'auto', mb: 1.5, fontSize: 24, color: 'text.primary' }}>S</Avatar>
          <Typography variant="h6" fontWeight={700}>Sarah</Typography>
          <Typography variant="body2" color="text.secondary">Member since March 2024</Typography>
        </CardContent>
      </Card>

      <Card>
        <List disablePadding>
          {fields.map((f, i) => (
            <ListItem key={f.key} divider={i < fields.length - 1} sx={{ py: 1.5 }}>
              <ListItemText
                primary={<Typography variant="caption" color="text.secondary">{f.label}</Typography>}
                secondary={<Typography variant="body2">{f.value}</Typography>}
              />
              {f.editable && (
                <Button size="small" onClick={() => setEditing(f.key)}>Update</Button>
              )}
            </ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
}

export function About() {
  return (
    <Box sx={{ flex: 1, p: 2, pb: 4 }}>
      <Card sx={{ textAlign: 'center', mb: 2 }}>
        <CardContent sx={{ py: 3.5 }}>
          <img src="/logo.svg" alt="Walmart Rewards Mastercard" style={{ width: 56, height: 56, marginBottom: 16 }} />
          <Typography variant="subtitle1" fontWeight={600}>Walmart Rewards Mastercard</Typography>
          <Typography variant="body2" color="text.secondary">Version 1.0.0</Typography>
          <Typography variant="caption" color="text.secondary">March 2026</Typography>
        </CardContent>
      </Card>
      <Card sx={{ mb: 2 }}>
        <List disablePadding>
          {['Cardholder Agreement', 'Privacy Policy', 'Terms of Use'].map((label, i, arr) => (
            <ListItemButton key={i} divider={i < arr.length - 1}>
              <ListItemText primary={label} />
              <ChevronRightIcon color="action" />
            </ListItemButton>
          ))}
        </List>
      </Card>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.7, display: 'block' }}>
          Issued by Fairstone Bank of Canada<br />
          ® / ™ Mastercard International Incorporated<br />
          © 2026 Walmart Canada Corp. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
