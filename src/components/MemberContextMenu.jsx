import React from 'react';
import './MemberContextMenu.css';

export default function MemberContextMenu({ member, position, onClose, onAction }) {
  if (!member) return null;

  const handleAction = (actionType) => {
    onAction(actionType, member);
    onClose();
  };

  return (
    <div
      className="member-context-menu"
      style={{ top: position.y, left: position.x }}
      onMouseLeave={onClose} // Close when mouse leaves the menu
    >
      <div className="menu-item" onClick={() => handleAction('update')}>✏️ Cập nhật</div>
      <div className="menu-item" onClick={() => handleAction('viewBio')}>📚 Xem tiểu sử</div>
      <div className="menu-item" onClick={() => handleAction('addParent')}>➕ Thêm cha/mẹ</div>
      <div className="menu-item" onClick={() => handleAction('addSpouse')}>➕ Thêm vợ/chồng</div>
      <div className="menu-item" onClick={() => handleAction('addChild')}>➕ Thêm con</div>
      <div className="menu-item" onClick={() => handleAction('addComment')}>💬 Thêm bình luận</div>
      <div className="menu-item" onClick={() => handleAction('quickInfo')}>ℹ️ Xem thông tin nhanh</div>
      <div className="menu-item" onClick={() => handleAction('viewDescendants')}>👪 Xem danh sách con cháu</div>
      <div className="menu-item" onClick={() => handleAction('downloadExcel')}>⬇️ Tải xuống Excel nhân thân</div>
      <div className="menu-item danger" onClick={() => handleAction('delete')}>🗑 Xóa thành viên</div>
    </div>
  );
}
