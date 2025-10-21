import React, { useState, useEffect } from 'react';
import './AdvancedFamilyTree.css';

const AdvancedFamilyTree = ({ user, onNavigate }) => {
  // States
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuMember, setContextMenuMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view', 'addChild', 'addSpouse'
  const [isLoading, setIsLoading] = useState(false);

  // Form data
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

  // Sample data với nhiều thế hệ
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
    { id: 9, name: 'Nguyễn Hoa', birth: '1942', death: '', gender: 'female', occupation: 'Nghệ sĩ', bio: 'Con gái út', parentId: 1, spouseId: null, avatar: null },
    { id: 10, name: 'Lê Ánh Kim', birth: '1945', death: '', gender: 'female', occupation: 'Luật sư', bio: 'Con gái thứ tư', parentId: 1, spouseId: 11, avatar: null },
    { id: 11, name: 'Nguyễn Ánh Vàng', birth: '1950', death: '', gender: 'male', occupation: 'Kiến trúc sư', bio: 'Vợ của Lê Ánh Kim', parentId: null, spouseId: 10, avatar: null },
    
    // Thế hệ 3 - Cháu của thế hệ 1
    { id: 12, name: 'Lê Văn Nhất', birth: '1960', death: '', gender: 'male', occupation: 'Doanh nhân', bio: 'Con trai của Lê Đại Gia', parentId: 3, spouseId: 13, avatar: null },
    { id: 13, name: 'Nguyễn Thị Định', birth: '1965', death: '', gender: 'female', occupation: 'Bác sĩ', bio: 'Vợ của Lê Văn Nhất', parentId: null, spouseId: 12, avatar: null },
    { id: 14, name: 'Lê Văn Thắng', birth: '1962', death: '', gender: 'male', occupation: 'Kỹ sư', bio: 'Con trai của Phạm Thị Sang', parentId: 5, spouseId: null, avatar: null },
    { id: 15, name: 'Phạm Thị Lợi', birth: '1968', death: '', gender: 'female', occupation: 'Giáo viên', bio: 'Con gái của Phạm Thị Sang', parentId: 5, spouseId: null, avatar: null },
    { id: 16, name: 'Trần Văn A', birth: '1970', death: '', gender: 'male', occupation: 'Lập trình viên', bio: 'Con trai của Phạm Văn Quý', parentId: 7, spouseId: null, avatar: null },
    { id: 17, name: 'Nguyễn Văn Sự', birth: '1975', death: '', gender: 'male', occupation: 'Nhà báo', bio: 'Con trai của Lê Ánh Kim', parentId: 10, spouseId: null, avatar: null },
    
    // Thế hệ 4 - Chắt của thế hệ 1
    { id: 18, name: 'Lê Văn X', birth: '1990', death: '', gender: 'male', occupation: 'Sinh viên', bio: 'Con trai của Lê Văn Nhất', parentId: 12, spouseId: null, avatar: null },
    { id: 19, name: 'Lê Như Ha', birth: '1992', death: '', gender: 'female', occupation: 'Sinh viên', bio: 'Con gái của Lê Văn Nhất', parentId: 12, spouseId: null, avatar: null },
    { id: 20, name: 'Trần Lê Biển', birth: '1995', death: '', gender: 'female', occupation: 'Học sinh', bio: 'Con gái của Trần Văn A', parentId: 16, spouseId: null, avatar: null },
    { id: 21, name: 'Nguyễn Văn Thế', birth: '1998', death: '', gender: 'male', occupation: 'Học sinh', bio: 'Con trai của Trần Văn A', parentId: 16, spouseId: null, avatar: null }
  ];

  // Load data
  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    setIsLoading(true);
    const userKey = `advanced_tree_${user?.id || 'guest'}`;
    const savedData = localStorage.getItem(userKey);
    
    if (savedData) {
      setMembers(JSON.parse(savedData));
    } else {
      setMembers(sampleData);
      localStorage.setItem(userKey, JSON.stringify(sampleData));
    }
    setIsLoading(false);
  };

  const saveData = (newMembers) => {
    const userKey = `advanced_tree_${user?.id || 'guest'}`;
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

  const getDescendants = (memberId) => {
    const children = getChildren(memberId);
    let descendants = [...children];
    
    children.forEach(child => {
      descendants = [...descendants, ...getDescendants(child.id)];
    });
    
    return descendants;
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
      case 'move':
        alert('Chức năng di chuyển đang được phát triển');
        break;
      case 'addChild':
        openModal('addChild', member);
        break;
      case 'addSpouse':
        openModal('addSpouse', member);
        break;
      case 'browseBranch':
        browseBranch(member.id);
        break;
      default:
        break;
    }
  };

  const browseBranch = (memberId) => {
    const descendants = getDescendants(memberId);
    const member = getMemberById(memberId);
    const spouse = getSpouse(memberId);
    
    const branchMembers = [member, ...(spouse ? [spouse] : []), ...descendants];
    setMembers(branchMembers);
    alert(`Đang hiển thị nhánh của ${member.name} (${branchMembers.length} thành viên)`);
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
      
      // Nếu thêm vợ/chồng, cập nhật lại spouseId cho thành viên hiện tại
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
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này và tất cả con cháu?')) {
      const descendants = getDescendants(memberId);
      const member = getMemberById(memberId);
      const spouse = getSpouse(memberId);
      
      const idsToDelete = [memberId, ...descendants.map(d => d.id)];
      if (spouse) idsToDelete.push(spouse.id);
      
      const newMembers = members.filter(m => !idsToDelete.includes(m.id));
      saveData(newMembers);
      alert('Xóa thành viên thành công!');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Tên', 'Năm sinh', 'Năm mất', 'Giới tính', 'Nghề nghiệp', 'Mối quan hệ', 'Vợ/Chồng', 'Cha/Mẹ'],
      ...members.map(member => [
        member.name,
        member.birth,
        member.death,
        member.gender === 'male' ? 'Nam' : 'Nữ',
        member.occupation,
        member.parentId ? 'Con' : 'Gốc gia đình',
        member.spouseId ? getMemberById(member.spouseId)?.name || '' : '',
        member.parentId ? getMemberById(member.parentId)?.name || '' : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'family_tree.csv';
    link.click();
  };

  // Render member card
  const renderMemberCard = (member) => {
    const spouse = getSpouse(member.id);
    const children = getChildren(member.id);
    
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

  // Render family tree
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
      <div className="family-tree">
        {rootMembers.map(rootMember => (
          <div key={rootMember.id} className="tree-branch">
            {renderMemberCard(rootMember)}
            
            {/* Render spouse */}
            {getSpouse(rootMember.id) && (
              <div className="spouse-section">
                <div className="spouse-connector">💕</div>
                {renderMemberCard(getSpouse(rootMember.id))}
              </div>
            )}
            
            {/* Render children */}
            {getChildren(rootMember.id).length > 0 && (
              <div className="children-section">
                <div className="children-connector">👶</div>
                <div className="children-grid">
                  {getChildren(rootMember.id).map(child => (
                    <div key={child.id} className="child-member">
                      {renderMemberCard(child)}
                      
                      {/* Render child's spouse */}
                      {getSpouse(child.id) && (
                        <div className="child-spouse">
                          <div className="spouse-connector">💕</div>
                          {renderMemberCard(getSpouse(child.id))}
                        </div>
                      )}
                      
                      {/* Render grandchildren */}
                      {getChildren(child.id).length > 0 && (
                        <div className="grandchildren-section">
                          <div className="grandchildren-connector">👶</div>
                          <div className="grandchildren-grid">
                            {getChildren(child.id).map(grandchild => (
                              <div key={grandchild.id} className="grandchild-member">
                                {renderMemberCard(grandchild)}
                                
                                {/* Render great-grandchildren */}
                                {getChildren(grandchild.id).length > 0 && (
                                  <div className="great-grandchildren-section">
                                    <div className="great-grandchildren-connector">👶</div>
                                    <div className="great-grandchildren-grid">
                                      {getChildren(grandchild.id).map(greatGrandchild => 
                                        renderMemberCard(greatGrandchild)
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="advanced-family-tree">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <button className="btn-back" onClick={() => onNavigate('dashboard')}>
            ← Quay lại Dashboard
          </button>
          <h1>🌳 Cây Gia Phả Nâng Cao</h1>
        </div>
        
        <div className="header-right">
          <div className="header-actions">
            <button className="btn-secondary" onClick={exportToCSV}>
              📊 Xuất CSV
            </button>
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
          <div className="context-menu-item" onClick={() => handleContextAction('move', contextMenuMember)}>
            <span className="context-icon">↔️</span>
            <span>Di chuyển</span>
          </div>
          <div className="context-menu-item" onClick={() => handleContextAction('addChild', contextMenuMember)}>
            <span className="context-icon">➕</span>
            <span>Thêm con</span>
          </div>
          <div className="context-menu-item" onClick={() => handleContextAction('addSpouse', contextMenuMember)}>
            <span className="context-icon">💕</span>
            <span>Thêm Vợ/Chồng</span>
          </div>
          <div className="context-menu-item" onClick={() => handleContextAction('browseBranch', contextMenuMember)}>
            <span className="context-icon">⭐</span>
            <span>Duyệt riêng nhánh này</span>
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

export default AdvancedFamilyTree;


