import React, { useState, useEffect } from 'react';
import './MemberList.css';
import { loadDataInFormat, saveDataInBothFormats, getUserKey } from '../utils/dataSync';

export default function MemberList({ user, onNavigate }) {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    birth: '',
    death: '',
    occupation: '',
    bio: '',
    gender: 'male',
    relationship: 'child'
  });

  // Sample data for demo
  const sampleMembers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      birth: '1950',
      death: '',
      occupation: 'Nông dân',
      bio: 'Người đứng đầu gia đình, có công lao lớn trong việc xây dựng gia đình',
      gender: 'male',
      relationship: 'root',
      avatar: null
    },
    {
      id: 2,
      name: 'Trần Thị B',
      birth: '1952',
      death: '',
      occupation: 'Nội trợ',
      bio: 'Vợ của Nguyễn Văn A, người phụ nữ đảm đang của gia đình',
      gender: 'female',
      relationship: 'spouse',
      avatar: null
    },
    {
      id: 3,
      name: 'Nguyễn Văn C',
      birth: '1975',
      death: '',
      occupation: 'Kỹ sư',
      bio: 'Con trai cả, hiện đang làm việc tại thành phố',
      gender: 'male',
      relationship: 'child',
      avatar: null
    },
    {
      id: 4,
      name: 'Nguyễn Thị D',
      birth: '1978',
      death: '',
      occupation: 'Giáo viên',
      bio: 'Con gái, hiện đang dạy học tại địa phương',
      gender: 'female',
      relationship: 'child',
      avatar: null
    }
  ];

  useEffect(() => {
    // Load members from localStorage or use sample data
    const savedMembers = loadDataInFormat(user, 'memberlist');
    
    if (savedMembers.length === 0) {
      setMembers(sampleMembers);
      saveDataInBothFormats(sampleMembers, user);
    } else {
      setMembers(savedMembers);
    }
  }, [user]);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.occupation.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'male') return matchesSearch && member.gender === 'male';
    if (filterBy === 'female') return matchesSearch && member.gender === 'female';
    if (filterBy === 'alive') return matchesSearch && !member.death;
    if (filterBy === 'deceased') return matchesSearch && member.death;
    
    return matchesSearch;
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'birth':
        return parseInt(a.birth) - parseInt(b.birth);
      case 'relationship':
        return a.relationship.localeCompare(b.relationship);
      default:
        return 0;
    }
  });

  const handleAddMember = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      birth: '',
      death: '',
      occupation: '',
      bio: '',
      gender: 'male',
      relationship: 'child'
    });
    setShowAddModal(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setFormData(member);
    setShowAddModal(true);
  };

  const handleSaveMember = () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên thành viên');
      return;
    }

    const updatedMembers = editingMember 
      ? members.map(m => m.id === editingMember.id ? { ...formData, id: editingMember.id } : m)
      : [...members, { ...formData, id: Date.now() }];

    setMembers(updatedMembers);
    saveDataInBothFormats(updatedMembers, user);
    setShowAddModal(false);
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      const updatedMembers = members.filter(m => m.id !== memberId);
      setMembers(updatedMembers);
      saveDataInBothFormats(updatedMembers, user);
    }
  };

  const handleInlineEdit = (memberId, field, value) => {
    const updatedMembers = members.map(member => 
      member.id === memberId 
        ? { ...member, [field]: value }
        : member
    );
    setMembers(updatedMembers);
    const userKey = `members_${user?.id || 'guest'}`;
    localStorage.setItem(userKey, JSON.stringify(updatedMembers));
  };

  const exportToExcel = () => {
    // Simple CSV export (in real app, you'd use a library like xlsx)
    const csvContent = [
      ['Tên', 'Năm sinh', 'Năm mất', 'Nghề nghiệp', 'Giới tính', 'Mối quan hệ'],
      ...sortedMembers.map(member => [
        member.name,
        member.birth,
        member.death,
        member.occupation,
        member.gender === 'male' ? 'Nam' : 'Nữ',
        member.relationship
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'danh_sach_thanh_vien.csv';
    link.click();
  };

  return (
    <div className="member-list">
      <div className="member-list-header">
        <h1>Danh sách thành viên</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={exportToExcel}>
            📊 Xuất Excel
          </button>
          <button className="btn-primary" onClick={handleAddMember}>
            + Thêm thành viên
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc nghề nghiệp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="alive">Còn sống</option>
            <option value="deceased">Đã mất</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Sắp xếp theo tên</option>
            <option value="birth">Sắp xếp theo năm sinh</option>
            <option value="relationship">Sắp xếp theo mối quan hệ</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="members-table-container">
        {sortedMembers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>Không tìm thấy thành viên nào</h3>
            <p>Thử thay đổi bộ lọc hoặc thêm thành viên mới</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Năm sinh</th>
                  <th>Năm mất</th>
                  <th>Giới tính</th>
                  <th>Nghề nghiệp</th>
                  <th>Mối quan hệ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map(member => (
                  <tr key={member.id} className="member-row">
                    <td className="avatar-cell">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="table-avatar" />
                      ) : (
                        <div className={`table-avatar-placeholder ${member.gender}`}>
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="name-cell">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleInlineEdit(member.id, 'name', e.target.value)}
                        className="inline-input"
                      />
                    </td>
                    <td className="birth-cell">
                      <input
                        type="text"
                        value={member.birth || ''}
                        onChange={(e) => handleInlineEdit(member.id, 'birth', e.target.value)}
                        className="inline-input"
                        placeholder="YYYY"
                      />
                    </td>
                    <td className="death-cell">
                      <input
                        type="text"
                        value={member.death || ''}
                        onChange={(e) => handleInlineEdit(member.id, 'death', e.target.value)}
                        className="inline-input"
                        placeholder="YYYY"
                      />
                    </td>
                    <td className="gender-cell">
                      <select
                        value={member.gender}
                        onChange={(e) => handleInlineEdit(member.id, 'gender', e.target.value)}
                        className="inline-select"
                      >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                      </select>
                    </td>
                    <td className="occupation-cell">
                      <input
                        type="text"
                        value={member.occupation || ''}
                        onChange={(e) => handleInlineEdit(member.id, 'occupation', e.target.value)}
                        className="inline-input"
                        placeholder="Nghề nghiệp"
                      />
                    </td>
                    <td className="relationship-cell">
                      <select
                        value={member.relationship}
                        onChange={(e) => handleInlineEdit(member.id, 'relationship', e.target.value)}
                        className="inline-select"
                      >
                        <option value="root">Gốc gia đình</option>
                        <option value="spouse">Vợ/Chồng</option>
                        <option value="child">Con</option>
                        <option value="parent">Cha/Mẹ</option>
                        <option value="sibling">Anh/Chị/Em</option>
                      </select>
                    </td>
                    <td className="actions-cell">
                      <div className="table-actions">
                        <button 
                          className="btn-icon"
                          onClick={() => handleEditMember(member)}
                          title="Chỉnh sửa chi tiết"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon danger"
                          onClick={() => handleDeleteMember(member.id)}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingMember ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSaveMember(); }}>
              <div className="form-group">
                <label>Tên thành viên *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Năm sinh</label>
                  <input
                    type="text"
                    value={formData.birth}
                    onChange={(e) => setFormData({...formData, birth: e.target.value})}
                    placeholder="VD: 1950"
                  />
                </div>
                
                <div className="form-group">
                  <label>Năm mất</label>
                  <input
                    type="text"
                    value={formData.death}
                    onChange={(e) => setFormData({...formData, death: e.target.value})}
                    placeholder="VD: 2020"
                  />
                </div>
              </div>
              
              <div className="form-row">
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
                  <label>Mối quan hệ</label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                  >
                    <option value="root">Gốc gia đình</option>
                    <option value="spouse">Vợ/Chồng</option>
                    <option value="child">Con</option>
                    <option value="parent">Cha/Mẹ</option>
                    <option value="sibling">Anh/Chị/Em</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Nghề nghiệp</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                  placeholder="VD: Nông dân, Kỹ sư, Giáo viên..."
                />
              </div>
              
              <div className="form-group">
                <label>Tiểu sử</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Viết về cuộc đời, công lao của thành viên..."
                  rows="4"
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingMember ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
