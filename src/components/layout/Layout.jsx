import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../../styles/layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="main-content">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content-area fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
