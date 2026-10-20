import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Hash, ShieldCheck, ArrowLeft, RotateCw } from 'lucide-react';
import { authService } from '../api/authService';
import { AlertBanner } from '../components/AlertBanner';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { useRecovery } from '../context/RecoveryContext';

export const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setRecoveryToken } = useRecovery();
  const identifier = location.state?.identifier || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(60);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!identifier) {
      setError('Start with the forgot-password page so we know which account to verify.');
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the complete 6-digit numeric verification code.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyOtp(identifier, otp);
      const recoveryToken = response.data?.recoveryToken;
      if (!recoveryToken) {
        throw new Error('The server did not return recovery authorization.');
      }
      setRecoveryToken(recoveryToken);
      navigate('/reset-password', { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        requestError.message ||
        'Code verification failed. Check the code or try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending || !identifier) return;

    setError('');
    setSuccessMsg('');
    setResending(true);
    try {
      const res = await authService.forgotPassword(identifier);
      setSuccessMsg(res.message || 'If an account exists, follow the configured recovery delivery method for the new code.');
      setCooldown(60);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to resend code. Please try again later.'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthCard
      title="Verify Recovery Code"
      subtitle={
        identifier
          ? `If an account exists and recovery delivery is configured, enter the 6-digit code for ${identifier}`
          : 'Enter the 6-digit recovery code'
      }
      icon={ShieldCheck}
    >
      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={successMsg} onClose={() => setSuccessMsg('')} />

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          id="otp"
          label="6-Digit OTP Code"
          placeholder="123456"
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
          icon={Hash}
          inputMode="numeric"
          autoComplete="one-time-code"
          required
        />

        <div style={styles.guidanceBox}>
          <span>⏱ Code is valid for 5 minutes (max 5 attempts).</span>
        </div>

        <PrimaryButton
          id="btn-verify-otp-submit"
          type="submit"
          loading={loading}
          icon={ShieldCheck}
        >
          Verify & Continue
        </PrimaryButton>

        <div style={styles.resendRow}>
          {cooldown > 0 ? (
            <span style={styles.cooldownText}>
              Resend code in {cooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              style={styles.resendBtn}
            >
              <RotateCw size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>

        <div style={styles.footer}>
          <Link to="/forgot-password" style={styles.backLink}>
            <ArrowLeft size={15} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Back to Recovery Request
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

const styles = {
  guidanceBox: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '18px',
    textAlign: 'center',
  },
  resendRow: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '13px',
  },
  cooldownText: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
  },
  resendBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--primary-color, #2563EB)',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    padding: 0,
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '13px',
  },
  backLink: {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: '500',
  },
};
