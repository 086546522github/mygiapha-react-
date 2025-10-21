import React, { useState, useEffect } from 'react';
import './Dashboard.css';

export default function Dashboard({ user, onNavigate }) {
  const [familyTrees, setFamilyTrees] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalTrees: 0,
    recentActivity: []
  });

  // Load user's family data from localStorage
  useEffect(() => {
    const userKey = `members_${user?.id || 'guest'}`;
    const members = JSON.parse(localStorage.getItem(userKey) || '[]');
    
    // Create a default family tree if members exist
    const defaultTree = {
      id: 1,
      name: 'Cây gia phả chính',
      members: members,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setFamilyTrees([defaultTree]);
    
    // Calculate stats
    const totalMembers = members.length;
    const totalTrees = members.length > 0 ? 1 : 0; // Only show tree if there are members
    
    setStats({
      totalMembers,
      totalTrees,
      recentActivity: [
        { action: 'Tạo cây gia phả mới', date: new Date().toLocaleDateString('vi-VN'), tree: 'Cây gia phả chính' },
        { action: 'Thêm thành viên', date: new Date().toLocaleDateString('vi-VN'), tree: 'Cây gia phả chính' },
        { action: 'Cập nhật thông tin', date: new Date().toLocaleDateString('vi-VN'), tree: 'Cây gia phả chính' }
      ]
    });
  }, [user]);

  const createNewTree = () => {
    // For now, just navigate to family tree page
    onNavigate('family-tree');
  };

  const deleteTree = (treeId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu gia phả?')) {
      const userKey = `members_${user?.id || 'guest'}`;
      localStorage.removeItem(userKey);
      setFamilyTrees([]);
      setStats(prev => ({ ...prev, totalMembers: 0, totalTrees: 0 }));
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Chào mừng trở lại, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌳</div>
          <div className="stat-content">
            <h3>{stats.totalTrees}</h3>
            <p>Cây gia phả</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalMembers}</h3>
            <p>Thành viên</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{user?.vipStatus || 'Free'}</h3>
            <p>Gói dịch vụ</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{new Date().toLocaleDateString('vi-VN')}</h3>
            <p>Hôm nay</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Family Trees Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Cây gia phả của bạn</h2>
            <button className="btn-primary" onClick={createNewTree}>
              + Tạo cây mới
            </button>
          </div>
          
          {familyTrees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌳</div>
              <h3>Chưa có cây gia phả nào</h3>
              <p>Bắt đầu tạo cây gia phả đầu tiên của bạn</p>
              <button className="btn-primary" onClick={createNewTree}>
                Tạo cây gia phả
              </button>
            </div>
          ) : (
            <div className="trees-grid">
              {familyTrees.map(tree => (
                <div key={tree.id} className="tree-card">
                  <div className="tree-header">
                    <h3>{tree.name}</h3>
                    <div className="tree-actions">
                      <button 
                        className="btn-icon"
                        onClick={() => onNavigate('family-tree')}
                        title="Xem cây gia phả"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={() => onNavigate('member-list')}
                        title="Danh sách thành viên"
                      >
                        👥
                      </button>
                      <button 
                        className="btn-icon danger"
                        onClick={() => deleteTree(tree.id)}
                        title="Xóa cây"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="tree-stats">
                    <span>{tree.members?.length || 0} thành viên</span>
                    <span>Cập nhật: {new Date(tree.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="tree-preview">
                    <div className="mini-tree">
                      <div className="mini-node">👴</div>
                      <div className="mini-branch"></div>
                      <div className="mini-children">
                        <div className="mini-node">👨</div>
                        <div className="mini-node">👩</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <h2>Hoạt động gần đây</h2>
          <div className="activity-list">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <p>{activity.action}</p>
                  <span>{activity.tree} • {activity.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>Thao tác nhanh</h2>
          <div className="quick-actions">
            <button 
              className="quick-action-btn"
              onClick={() => onNavigate('family-tree')}
            >
              <div className="action-icon">🌳</div>
              <span>Xem cây gia phả</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => onNavigate('member-list')}
            >
              <div className="action-icon">👥</div>
              <span>Quản lý thành viên</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => onNavigate('profile')}
            >
              <div className="action-icon">⚙️</div>
              <span>Cài đặt tài khoản</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => onNavigate('vip')}
            >
              <div className="action-icon">💎</div>
              <span>Nâng cấp VIP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

