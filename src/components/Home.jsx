import React from "react";
import "./Home.css";

export default function Home({ onNavigate }) {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            🌳 Gia Phả Việt
          </h1>
          <p className="hero-subtitle">
            Nơi lưu giữ và kết nối những câu chuyện gia đình qua nhiều thế hệ
          </p>
          <p className="hero-description">
            Tạo cây gia phả sống động, lưu trữ kỷ niệm và kết nối các thành viên trong gia đình một cách dễ dàng và trực quan.
          </p>
          <div className="hero-buttons">
            <button 
              className="btn-primary"
              onClick={() => onNavigate('register')}
            >
              Bắt đầu miễn phí
            </button>
            <button 
              className="btn-secondary"
              onClick={() => onNavigate('login')}
            >
              Đăng nhập
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="family-tree-preview">
            <div className="tree-node root">Ông Bà</div>
            <div className="tree-branch"></div>
            <div className="tree-children">
              <div className="tree-node">Cha</div>
              <div className="tree-node">Mẹ</div>
            </div>
            <div className="tree-branch"></div>
            <div className="tree-children">
              <div className="tree-node">Con</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Tính năng nổi bật</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🌳</div>
              <h3>Tạo cây gia phả trực quan</h3>
              <p>Tạo và quản lý cây gia phả với giao diện trực quan, dễ dàng thêm, sửa, xóa các thành viên</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Quản lý thành viên</h3>
              <p>Lưu trữ thông tin chi tiết về từng thành viên: ảnh, tiểu sử, mối quan hệ gia đình</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Đa nền tảng</h3>
              <p>Giao diện thân thiện, tương thích với mọi thiết bị: máy tính, tablet, điện thoại</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Bảo mật cao</h3>
              <p>Dữ liệu gia đình được bảo vệ an toàn với hệ thống bảo mật tiên tiến</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Xuất báo cáo</h3>
              <p>Xuất dữ liệu gia phả ra file Excel, PDF để lưu trữ và chia sẻ</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Gói VIP</h3>
              <p>Nâng cấp lên gói VIP để sử dụng các tính năng cao cấp và không giới hạn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <div className="container">
          <h2 className="section-title">Gói dịch vụ</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Miễn phí</h3>
              <div className="price">0₫</div>
              <ul>
                <li>✅ Tạo tối đa 50 thành viên</li>
                <li>✅ 1 cây gia phả</li>
                <li>✅ Xuất Excel cơ bản</li>
                <li>❌ Không có hỗ trợ 24/7</li>
              </ul>
              <button 
                className="btn-outline"
                onClick={() => onNavigate('register')}
              >
                Bắt đầu miễn phí
              </button>
            </div>
            <div className="pricing-card featured">
              <div className="badge">Phổ biến</div>
              <h3>VIP Basic</h3>
              <div className="price">99,000₫<span>/tháng</span></div>
              <ul>
                <li>✅ Không giới hạn thành viên</li>
                <li>✅ Tối đa 5 cây gia phả</li>
                <li>✅ Xuất Excel nâng cao</li>
                <li>✅ Hỗ trợ email</li>
              </ul>
              <button 
                className="btn-primary"
                onClick={() => onNavigate('vip')}
              >
                Nâng cấp ngay
              </button>
            </div>
            <div className="pricing-card">
              <h3>VIP Premium</h3>
              <div className="price">199,000₫<span>/tháng</span></div>
              <ul>
                <li>✅ Không giới hạn thành viên</li>
                <li>✅ Không giới hạn cây gia phả</li>
                <li>✅ Xuất PDF, Excel nâng cao</li>
                <li>✅ Hỗ trợ 24/7</li>
              </ul>
              <button 
                className="btn-outline"
                onClick={() => onNavigate('vip')}
              >
                Nâng cấp ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Sẵn sàng bắt đầu hành trình tìm hiểu gia phả?</h2>
          <p>Tham gia cùng hàng nghìn gia đình đã tin tưởng sử dụng Gia Phả Việt</p>
          <button 
            className="btn-primary large"
            onClick={() => onNavigate('register')}
          >
            Tạo tài khoản miễn phí
          </button>
        </div>
      </section>
    </div>
  );
}