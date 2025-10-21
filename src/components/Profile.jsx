import React, { useState, useEffect } from 'react';
import './Profile.css';

export default function Profile({ user, onUpdateUser, onNavigate }) {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatar: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        avatar: user.avatar || null
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...user, ...profileData };
    onUpdateUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setIsEditing(false);
    alert('Cập nhật thông tin thành công!');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    // In a real app, you would send this to the server
    alert('Đổi mật khẩu thành công!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordForm(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem(`familyTrees_${user?.id}`);
      localStorage.removeItem(`members_${user?.id}`);
      onNavigate('home');
      alert('Tài khoản đã được xóa!');
    }
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Thông tin cá nhân</h1>
        <p>Quản lý thông tin tài khoản và cài đặt</p>
      </div>

      <div className="profile-content">
        {/* Profile Information */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Thông tin cơ bản</h2>
            <button 
              className={isEditing ? "btn-secondary" : "btn-primary"}
              onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
            >
              {isEditing ? 'Hủy' : 'Chỉnh sửa'}
            </button>
          </div>

          <div className="profile-form">
            <div className="avatar-section">
              <div className="avatar-container">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Avatar" className="profile-avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {profileData.name.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="avatar-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    id="avatar-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="avatar-upload" className="btn-outline">
                    Thay đổi ảnh
                  </label>
                </div>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group full-width">
                <label>Giới thiệu bản thân</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="4"
                  placeholder="Viết một vài dòng về bản thân..."
                />
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button className="btn-primary" onClick={handleSaveProfile}>
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Settings */}
        <div className="profile-section">
          <h2>Cài đặt tài khoản</h2>
          
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Đổi mật khẩu</h3>
                <p>Thay đổi mật khẩu để bảo mật tài khoản</p>
              </div>
              <button 
                className="btn-outline"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                Đổi mật khẩu
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Gói dịch vụ</h3>
                <p>Hiện tại: {user?.vipStatus || 'Miễn phí'}</p>
              </div>
              <button 
                className="btn-primary"
                onClick={() => onNavigate('vip')}
              >
                Nâng cấp
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Xuất dữ liệu</h3>
                <p>Tải xuống tất cả dữ liệu gia phả của bạn</p>
              </div>
              <button className="btn-outline">
                Xuất dữ liệu
              </button>
            </div>
          </div>

          {showPasswordForm && (
            <div className="password-form">
              <h3>Đổi mật khẩu</h3>
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>
              <div className="form-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Hủy
                </button>
                <button 
                  className="btn-primary"
                  onClick={handlePasswordChange}
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="profile-section danger-zone">
          <h2>Vùng nguy hiểm</h2>
          <div className="danger-item">
            <div className="danger-info">
              <h3>Xóa tài khoản</h3>
              <p>Xóa vĩnh viễn tài khoản và tất cả dữ liệu. Hành động này không thể hoàn tác.</p>
            </div>
            <button 
              className="btn-danger"
              onClick={handleDeleteAccount}
            >
              Xóa tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

