import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { AlertBanner } from '../components/AlertBanner';
import { LogIn, User, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.message || '');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (validationErrors[id]) {
      setValidationErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.identifier.trim()) {
      errors.identifier = 'Email or international phone number is required';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData);
      const destination = location.state?.from?.pathname || '/home';
      navigate(destination, { replace: true });
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Invalid identifier or password. Please try again.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to access your account"
      icon={LogIn}
    >
      <AlertBanner
        type="error"
        message={error}
        onClose={() => setError('')}
      />

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          id="identifier"
          label="Email or International Phone"
          placeholder="name@example.com or +919876543210"
          value={formData.identifier}
          onChange={handleChange}
          error={validationErrors.identifier}
          icon={User}
          required
          autoComplete="username"
        />

        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={validationErrors.password}
          required
          autoComplete="current-password"
        />

        <div style={styles.optionsRow}>
          <div />
          <Link to="/forgot-password" style={styles.forgotLink}>
            Forgot Password?
          </Link>
        </div>

        <PrimaryButton
          id="btn-login-submit"
          type="submit"
          loading={loading}
          icon={Sparkles}
        >
          Sign In
        </PrimaryButton>

        <div style={styles.footer}>
          <span style={styles.footerText}>Don't have an account?</span>
          <Link to="/register" style={styles.registerLink}>
            Create an account
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

const styles = {
  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    fontSize: '13px',
  },
  forgotLink: {
    color: 'var(--primary-color, #2563EB)',
    fontWeight: '500',
    textDecoration: 'none',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  footerText: {
    color: 'var(--text-secondary)',
  },
  registerLink: {
    color: 'var(--primary-color, #2563EB)',
    fontWeight: '600',
    textDecoration: 'none',
  },
};
