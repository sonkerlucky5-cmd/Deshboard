import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const Topbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const { role, toggleRole, darkMode, toggleDarkMode } = useFinance();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/transactions': return 'Transactions';
      case '/insights': return 'Insights';
      default: return 'Finance Dashboard';
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn mobile-only" onClick={toggleSidebar} style={{ display: 'none' }}>
          <Menu size={20} />
        </button>
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>
      
      <div className="topbar-right">
        <div className="role-switch">
          <span className="role-label">Role:</span>
          <button className="switch-btn" onClick={toggleRole}>
            {role}
          </button>
        </div>
        
        <button className="icon-btn" onClick={toggleDarkMode} title="Toggle Theme">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="icon-btn" title="Notifications">
          <Bell size={20} />
        </button>
        
        <div className="avatar" style={{
          width: '36px', height: '36px', borderRadius: '50%', 
          backgroundColor: 'var(--primary)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', marginLeft: '8px'
        }}>
          JD
        </div>
      </div>
    </header>
  );
};

export default Topbar;
