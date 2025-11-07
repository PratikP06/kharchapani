import React from 'react';

const Sidebar = ({ user, currentPage, onNavigate, onLogout }) => {
  return (
    <div className="sidebar">
      
      <div className="user-profile">
        <div className="avatar">{user.name[0].toUpperCase()}</div>
        <h3 className="user-name">{user.name}</h3>
        <p className="user-email">{user.email}</p>
      </div>
      
      <nav className="nav">
        <div
          className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </div>
        <div
          className={`nav-item ${currentPage === 'expenses' ? 'active' : ''}`}
          onClick={() => onNavigate('expenses')}
        >
          Expenses
        </div>
        <div className="nav-item" onClick={onLogout}>
          Logout
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;