import React, { useState } from "react";
import "./Login.css";

export default function Login({ onLogin, onNavigate }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Simple validation and demo login
      if (formData.email && formData.password) {
        // Create demo user data
        const userData = {
          id: Date.now(),
          name: formData.email.split('@')[0],
          email: formData.email,
          phone: '0123456789',
          address: 'Hà Nội, Việt Nam',
          bio: 'Người dùng demo',
          vipStatus: 'free',
          avatar: null,
          createdAt: new Date().toISOString()
        };

        onLogin(userData);
        alert("Đăng nhập thành công!");
      } else {
        alert("Vui lòng điền đầy đủ thông tin!");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h2>Đăng nhập</h2>
          <p>Chào mừng bạn trở lại!</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Mật khẩu:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              Ghi nhớ đăng nhập
            </label>
            <a href="#" className="forgot-password">Quên mật khẩu?</a>
          </div>
          
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Chưa có tài khoản?{" "}
            <span onClick={() => onNavigate("register")} className="register-link">
              Đăng ký ngay
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}