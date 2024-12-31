import { ThemeOptions } from '@material-ui/core/styles';

export const getTheme = (isDarkMode: boolean): ThemeOptions => ({
  direction: 'rtl',
  palette: {
    type: isDarkMode ? 'dark' : 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: isDarkMode ? '#303030' : '#f5f5f5',
      paper: isDarkMode ? '#424242' : '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Cairo',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  overrides: {
    MuiPaper: {
      rounded: {
        borderRadius: 12,
        boxShadow: isDarkMode 
          ? '0 3px 5px 2px rgba(0, 0, 0, .15)'
          : '0 3px 5px 2px rgba(0, 0, 0, .05)',
      },
    },
    MuiButton: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontSize: '1rem',
        padding: '8px 24px',
      },
    },
    MuiTextField: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
}); 