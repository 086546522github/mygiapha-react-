import React, { useState } from 'react';
import './Navigation.css';

export default function Navigation({ currentPage, onNavigate, isLoggedIn, user, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleNavClick = (page) => {
    if (!isLoggedIn && (page === 'dashboard' || page === 'family-tree' || page === 'member-list' || page === 'profile')) {
      onNavigate('login');
      return;
    }
    onNavigate(page);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => onNavigate('home')}>
          🌳 Gia Phả Việt
        </div>
        
        <div className="nav-menu">
          <button 
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Trang chủ
          </button>
          
          {isLoggedIn && (
            <>
              <button 
                className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`nav-item ${currentPage === 'family-tree' ? 'active' : ''}`}
                onClick={() => handleNavClick('family-tree')}
              >
                Cây gia phả
              </button>
              <button 
                className={`nav-item ${currentPage === 'member-list' ? 'active' : ''}`}
                onClick={() => handleNavClick('member-list')}
              >
                Danh sách thành viên
              </button>
            </>
          )}
          
          <button 
            className={`nav-item ${currentPage === 'vip' ? 'active' : ''}`}
            onClick={() => handleNavClick('vip')}
          >
            Gói VIP
          </button>
        </div>

        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="user-menu">
              <div 
                className="user-info"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <span className="user-name">{user?.name || 'User'}</span>
                <span className="dropdown-arrow">▼</span>
              </div>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <button onClick={() => { handleNavClick('profile'); setShowUserMenu(false); }}>
                    Thông tin cá nhân
                  </button>
                  <button onClick={() => { handleNavClick('dashboard'); setShowUserMenu(false); }}>
                    Dashboard
                  </button>
                  <hr />
                  <button onClick={() => { onLogout(); setShowUserMenu(false); }}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="btn-login"
                onClick={() => handleNavClick('login')}
              >
                Đăng nhập
              </button>
              <button 
                className="btn-register"
                onClick={() => handleNavClick('register')}
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
