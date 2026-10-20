import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeModeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { RecoveryProvider } from './context/RecoveryContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })));
const VerifyOtpPage = lazy(() => import('./pages/VerifyOtpPage').then((module) => ({ default: module.VerifyOtpPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage').then((module) => ({ default: module.ChangePasswordPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function App() {
  return (
    <ThemeModeProvider>
      <BrowserRouter>
        <AuthProvider>
          <RecoveryProvider>
          <div style={styles.appContainer}>
            <Navbar />
            <main style={styles.mainContent}>
              <Suspense fallback={<div role="status" style={{ padding: 24, textAlign: 'center' }}>Loading page…</div>}>
              <Routes>
                {/* Default redirect to /login or /home */}
                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* Page 3: Protected Welcome Home Route */}
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />

                {/* Page 1: Public Registration */}
                <Route path="/register" element={<RegisterPage />} />

                {/* Page 2: Public Login */}
                <Route path="/login" element={<LoginPage />} />

                {/* Page 4: Forgot Password */}
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Page 5: Verify OTP */}
                <Route path="/verify-otp" element={<VerifyOtpPage />} />

                {/* Page 6: Reset Password */}
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Page 7: Protected Change Password */}
                <Route
                  path="/change-password"
                  element={
                    <ProtectedRoute>
                      <ChangePasswordPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              </Suspense>
            </main>
          </div>
          </RecoveryProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeModeProvider>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
  mainContent: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
};

export default App;
