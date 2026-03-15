import { useState, useEffect, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export function Header({ title, onBack, tab, onAvatarTap }) {
  const isHome = !onBack && tab === 'home';
  const isActivity = !onBack && tab === 'activity';
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} style={{ height: 0, width: '100%', flexShrink: 0 }} />
      <AppBar
        position="sticky"
        color="inherit"
        elevation={scrolled ? 2 : 0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: scrolled ? 'none' : '1px solid',
          borderColor: 'divider',
          zIndex: 10,
        }}
      >
        <Toolbar sx={{ minHeight: 58, justifyContent: 'space-between', px: 1.5 }}>
          {/* Left zone */}
          <Box sx={{ width: 48 }}>
            {onBack ? (
              <IconButton onClick={onBack} aria-label="Go back" size="small">
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <img src="/logo.svg" alt="Walmart Rewards Mastercard" style={{ width: 32, height: 32 }} />
            )}
          </Box>

          {/* Center: title */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            {onBack ? (
              <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
            ) : isHome ? null : (
              <Typography variant="h6" fontWeight={700}>{title}</Typography>
            )}
          </Box>

          {/* Right zone */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 'auto' }}>
            {isHome && (
              <IconButton aria-label="Notifications" size="small">
                <NotificationsOutlinedIcon />
              </IconButton>
            )}
            {isActivity && (
              <IconButton aria-label="Search transactions" size="small">
                <SearchIcon />
              </IconButton>
            )}
            {!onBack && (
              <IconButton onClick={onAvatarTap} aria-label="Account" size="small">
                <Avatar sx={{ width: 30, height: 30, bgcolor: 'grey.200', color: 'text.primary', fontSize: 13, fontWeight: 600 }}>
                  S
                </Avatar>
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

const tabConfig = [
  { id: 'home', label: 'Home', icon: <HomeOutlinedIcon /> },
  { id: 'rewards', label: 'Rewards', icon: <StarOutlineIcon /> },
  { id: 'activity', label: 'Activity', icon: <ReceiptLongOutlinedIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsOutlinedIcon /> },
];

export function BottomNav({ active, onNavigate }) {
  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, zIndex: 10 }}
      elevation={8}
    >
      <BottomNavigation
        value={active}
        onChange={(_, val) => onNavigate(val)}
        showLabels
      >
        {tabConfig.map(t => (
          <BottomNavigationAction key={t.id} value={t.id} label={t.label} icon={t.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
