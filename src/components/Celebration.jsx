import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import StarIcon from '@mui/icons-material/Star';

export function Celebration({ show }) {
  return (
    <Snackbar
      open={show}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ top: '30% !important', '& .MuiSnackbarContent-root': { justifyContent: 'center' } }}
    >
      <Alert
        icon={<StarIcon sx={{ color: '#FFD700' }} />}
        severity="success"
        variant="filled"
        sx={{ fontSize: 16, fontWeight: 700, borderRadius: 3, px: 4, py: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
      >
        Milestone Reached! Keep earning rewards
      </Alert>
    </Snackbar>
  );
}
