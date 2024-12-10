import { createTheme } from '@mui/material/styles';

const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '2.25rem',
      fontWeight: 700,
      background: 'linear-gradient(90deg, #4A6FFF 0%, #C31FE6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.5,
      color: 'rgba(0, 0, 0, 0.7)',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '14px',
          variants: []
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 4px',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#4A6FFF',
      light: '#E8EDFF',
      dark: '#3D5CD7',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C31FE6',
      light: '#F2E8FF',
      dark: '#9517B5',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#738FFF',
      light: '#1A2137',
      dark: '#4A6FFF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D161EE',
      light: '#2A1F2D',
      dark: '#C31FE6',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
  },
}); 