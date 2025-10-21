import React from 'react';
import './BannerCustomization.css';

export default function BannerCustomization() {
  return (
    <div className="banner-customization">
      <h4>Thay đổi banner</h4>
      <form className="banner-form">
        <label>Tên cây</label>
        <input type="text" placeholder="Gia đình Nguyễn Quang" />

        <label>Màu nền cây</label>
        <input type="color" />

        <label>Cấu trúc hiển thị</label>
        <div className="display-options">
          <label>Chiều rộng:</label><input type="number" defaultValue="800" />
          <label>Chiều cao:</label><input type="number" defaultValue="600" />
          <label>Căn giữa:</label><input type="checkbox" />
          <label>Hiển thị ảnh:</label><input type="checkbox" defaultChecked />
        </div>

        <label>Màu giới tính (nam – nữ)</label>
        <div className="gender-colors">
          <label>Nam:</label><input type="color" defaultValue="#007bff" />
          <label>Nữ:</label><input type="color" defaultValue="#ff69b4" />
        </div>

        <label>Màu khung, viền, font chữ</label>
        <div className="style-colors">
          <label>Khung:</label><input type="color" defaultValue="#cccccc" />
          <label>Viền:</label><input type="color" defaultValue="#999999" />
          <label>Font:</label><input type="color" defaultValue="#333333" />
        </div>

        <label>Chọn mẫu banner có sẵn</label>
        <select>
          <option>Mẫu 1</option>
          <option>Mẫu 2</option>
          <option>Mẫu 3</option>
        </select>

        <div className="form-actions">
          <button type="button" className="btn ghost">Bỏ qua</button>
          <button type="submit" className="btn primary">Ghi lại</button>
        </div>
      </form>
    </div>
  );
}
