import React, { useState, useEffect } from "react";
import "./Home.css";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-page">
      {/* ===== Navbar ===== */}
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <span className="logo-highlight">GiaPhả</span> Online
          </div>

          <nav className="navbar-links">
            <a href="#">Trang Chủ</a>
            <a href="#">Giới Thiệu</a>
            <a href="#">Thành Viên</a>
            <a href="#">Liên hệ</a>
            <a href="#">Mẫu Cây</a>
            <a href="#">Tạo Cây</a>
            <a href="#">Gói VIP</a>
           
          </nav>

          <div className="navbar-actions">
            <button className="btn-login">Đăng nhập</button>
            <button className="btn-register">Đăng ký</button>
          </div>
        </div>
      </header>

      {/* ===== Hero Section ===== */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Gia Phả Trực Tuyến</h1>
          <p>Kết nối – Ghi nhớ – Lưu truyền thế hệ con cháu</p>
          <button className="hero-btn">Khám phá ngay</button>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="features-section">
      <h2>🌟 Chức năng nổi bật</h2>
      <div className="features">
        <div className="feature-card">
          <i className="fas fa-users"></i>
          <h3>🧭 Quản lý thành viên</h3>
          <p>Dễ dàng thêm, sửa, xóa và xem chi tiết từng thành viên trong gia phả.</p>
        </div>

        <div className="feature-card">
          <i className="fas fa-medal"></i>
          <h3>🏅 Ghi nhớ công lao</h3>
          <p>Tôn vinh công lao tổ tiên, lưu giữ những dấu ấn đáng nhớ của dòng tộc.</p>
        </div>

        <div className="feature-card">
          <i className="fas fa-sitemap"></i>
          <h3>🌳 Cây gia phả trực quan</h3>
          <p>Hiển thị quan hệ họ hàng rõ ràng, sinh động và dễ hiểu dưới dạng cây.</p>
        </div>

        <div className="feature-card">
          <i className="fas fa-infinity"></i>
          <h3>💎 Không giới hạn sáng tạo</h3>
          <p>Tự do xây dựng và mở rộng cây gia phả theo phong cách riêng của bạn.</p>
        </div>

        <div className="feature-card">
          <i className="fas fa-shield-alt"></i>
          <h3>🔒 Bảo mật tuyệt đối</h3>
          <p>Dữ liệu được mã hóa và lưu trữ an toàn, chỉ người có quyền mới truy cập được.</p>
        </div>

        <div className="feature-card">
          <i className="fas fa-camera-retro"></i>
          <h3>📸 Hình ảnh & kỷ vật</h3>
          <p>Lưu giữ hình ảnh, kỷ vật và câu chuyện của từng thế hệ trong dòng họ.</p>
        </div>

        <div className="feature-card">
          <i className="fas fa-history"></i>
          <h3>🕰️ Lịch sử & mốc thời gian</h3>
          <p>Theo dõi các sự kiện quan trọng qua từng đời, kết nối quá khứ và hiện tại.</p>
        </div>

        <div className="feature-card">
          <i className="fas fa-globe"></i>
          <h3>🌏 Kết nối họ hàng toàn cầu</h3>
          <p>Cùng họ hàng khắp nơi xây dựng và mở rộng cây gia phả chung của dòng tộc.</p>
        </div>
      </div>
    </section>


      {/* ===== Footer ===== */}
      <footer className="footer">
        <p>© 2025 Gia Phả Trực Tuyến | Thiết kế bởi Văn Thuần</p>
      </footer>
    </div>
  );
}
