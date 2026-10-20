import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/authService';
import { ThemeToggle } from '../components/ThemeToggle';
import { LogOut, KeyRound, User, CheckCircle2 } from 'lucide-react';

export const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState('');

  useEffect(() => {
    // Request the protected home endpoint to verify backend authorization
    authService
      .getHome()
      .then((res) => {
        if (!res?.message) setServerMessage('The protected home response was incomplete.');
      })
      .catch(() => {
        setServerMessage('Unable to verify access with the backend. Please sign in again.');
      });
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <CheckCircle2 size={32} color="#16A34A" />
          </div>
          <h1 id="welcome-title" style={styles.title}>
            Welcome to Home Page!
          </h1>
          <p style={styles.subtitle}>You have successfully logged in.</p>
          {serverMessage && <p role="status" style={styles.serverMessage}>{serverMessage}</p>}
        </div>

        {user && (
          <div style={styles.userSection}>
            <div style={styles.avatarRow}>
              <div style={styles.avatar}>
                <User size={20} color="var(--primary-color, #2563EB)" />
              </div>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{user.fullName}</div>
                <div style={styles.userEmail}>{user.email}</div>
                {user.mobileE164 && (
                  <div style={styles.userPhone}>{user.mobileE164}</div>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={styles.controlsRow}>
          <ThemeToggle />
          <Link to="/change-password" style={styles.changePasswordLink}>
            <KeyRound size={15} />
            <span>Change Password</span>
          </Link>
        </div>

        <div style={styles.actionSection}>
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            id="btn-home-logout"
            type="button"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 80px)',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
    padding: '36px 28px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
  },
  header: {
    marginBottom: '24px',
  },
  iconCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
  },
  serverMessage: {
    marginTop: '8px',
    color: '#dc2626',
    fontSize: '13px',
  },
  userSection: {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '8px',
    padding: '14px 16px',
    marginBottom: '24px',
    textAlign: 'left',
    border: '1px solid var(--border-subtle)',
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userInfo: {
    overflow: 'hidden',
  },
  userName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  userEmail: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  userPhone: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderTop: '1px solid var(--border-subtle)',
    borderBottom: '1px solid var(--border-subtle)',
    marginBottom: '24px',
  },
  changePasswordLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--primary-color, #2563EB)',
    textDecoration: 'none',
  },
  actionSection: {
    display: 'flex',
    justifyContent: 'center',
  },
  logoutBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};
