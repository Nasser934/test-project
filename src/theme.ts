import { createTheme } from '@mui/material/styles';
import { arEG } from '@mui/material/locale';

export const theme = createTheme(
  {
    direction: 'rtl',
    palette: {
      mode: 'light',
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
    },
    typography: {
      fontFamily: [
        'Cairo',
        'Roboto',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            direction: 'rtl',
          },
        },
      },
    },
  },
  arEG
); 