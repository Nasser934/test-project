import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { theme } from './styles/theme';
import { Navigation } from './components/shared/Navigation';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { CVUpload } from './components/cv/CVUpload';
import { CVPreview } from './components/cv/CVPreview';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProfileEdit } from './components/profile/ProfileEdit';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload-cv"
              element={
                <ProtectedRoute>
                  <CVUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cv-preview/:cvId"
              element={
                <ProtectedRoute>
                  <CVPreview />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 