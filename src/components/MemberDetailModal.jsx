import React, { useState, useEffect } from 'react';
import './MemberDetailModal.css';

export default function MemberDetailModal({ member, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    birth: '',
    death: '',
    occupation: '',
    bio: '',
    avatarFile: null,
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        birth: member.birth || '',
        death: member.death || '',
        occupation: member.occupation || '',
        bio: member.bio || '',
        avatarFile: null,
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatarFile: e.target.files && e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let avatarData = member.avatar;
    if (formData.avatarFile) {
      avatarData = await fileToDataUrl(formData.avatarFile);
    }
    onSave({ ...member, ...formData, avatar: avatarData });
  };

  const fileToDataUrl = (f) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(f);
    });

  if (!member) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal member-detail-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Chi tiết thành viên: {member.name}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Tên</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />

          <label>Ngày sinh</label>
          <input type="text" name="birth" value={formData.birth} onChange={handleChange} placeholder="YYYY or full date" />

          <label>Ngày mất</label>
          <input type="text" name="death" value={formData.death} onChange={handleChange} placeholder="YYYY or full date" />

          <label>Nghề nghiệp</label>
          <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} />

          <label>Tiểu sử</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange}></textarea>

          <label>Ảnh đại diện (tùy chọn)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn primary">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
