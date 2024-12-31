import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './styles/theme';
import { CVPreview } from './components/cv/CVPreview';
import { CVEdit } from './components/cv/CVEdit';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<CVPreview />} />
          <Route path="/edit" element={<CVEdit />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 