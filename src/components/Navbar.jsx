import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, KeyRound, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav} aria-label="Main navigation">
      <div style={styles.container}>
        <Link to="/home" style={styles.brand}>
          <ShoppingBag size={22} color="var(--primary-color, #2563EB)" />
          <span style={styles.brandText}>E-Commerce</span>
        </Link>

        <div style={styles.rightSection}>
          <ThemeToggle />

          {isAuthenticated ? (
            <div style={styles.userActions}>
              <span style={styles.userName}>
                <User size={15} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {user?.fullName || 'Account'}
              </span>

              <Link to="/change-password" style={styles.navLink} title="Change Password">
                <KeyRound size={15} />
                <span>Password</span>
              </Link>

              <button
                onClick={handleLogout}
                style={styles.logoutBtn}
                title="Sign out of your account"
                id="btn-navbar-logout"
                type="button"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={styles.authLinks}>
              <Link to="/login" style={styles.loginLink} id="nav-link-login">
                Sign In
              </Link>
              <Link to="/register" style={styles.registerBtn} id="nav-link-register">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-subtle)',
    padding: '12px 24px',
    transition: 'background-color 0.2s ease',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  brandText: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    display: 'inline-flex',
    alignItems: 'center',
  },
  navLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    transition: 'color 0.2s ease',
  },
  logoutBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: '#dc2626',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid rgba(220, 38, 38, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  authLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  loginLink: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  registerBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    backgroundColor: 'var(--primary-color, #2563EB)',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
  },
};
