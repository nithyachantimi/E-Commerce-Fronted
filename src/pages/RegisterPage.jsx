import React, { useState } from 'react';
import { isValidPhoneNumber } from 'libphonenumber-js/max';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';
import { PhoneNumberInput } from '../components/PhoneNumberInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { AlertBanner } from '../components/AlertBanner';
import { UserPlus, Mail, ShieldCheck, User } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneRegion: 'IN',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (validationErrors[id]) {
      setValidationErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleCountryChange = ({ region }) => setFormData((prev) => ({ ...prev, phoneRegion: region }));

  const validate = () => {
    const errors = {};
    const trimmedName = formData.fullName.trim();
    if (trimmedName.length < 3 || trimmedName.length > 100) {
      errors.fullName = 'Full name must be between 3 and 100 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Mobile number is required';
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = 'Enter a valid mobile number for the selected country';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-]).{8,100}$/.test(formData.password)) {
      errors.password = 'Must be 8–100 characters and include uppercase, lowercase, a number, and a special character';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.phoneNumber,
        phoneRegion: formData.phoneRegion,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Redirect to login with success alert
      navigate('/login', {
        state: { message: 'Registration successful! Please sign in with your new credentials.' },
      });
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Registration failed. Please check your details.';

      if (err.response?.data?.fieldErrors) {
        setValidationErrors(err.response.data.fieldErrors);
      } else if (err.response?.data?.validationErrors) {
        setValidationErrors(err.response.data.validationErrors);
      }
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create an account"
      subtitle="Register to start using the e-commerce platform"
      icon={UserPlus}
    >
      <AlertBanner type="error" message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <FormInput
          id="fullName"
          label="Full Name"
          placeholder="e.g. John Doe"
          value={formData.fullName}
          onChange={handleChange}
          error={validationErrors.fullName}
          icon={User}
          required
          autoComplete="name"
        />

        {/* Email */}
        <FormInput
          id="email"
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          error={validationErrors.email}
          icon={Mail}
          required
          autoComplete="email"
        />

        {/* International Phone */}
        <PhoneNumberInput
          id="phoneNumber"
          label="International Mobile Number"
          countryCode={formData.countryCode}
          phoneRegion={formData.phoneRegion}
          onCountryChange={handleCountryChange}
          value={formData.phoneNumber}
          onChange={(phoneNumber) => {
            setFormData((prev) => ({ ...prev, phoneNumber }));
            if (validationErrors.phoneNumber) setValidationErrors((prev) => ({ ...prev, phoneNumber: null }));
          }}
          error={validationErrors.phoneNumber}
          required
        />

        {/* Password */}
        <PasswordInput
          id="password"
          label="Password"
          placeholder="At least 8 characters (Aa1@)"
          value={formData.password}
          onChange={handleChange}
          error={validationErrors.password}
          showStrengthMeter={true}
          required
          autoComplete="new-password"
        />

        {/* Confirm Password */}
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={validationErrors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <PrimaryButton
          id="btn-register-submit"
          type="submit"
          loading={loading}
          icon={ShieldCheck}
        >
          Create Account
        </PrimaryButton>

        <div style={styles.footer}>
          <span style={styles.footerText}>Already have an account?</span>
          <Link to="/login" style={styles.loginLink}>
            Sign In
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

const styles = {
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
  loginLink: {
    color: 'var(--primary-color, #2563EB)',
    fontWeight: '600',
    textDecoration: 'none',
  },
};
