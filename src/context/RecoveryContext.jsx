import React, { createContext, useContext, useMemo, useState } from 'react';

const RecoveryContext = createContext(null);

export const RecoveryProvider = ({ children }) => {
  const [recoveryToken, setRecoveryToken] = useState(null);
  const value = useMemo(() => ({ recoveryToken, setRecoveryToken }), [recoveryToken]);
  return <RecoveryContext.Provider value={value}>{children}</RecoveryContext.Provider>;
};

export const useRecovery = () => {
  const context = useContext(RecoveryContext);
  if (!context) throw new Error('useRecovery must be used inside RecoveryProvider');
  return context;
};
