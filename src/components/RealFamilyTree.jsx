import React, { useState, useEffect } from 'react';
import './RealFamilyTree.css';

const RealFamilyTree = ({ user, onNavigate }) => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuMember, setContextMenuMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [modalType, setModalType] = useState('add');

  const [formData, setFormData] = useState({
    name: '',
    birth: '',
    death: '',
    gender: 'male',
    occupation: '',
    bio: '',
    parentId: '',
    spouseId: '',
    avatar: null
  });

  // Dữ liệu mẫu đơn giản hơn
  const sampleData = [
    // Thế hệ 1 - Gốc gia đình
    { id: 1, name: 'Lê Thành Công', birth: '1900', death: '', gender: 'male', occupation: 'Nông dân', bio: 'Người đứng đầu gia đình', parentId: null, spouseId: 2, avatar: null },
    { id: 2, name: 'Nguyễn Hạnh Phúc', birth: '1905', death: '', gender: 'female', occupation: 'Nội trợ', bio: 'Vợ của Lê Thành Công', parentId: null, spouseId: 1, avatar: null },
    
    // Thế hệ 2 - Con của thế hệ 1
    { id: 3, name: 'Lê Đại Gia', birth: '1930', death: '', gender: 'male', occupation: 'Thương gia', bio: 'Con trai cả', parentId: 1, spouseId: 4, avatar: null },
    { id: 4, name: 'Nguyễn Thị Giàu', birth: '1935', death: '', gender: 'female', occupation: 'Nội trợ', bio: 'Vợ của Lê Đại Gia', parentId: null, spouseId: 3, avatar: null },
    { id: 5, name: 'Phạm Thị Sang', birth: '1932', death: '', gender: 'female', occupation: 'Giáo viên', bio: 'Con gái thứ hai', parentId: 1, spouseId: 6, avatar: null },
    { id: 6, name: 'Lê Thị Phú', birth: '1938', death: '', gender: 'female', occupation: 'Y tá', bio: 'Vợ của Phạm Thị Sang', parentId: null, spouseId: 5, avatar: null },
    { id: 7, name: 'Phạm Văn Quý', birth: '1935', death: '', gender: 'male', occupation: 'Kỹ sư', bio: 'Con trai thứ ba', parentId: 1, spouseId: 8, avatar: null },
    { id: 8, name: 'Lê Văn', birth: '1940', death: '', gender: 'male', occupation: 'Bác sĩ', bio: 'Vợ của Phạm Văn Quý', parentId: null, spouseId: 7, avatar: null },
    
    // Thế hệ 3 - Cháu của thế hệ 1
    { id: 9, name: 'Lê Văn Nhất', birth: '1960', death: '', gender: 'male', occupation: 'Doanh nhân', bio: 'Con trai của Lê Đại Gia', parentId: 3, spouseId: 10, avatar: null },
    { id: 10, name: 'Nguyễn Thị Định', birth: '1965', death: '', gender: 'female', occupation: 'Bác sĩ', bio: 'Vợ của Lê Văn Nhất', parentId: null, spouseId: 9, avatar: null },
    { id: 11, name: 'Lê Văn Thắng', birth: '1962', death: '', gender: 'male', occupation: 'Kỹ sư', bio: 'Con trai của Phạm Thị Sang', parentId: 5, spouseId: null, avatar: null },
    { id: 12, name: 'Trần Văn A', birth: '1970', death: '', gender: 'male', occupation: 'Lập trình viên', bio: 'Con trai của Phạm Văn Quý', parentId: 7, spouseId: null, avatar: null },
    
    // Thế hệ 4 - Chắt của thế hệ 1
    { id: 13, name: 'Lê Văn X', birth: '1990', death: '', gender: 'male', occupation: 'Sinh viên', bio: 'Con trai của Lê Văn Nhất', parentId: 9, spouseId: null, avatar: null },
    { id: 14, name: 'Lê Như Ha', birth: '1992', death: '', gender: 'female', occupation: 'Sinh viên', bio: 'Con gái của Lê Văn Nhất', parentId: 9, spouseId: null, avatar: null },
    { id: 15, name: 'Trần Lê Biển', birth: '1995', death: '', gender: 'female', occupation: 'Học sinh', bio: 'Con gái của Trần Văn A', parentId: 12, spouseId: null, avatar: null }
  ];

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const userKey = `real_tree_${user?.id || 'guest'}`;
    const savedData = localStorage.getItem(userKey);
    
    if (savedData) {
      setMembers(JSON.parse(savedData));
    } else {
      setMembers(sampleData);
      localStorage.setItem(userKey, JSON.stringify(sampleData));
    }
  };

  const saveData = (newMembers) => {
    const userKey = `real_tree_${user?.id || 'guest'}`;
    localStorage.setItem(userKey, JSON.stringify(newMembers));
    setMembers(newMembers);
  };

  const generateId = () => {
    return Math.max(...members.map(m => m.id), 0) + 1;
  };

  const getMemberById = (id) => {
    return members.find(m => m.id === id);
  };

  const getChildren = (parentId) => {
    return members.filter(m => m.parentId === parentId);
  };

  const getSpouse = (memberId) => {
    const member = getMemberById(memberId);
    if (member && member.spouseId) {
      return getMemberById(member.spouseId);
    }
    return null;
  };

  const getRootMembers = () => {
    return members.filter(m => !m.parentId);
  };

  // Context menu handlers
  const handleContextMenu = (e, member) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuMember(member);
    setShowContextMenu(true);
  };

  const closeContextMenu = () => {
    setShowContextMenu(false);
    setContextMenuMember(null);
  };

  const handleContextAction = (action, member) => {
    closeContextMenu();
    
    switch (action) {
      case 'edit':
        openModal('edit', member);
        break;
      case 'view':
        openModal('view', member);
        break;
      case 'delete':
        deleteMember(member.id);
        break;
      case 'addChild':
        openModal('addChild', member);
        break;
      case 'addSpouse':
        openModal('addSpouse', member);
        break;
      default:
        break;
    }
  };

  // Modal handlers
  const openModal = (type, member = null) => {
    setModalType(type);
    setEditingMember(member);
    
    if (member) {
      setFormData({
        name: member.name,
        birth: member.birth,
        death: member.death,
        gender: member.gender,
        occupation: member.occupation,
        bio: member.bio,
        parentId: member.parentId || '',
        spouseId: member.spouseId || '',
        avatar: member.avatar
      });
    } else {
      setFormData({
        name: '',
        birth: '',
        death: '',
        gender: 'male',
        occupation: '',
        bio: '',
        parentId: '',
        spouseId: '',
        avatar: null
      });
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên thành viên!');
      return;
    }

    let newMembers;
    
    if (modalType === 'edit') {
      newMembers = members.map(member =>
        member.id === editingMember.id
          ? {
              ...member,
              ...formData,
              parentId: formData.parentId ? parseInt(formData.parentId) : null,
              spouseId: formData.spouseId ? parseInt(formData.spouseId) : null
            }
          : member
      );
    } else {
      const newMember = {
        id: generateId(),
        ...formData,
        parentId: modalType === 'addChild' ? editingMember.id : (formData.parentId ? parseInt(formData.parentId) : null),
        spouseId: modalType === 'addSpouse' ? editingMember.id : (formData.spouseId ? parseInt(formData.spouseId) : null)
      };
      newMembers = [...members, newMember];
      
      if (modalType === 'addSpouse') {
        newMembers = newMembers.map(member =>
          member.id === editingMember.id
            ? { ...member, spouseId: newMember.id }
            : member
        );
      }
    }

    saveData(newMembers);
    closeModal();
    
    const messages = {
      edit: 'Cập nhật thành viên thành công!',
      add: 'Thêm thành viên thành công!',
      addChild: 'Thêm con thành công!',
      addSpouse: 'Thêm vợ/chồng thành công!'
    };
    
    alert(messages[modalType] || 'Thao tác thành công!');
  };

  const deleteMember = (memberId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      const newMembers = members.filter(m => m.id !== memberId);
      saveData(newMembers);
      alert('Xóa thành viên thành công!');
    }
  };

  // Render member card
  const renderMemberCard = (member) => {
    return (
      <div key={member.id} className="member-card">
        <div 
          className="member-content"
          onContextMenu={(e) => handleContextMenu(e, member)}
          onClick={() => setSelectedMember(member)}
        >
          <div className="member-avatar">
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} />
            ) : (
              <div className={`avatar-placeholder ${member.gender}`}>
                {member.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="member-info">
            <h3 className="member-name">{member.name}</h3>
            <p className="member-birth">{member.birth}</p>
            {member.occupation && (
              <p className="member-occupation">{member.occupation}</p>
            )}
          </div>
        </div>

        <div className="member-actions">
          <button 
            className="action-btn edit-btn"
            onClick={() => openModal('edit', member)}
            title="Chỉnh sửa"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => deleteMember(member.id)}
            title="Xóa"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  };

  // Render family tree với layout thực sự
  const renderFamilyTree = () => {
    const rootMembers = getRootMembers();
    
    if (rootMembers.length === 0) {
      return (
        <div className="empty-tree">
          <div className="empty-icon">🌳</div>
          <h3>Chưa có cây gia phả</h3>
          <p>Hãy thêm thành viên đầu tiên để bắt đầu!</p>
          <button className="btn-primary" onClick={() => openModal('add')}>
            ➕ Thêm thành viên đầu tiên
          </button>
        </div>
      );
    }

    return (
      <div className="family-tree-container">
        {/* Thế hệ 1 - Gốc gia đình */}
        <div className="generation generation-1">
          <div className="generation-title">Thế hệ 1 - Gốc gia đình</div>
          <div className="generation-members">
            {rootMembers.map(rootMember => {
              const spouse = getSpouse(rootMember.id);
              return (
                <div key={rootMember.id} className="couple-container">
                  {renderMemberCard(rootMember)}
                  {spouse && (
                    <>
                      <div className="spouse-connector">💕</div>
                      {renderMemberCard(spouse)}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Thế hệ 2 - Con của thế hệ 1 */}
        <div className="generation generation-2">
          <div className="generation-title">Thế hệ 2 - Con cái</div>
          <div className="generation-members">
            {rootMembers.map(rootMember => {
              const children = getChildren(rootMember.id);
              return children.map(child => {
                const spouse = getSpouse(child.id);
                return (
                  <div key={child.id} className="couple-container">
                    {renderMemberCard(child)}
                    {spouse && (
                      <>
                        <div className="spouse-connector">💕</div>
                        {renderMemberCard(spouse)}
                      </>
                    )}
                  </div>
                );
              });
            })}
          </div>
        </div>

        {/* Thế hệ 3 - Cháu của thế hệ 1 */}
        <div className="generation generation-3">
          <div className="generation-title">Thế hệ 3 - Cháu</div>
          <div className="generation-members">
            {rootMembers.map(rootMember => {
              const children = getChildren(rootMember.id);
              return children.map(child => {
                const grandchildren = getChildren(child.id);
                return grandchildren.map(grandchild => {
                  const spouse = getSpouse(grandchild.id);
                  return (
                    <div key={grandchild.id} className="couple-container">
                      {renderMemberCard(grandchild)}
                      {spouse && (
                        <>
                          <div className="spouse-connector">💕</div>
                          {renderMemberCard(spouse)}
                        </>
                      )}
                    </div>
                  );
                });
              });
            })}
          </div>
        </div>

        {/* Thế hệ 4 - Chắt của thế hệ 1 */}
        <div className="generation generation-4">
          <div className="generation-title">Thế hệ 4 - Chắt</div>
          <div className="generation-members">
            {rootMembers.map(rootMember => {
              const children = getChildren(rootMember.id);
              return children.map(child => {
                const grandchildren = getChildren(child.id);
                return grandchildren.map(grandchild => {
                  const greatGrandchildren = getChildren(grandchild.id);
                  return greatGrandchildren.map(greatGrandchild => {
                    const spouse = getSpouse(greatGrandchild.id);
                    return (
                      <div key={greatGrandchild.id} className="couple-container">
                        {renderMemberCard(greatGrandchild)}
                        {spouse && (
                          <>
                            <div className="spouse-connector">💕</div>
                            {renderMemberCard(spouse)}
                          </>
                        )}
                      </div>
                    );
                  });
                });
              });
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="real-family-tree">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <button className="btn-back" onClick={() => onNavigate('dashboard')}>
            ← Quay lại Dashboard
          </button>
          <h1>🌳 Cây Gia Phả Thực</h1>
        </div>
        
        <div className="header-right">
          <div className="header-actions">
            <button className="btn-primary" onClick={() => openModal('add')}>
              ➕ Thêm thành viên
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {renderFamilyTree()}
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div 
          className="context-menu"
          style={{
            position: 'fixed',
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            zIndex: 10000
          }}
        >
          <div className="context-menu-item" onClick={() => handleContextAction('edit', contextMenuMember)}>
            <span className="context-icon">✏️</span>
            <span>Sửa</span>
          </div>
          <div className="context-menu-item" onClick={() => handleContextAction('view', contextMenuMember)}>
            <span className="context-icon">👁️</span>
            <span>Xem tiểu sử</span>
          </div>
          <div className="context-menu-item" onClick={() => handleContextAction('delete', contextMenuMember)}>
            <span className="context-icon">🗑️</span>
            <span>Xóa</span>
          </div>
          <div className="context-menu-item" onClick={() => handleContextAction('addChild', contextMenuMember)}>
            <span className="context-icon">➕</span>
            <span>Thêm con</span>
          </div>
          <div className="context-menu-item" onClick={() => handleContextAction('addSpouse', contextMenuMember)}>
            <span className="context-icon">💕</span>
            <span>Thêm Vợ/Chồng</span>
          </div>
          <div className="context-menu-item" onClick={closeContextMenu}>
            <span className="context-icon">❌</span>
            <span>Thoát</span>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === 'edit' && 'Chỉnh sửa thành viên'}
                {modalType === 'view' && 'Xem tiểu sử'}
                {modalType === 'add' && 'Thêm thành viên mới'}
                {modalType === 'addChild' && 'Thêm con'}
                {modalType === 'addSpouse' && 'Thêm vợ/chồng'}
              </h2>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            
            {modalType === 'view' ? (
              <div className="view-content">
                <div className="member-detail">
                  <div className="detail-avatar">
                    {editingMember.avatar ? (
                      <img src={editingMember.avatar} alt={editingMember.name} />
                    ) : (
                      <div className={`avatar-placeholder ${editingMember.gender}`}>
                        {editingMember.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3>{editingMember.name}</h3>
                  <div className="detail-info">
                    <p><strong>Năm sinh:</strong> {editingMember.birth || 'Chưa rõ'}</p>
                    <p><strong>Năm mất:</strong> {editingMember.death || 'Chưa rõ'}</p>
                    <p><strong>Giới tính:</strong> {editingMember.gender === 'male' ? 'Nam' : 'Nữ'}</p>
                    <p><strong>Nghề nghiệp:</strong> {editingMember.occupation || 'Chưa rõ'}</p>
                    <p><strong>Vợ/Chồng:</strong> {getSpouse(editingMember.id)?.name || 'Chưa có'}</p>
                    <p><strong>Cha/Mẹ:</strong> {editingMember.parentId ? getMemberById(editingMember.parentId)?.name : 'Gốc gia đình'}</p>
                    {editingMember.bio && (
                      <div className="bio-section">
                        <strong>Tiểu sử:</strong>
                        <p>{editingMember.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Tên *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên thành viên"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Năm sinh</label>
                    <input
                      type="text"
                      name="birth"
                      value={formData.birth}
                      onChange={handleInputChange}
                      placeholder="YYYY"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Năm mất</label>
                    <input
                      type="text"
                      name="death"
                      value={formData.death}
                      onChange={handleInputChange}
                      placeholder="YYYY"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Giới tính</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Nghề nghiệp</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      placeholder="Nghề nghiệp"
                    />
                  </div>
                </div>

                {modalType === 'add' && (
                  <>
                    <div className="form-group">
                      <label>Cha/Mẹ</label>
                      <select
                        name="parentId"
                        value={formData.parentId}
                        onChange={handleInputChange}
                      >
                        <option value="">Chọn cha/mẹ (để trống nếu là gốc gia đình)</option>
                        {members.map(member => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Vợ/Chồng</label>
                      <select
                        name="spouseId"
                        value={formData.spouseId}
                        onChange={handleInputChange}
                      >
                        <option value="">Chọn vợ/chồng (để trống nếu chưa có)</option>
                        {members.map(member => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Tiểu sử</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tiểu sử, ghi chú..."
                    rows="3"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={closeModal}>
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    {modalType === 'edit' ? 'Cập nhật' : 'Thêm'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close context menu */}
      {showContextMenu && (
        <div 
          className="context-menu-overlay" 
          onClick={closeContextMenu}
        />
      )}
    </div>
  );
};

export default RealFamilyTree;


