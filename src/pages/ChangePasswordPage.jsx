import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ShieldCheck, ArrowLeft } from 'lucide-react';
import { authService } from '../api/authService';
import { useAuth } from '../context/AuthContext';
import { AuthCard } from '../components/AuthCard';
import { PasswordInput } from '../components/PasswordInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { AlertBanner } from '../components/AlertBanner';

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { clearAuthState } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
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
    if (!formData.currentPassword) {
      errors.currentPassword = 'Enter your current password';
    }
    if (!formData.newPassword) {
      errors.newPassword = 'Enter a new password';
    } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-]).{8,100}$/.test(formData.newPassword)) {
      errors.newPassword = 'Must be 8–100 characters and include uppercase, lowercase, a number, and a special character';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authService.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      setSuccessMsg(res.message || 'Password changed successfully! You will be redirected to log in.');
      // Session has been revoked on the server; clear client state
      setTimeout(() => {
        clearAuthState();
        navigate('/login', {
          state: { message: 'Password changed successfully. Please log in with your new password.' },
        });
      }, 1500);
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to change password. Please verify your current password.';
      setError(serverMsg);
      if (err.response?.data?.fieldErrors || err.response?.data?.validationErrors) {
        setValidationErrors(err.response.data.fieldErrors || err.response.data.validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Change Password"
      subtitle="Update your account password securely"
      icon={KeyRound}
    >
      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={successMsg} onClose={() => setSuccessMsg('')} />

      <form onSubmit={handleSubmit} noValidate>
        <PasswordInput
          id="currentPassword"
          label="Current Password"
          placeholder="Enter current password"
          value={formData.currentPassword}
          onChange={handleChange}
          error={validationErrors.currentPassword}
          required
        />

        <PasswordInput
          id="newPassword"
          label="New Password"
          placeholder="At least 8 characters"
          value={formData.newPassword}
          onChange={handleChange}
          error={validationErrors.newPassword}
          required
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          placeholder="Re-enter new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={validationErrors.confirmPassword}
          required
        />

        <PrimaryButton type="submit" loading={loading} icon={ShieldCheck}>
          Update Password
        </PrimaryButton>

        <div style={styles.footerLink}>
          <Link to="/home" style={styles.link}>
            <ArrowLeft size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Back to Home
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

const styles = {
  footerLink: {
    textAlign: 'center',
    marginTop: '20px',
  },
  link: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
};
