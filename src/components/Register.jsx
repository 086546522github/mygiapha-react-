import React, { useState } from "react";
import "./Register.css";

export default function Register({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    
    if (formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    
    if (!formData.agreeTerms) {
      alert("Vui lòng đồng ý với điều khoản sử dụng!");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Create new user data
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: '',
        bio: '',
        vipStatus: 'free',
        avatar: null,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage (in real app, this would be sent to server)
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      alert("Đăng ký thành công! Chào mừng bạn đến với Gia Phả Việt!");
      onNavigate('dashboard');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <div className="register-header">
          <h2>Tạo tài khoản</h2>
          <p>Tham gia cùng hàng nghìn gia đình đã tin tưởng sử dụng Gia Phả Việt</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên của bạn"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email *</label>
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
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại (tùy chọn)"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Mật khẩu *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tối thiểu 6 ký tự"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Xác nhận mật khẩu *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <span className="checkmark"></span>
              Tôi đồng ý với <a href="#" className="terms-link">Điều khoản sử dụng</a> và <a href="#" className="terms-link">Chính sách bảo mật</a>
            </label>
          </div>
          
          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản miễn phí'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>
            Đã có tài khoản?{" "}
            <span onClick={() => onNavigate("login")} className="login-link">
              Đăng nhập ngay
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}