import { createTheme } from '@mui/material/styles';

export const lightTokens = {
  primary: '#2563EB',
  background: '#F8FAFC',
  card: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#16A34A',
  error: '#DC2626',
};

export const darkTokens = {
  primary: '#3B82F6',
  background: '#0F172A',
  card: '#1E293B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#22C55E',
  error: '#F87171',
};

export const createAppTheme = (mode = 'light') => {
  const tokens = mode === 'dark' ? darkTokens : lightTokens;

  return createTheme({
    palette: {
      mode,
      primary: { main: tokens.primary },
      background: { default: tokens.background, paper: tokens.card },
      text: { primary: tokens.textPrimary, secondary: tokens.textSecondary },
      divider: tokens.border,
      success: { main: tokens.success },
      error: { main: tokens.error },
    },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: tokens.card,
            border: `1px solid ${tokens.border}`,
            boxShadow: mode === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            color: tokens.textPrimary,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            height: '44px',
            borderRadius: '8px',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
    },
  });
};
