import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0071CE' },
    secondary: { main: '#333333' },
    success: { main: '#2d7a3a', light: '#e8f5e9' },
    warning: { main: '#b8860b', light: '#fff8e1' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
    text: { primary: '#1a1a1a', secondary: '#666666', disabled: '#999999' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, fontWeight: 600, padding: '10px 20px' },
        sizeLarge: { padding: '14px 24px', fontSize: '1rem' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true, size: 'medium' },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: { height: 64 },
      },
    },
  },
});

export default theme;
