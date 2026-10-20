import React, { useState } from 'react';
import { isValidPhoneNumber } from 'libphonenumber-js/max';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PhoneNumberInput } from '../components/PhoneNumberInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { AlertBanner } from '../components/AlertBanner';
import { KeyRound, Mail, Phone, ArrowLeft, Send } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState('email'); // 'email' | 'phone'
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneRegion, setPhoneRegion] = useState('IN');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    let identifier = '';
    if (mode === 'email') {
      if (!email.trim()) {
        setError('Please enter your account email address.');
        return;
      }
      identifier = email.trim();
    } else {
      if (!isValidPhoneNumber(phoneNumber)) {
        setError('Please enter a valid international mobile number.');
        return;
      }
      identifier = phoneNumber;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(identifier);
      setSuccessMsg(
        res.message || 'If an account exists, follow the configured recovery steps. Continue to verify a code if one is available.'
      );
      setTimeout(() => {
        navigate('/verify-otp', { state: { identifier } });
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to process recovery request. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Initiate account recovery via email or mobile number"
      icon={KeyRound}
    >
      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={successMsg} onClose={() => setSuccessMsg('')} />

      {/* Mode Switcher */}
      <div style={styles.tabRow}>
        <button
          type="button"
          onClick={() => {
            setMode('email');
            setError('');
          }}
          style={{
            ...styles.tabBtn,
            backgroundColor: mode === 'email' ? 'var(--primary-color, #2563EB)' : 'transparent',
            color: mode === 'email' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <Mail size={14} />
          <span>Email Address</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('phone');
            setError('');
          }}
          style={{
            ...styles.tabBtn,
            backgroundColor: mode === 'phone' ? 'var(--primary-color, #2563EB)' : 'transparent',
            color: mode === 'phone' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <Phone size={14} />
          <span>Mobile Number</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {mode === 'email' ? (
          <FormInput
            id="email"
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
            autoComplete="email"
          />
        ) : (
          <PhoneNumberInput
            id="recoveryPhone"
            label="International Mobile Number"
            countryCode={countryCode}
            phoneRegion={phoneRegion}
            onCountryChange={({ region }) => setPhoneRegion(region)}
            value={phoneNumber}
            onChange={setPhoneNumber}
            required
          />
        )}

        <PrimaryButton
          id="btn-forgot-submit"
          type="submit"
          loading={loading}
          icon={Send}
        >
          Send Recovery Code
        </PrimaryButton>

        <div style={styles.footer}>
          <Link to="/login" style={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

const styles = {
  tabRow: {
    display: 'flex',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '8px',
    padding: '4px',
    marginBottom: '20px',
    border: '1px solid var(--border-subtle)',
    gap: '4px',
  },
  tabBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    textDecoration: 'none',
  },
};
