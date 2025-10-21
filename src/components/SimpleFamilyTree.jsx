import React, { useState, useEffect } from 'react';
import './SimpleFamilyTree.css';

const SimpleFamilyTree = ({ user, onNavigate }) => {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    birth: '',
    gender: 'male',
    parentId: '',
    spouseId: ''
  });

  // Dữ liệu mẫu đơn giản
  const sampleData = [
    { id: 1, name: 'Ông A', birth: '1950', gender: 'male', parentId: null, spouseId: 2 },
    { id: 2, name: 'Bà B', birth: '1955', gender: 'female', parentId: null, spouseId: 1 },
    { id: 3, name: 'Bố C', birth: '1980', gender: 'male', parentId: 1, spouseId: 4 },
    { id: 4, name: 'Mẹ D', birth: '1985', gender: 'female', parentId: null, spouseId: 3 },
    { id: 5, name: 'Con E', birth: '2010', gender: 'male', parentId: 3, spouseId: null }
  ];

  useEffect(() => {
    const userKey = `simple_tree_${user?.id || 'guest'}`;
    const saved = localStorage.getItem(userKey);
    if (saved) {
      setMembers(JSON.parse(saved));
    } else {
      setMembers(sampleData);
      localStorage.setItem(userKey, JSON.stringify(sampleData));
    }
  }, [user]);

  const saveData = (newMembers) => {
    const userKey = `simple_tree_${user?.id || 'guest'}`;
    localStorage.setItem(userKey, JSON.stringify(newMembers));
    setMembers(newMembers);
  };

  const getRootMembers = () => members.filter(m => !m.parentId);
  const getChildren = (parentId) => members.filter(m => m.parentId === parentId);
  const getSpouse = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member?.spouseId ? members.find(m => m.id === member.spouseId) : null;
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        birth: member.birth,
        gender: member.gender,
        parentId: member.parentId || '',
        spouseId: member.spouseId || ''
      });
    } else {
      setEditingMember(null);
      setFormData({ name: '', birth: '', gender: 'male', parentId: '', spouseId: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên!');
      return;
    }

    let newMembers;
    if (editingMember) {
      newMembers = members.map(m =>
        m.id === editingMember.id
          ? { ...m, ...formData, parentId: formData.parentId ? parseInt(formData.parentId) : null, spouseId: formData.spouseId ? parseInt(formData.spouseId) : null }
          : m
      );
    } else {
      const newMember = {
        id: Math.max(...members.map(m => m.id), 0) + 1,
        ...formData,
        parentId: formData.parentId ? parseInt(formData.parentId) : null,
        spouseId: formData.spouseId ? parseInt(formData.spouseId) : null
      };
      newMembers = [...members, newMember];
    }

    saveData(newMembers);
    closeModal();
    alert(editingMember ? 'Cập nhật thành công!' : 'Thêm thành công!');
  };

  const deleteMember = (id) => {
    if (window.confirm('Xóa thành viên này?')) {
      const newMembers = members.filter(m => m.id !== id);
      saveData(newMembers);
    }
  };

  const renderMember = (member) => {
    const spouse = getSpouse(member.id);
    const children = getChildren(member.id);

    return (
      <div key={member.id} className="member-container">
        <div className="member-card">
          <div className={`avatar ${member.gender}`}>
            {member.name.charAt(0)}
          </div>
          <h3>{member.name}</h3>
          <p>{member.birth}</p>
          <div className="actions">
            <button onClick={() => openModal(member)}>✏️</button>
            <button onClick={() => deleteMember(member.id)}>🗑️</button>
          </div>
        </div>

        {spouse && (
          <div className="spouse">
            <div className="connector">💕</div>
            <div className="member-card">
              <div className={`avatar ${spouse.gender}`}>
                {spouse.name.charAt(0)}
              </div>
              <h3>{spouse.name}</h3>
              <p>{spouse.birth}</p>
              <div className="actions">
                <button onClick={() => openModal(spouse)}>✏️</button>
                <button onClick={() => deleteMember(spouse.id)}>🗑️</button>
              </div>
            </div>
          </div>
        )}

        {children.length > 0 && (
          <div className="children">
            <div className="connector">👶</div>
            <div className="children-row">
              {children.map(child => renderMember(child))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="simple-family-tree">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('dashboard')}>
          ← Quay lại
        </button>
        <h1>🌳 Cây Gia Phả</h1>
        <button className="add-btn" onClick={() => openModal()}>
          ➕ Thêm thành viên
        </button>
      </div>

      <div className="tree-container">
        {getRootMembers().length === 0 ? (
          <div className="empty">
            <h2>Chưa có thành viên nào</h2>
            <button onClick={() => openModal()}>Thêm thành viên đầu tiên</button>
          </div>
        ) : (
          <div className="tree">
            {getRootMembers().map(member => renderMember(member))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingMember ? 'Sửa thành viên' : 'Thêm thành viên'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Năm sinh</label>
                <input
                  type="text"
                  value={formData.birth}
                  onChange={(e) => setFormData({...formData, birth: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Giới tính</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cha/Mẹ</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                >
                  <option value="">Chọn cha/mẹ</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Vợ/Chồng</label>
                <select
                  value={formData.spouseId}
                  onChange={(e) => setFormData({...formData, spouseId: e.target.value})}
                >
                  <option value="">Chọn vợ/chồng</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={closeModal}>Hủy</button>
                <button type="submit">{editingMember ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleFamilyTree;


