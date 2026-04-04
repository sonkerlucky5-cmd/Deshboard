import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialTransactions } from '../data/mockData';

const FinanceContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  const [role, setRole] = useState(() => localStorage.getItem('finance_role') || 'Viewer');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('finance_theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finance_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [darkMode]);

  const addTransaction = (transaction) => {
    setTransactions([
      { ...transaction, id: Date.now().toString() },
      ...transactions
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const toggleRole = () => {
    setRole(prev => prev === 'Viewer' ? 'Admin' : 'Viewer');
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      addTransaction,
      deleteTransaction,
      role,
      toggleRole,
      darkMode,
      toggleDarkMode
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
