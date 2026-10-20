import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ style }) => {
  const { mode, toggleTheme } = useAppTheme();
  const isDark = mode === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      style={{
        ...styles.toggleBtn,
        ...style,
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <>
          <Sun size={16} color="#FBBF24" />
          <span style={styles.label}>Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={16} color="#64748B" />
          <span style={styles.label}>Dark Mode</span>
        </>
      )}
    </button>
  );
};

const styles = {
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  label: {
    userSelect: 'none',
  },
};
