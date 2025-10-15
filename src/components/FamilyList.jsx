import React, { useState } from "react";
import "./FamilyList.css";
export default function FamilyList({ onBackHome }) {
  const [families, setFamilies] = useState([
    {
      id: 1,
      name: "Gia phả họ Nguyễn",
      description:
        "Lưu giữ nguồn cội dòng họ Nguyễn - truyền thống hiếu học và đoàn kết.",
      creator: "Nguyễn Văn An",
      createdAt: "12/04/2024",
    },
    {
      id: 2,
      name: "Gia phả họ Trần",
      description:
        "Dòng họ Trần với lịch sử lâu đời, tôn vinh tổ tiên và phát triển con cháu.",
      creator: "Trần Văn Bình",
      createdAt: "05/06/2024",
    },
    {
      id: 3,
      name: "Gia phả họ Lê",
      description:
        "Kết nối các thành viên họ Lê trên toàn quốc, cùng gìn giữ truyền thống.",
      creator: "Lê Minh Hòa",
      createdAt: "22/07/2024",
    },
  ]);

  const [search, setSearch] = useState("");

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cây gia phả này?")) {
      setFamilies(families.filter((f) => f.id !== id));
    }
  };

  const filteredFamilies = families.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="family-wrapper">
      <div className="family-container">
        <header className="family-header">
          <h1>📜 Quản lý Cây Gia Phả</h1>
          <div className="toolbar">
            <button className="btn-create">+ Tạo cây mới</button>
            <input
              type="text"
              placeholder="🔍 Tìm kiếm gia phả..."
              className="search-box"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="family-list">
          {filteredFamilies.map((f) => (
            <div key={f.id} className="family-card">
              <div className="family-info">
                <h2>{f.name}</h2>
                <p>{f.description}</p>
                <p className="meta">
                  👤 {f.creator} &nbsp;|&nbsp; 📅 {f.createdAt}
                </p>
              </div>
              <div className="family-actions">
                <button className="btn-view">👁 Xem</button>
                <button className="btn-edit">✏️ Sửa</button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(f.id)}
                >
                  🗑 Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="footer-back">
          <button onClick={onBackHome} className="btn-back">
            ← Quay lại Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
