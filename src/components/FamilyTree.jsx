import React, { useEffect, useState, useRef } from "react";
import "./FamilyTree.css";
import MemberContextMenu from "./MemberContextMenu";
import MemberDetailModal from "./MemberDetailModal";

/*
Fully functional FamilyTree component (single-file usage with separate CSS).
Features:
- members: { id, name, parentId, spouseId, birth, avatar (dataURL) }
- add / edit / delete members (delete removes descendants)
- upload avatar (File -> dataURL)
- localStorage persistence
- layout: couples shown side-by-side, children grouped under couple midpoint
- popup detail + edit modal
*/

const STORAGE_KEY = "my_family_tree_v1";

// simulate API calls
const api = {
  getMembers: () => new Promise(res => {
    setTimeout(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      res(raw ? JSON.parse(raw) : SAMPLE);
    }, 500);
  }),
  saveMembers: (members) => new Promise(res => {
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
      res(true);
    }, 500);
  })
};

// sample initial data (used when no localStorage)
const SAMPLE = [
  { id: 1, name: "A", spouseId: 2, parentId: null, birth: "1950", avatar: null },
  { id: 2, name: "B", spouseId: 1, parentId: null, birth: "1952", avatar: null },
  { id: 3, name: "C", spouseId: 4, parentId: 1, birth: "1978", avatar: null },
  { id: 4, name: "D", spouseId: 3, parentId: 1, birth: "1979", avatar: null },
  { id: 5, name: "E", spouseId: null, parentId: 1, birth: "1982", avatar: null },
  { id: 6, name: "F", spouseId: null, parentId: 3, birth: "2005", avatar: null },
];

function uid() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export default function FamilyTree({ user, onNavigate }) {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null); // member object
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null); // member object being edited
  const [form, setForm] = useState({ name: "", parentId: "", spouseId: "", birth: "", avatarFile: null });
  const fileRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState(null);

  // load from localStorage (or sample)
  useEffect(() => {
    setIsLoading(true);
    // Load user-specific data
    const userMembers = JSON.parse(localStorage.getItem(`members_${user?.id}`) || '[]');
    if (userMembers.length === 0) {
      // Use sample data for new users
      setMembers(SAMPLE);
      localStorage.setItem(`members_${user?.id}`, JSON.stringify(SAMPLE));
    } else {
      setMembers(userMembers);
    }
    setIsLoading(false);
  }, [user]);

  // persist
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`members_${user.id}`, JSON.stringify(members));
    }
  }, [members, user]);

  // utility: find member by id
  const byId = (id) => members.find((m) => m.id === id);

  // children helper (direct children)
  const childrenOf = (id) => members.filter((m) => m.parentId === id);

  // children of pair (if parent is part of couple)
  const childrenOfPair = (aId, bId) => members.filter((m) => m.parentId === aId || m.parentId === bId);

  // top-level roots (parentId === null)
  const roots = members.filter((m) => m.parentId === null);

  // add member (or update if editing)
  const handleAddOrEdit = async (e) => {
    e?.preventDefault();
    const name = form.name.trim();
    if (!name) return alert("Nhập tên.");

    // handle avatar file -> dataURL
    let avatarData = null;
    if (form.avatarFile) {
      avatarData = await fileToDataUrl(form.avatarFile);
    }

    let updatedMembers = [];
    if (editing) {
      updatedMembers = members.map((m) =>
          m.id === editing.id
            ? {
                ...m,
                name,
                birth: form.birth || "",
                parentId: form.parentId ? Number(form.parentId) : null,
                spouseId: form.spouseId ? Number(form.spouseId) : (form.spouseId === "" ? null : m.spouseId),
                avatar: avatarData || m.avatar || null,
              }
            : m
      );
      setSelected(null);
    } else {
      const id = uid();
      const newM = {
        id,
        name,
        birth: form.birth || "",
        parentId: form.parentId ? Number(form.parentId) : null,
        spouseId: form.spouseId ? Number(form.spouseId) : null,
        avatar: avatarData || null,
      };
      // if spouseId set, also update spouse to reference back
      updatedMembers = [...members, newM];
        if (newM.spouseId) {
        updatedMembers = updatedMembers.map((m) => (m.id === newM.spouseId ? { ...m, spouseId: newM.id } : m));
      }
        }
    setIsLoading(true);
    if (user?.id) {
      localStorage.setItem(`members_${user.id}`, JSON.stringify(updatedMembers));
    }
    setMembers(updatedMembers);
    setIsLoading(false);

    // reset form
    setForm({ name: "", parentId: "", spouseId: "", birth: "", avatarFile: null });
    setShowAdd(false);
    setEditing(null);
    if (fileRef.current) fileRef.current.value = "";
    
    // Show success message
    if (editing) {
      alert(`✅ Đã cập nhật thông tin thành viên "${name}" thành công!`);
    } else {
      alert(`✅ Đã thêm thành viên "${name}" vào cây gia phả thành công!`);
    }
  };

  // helper to convert File to dataURL
  const fileToDataUrl = (f) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(f);
    });

  // delete member + descendants
  const deleteWithDescendants = async (id) => {
    if (!window.confirm("Xóa thành viên này và tất cả con cháu?")) return;
    const toRemove = new Set([id]);
    const gather = (pid) => {
      members.forEach((m) => {
        if (m.parentId === pid) {
          toRemove.add(m.id);
          gather(m.id);
        }
      });
    };
    gather(id);
    const newMembers = members.filter((m) => !toRemove.has(m.id)).map((m) => (toRemove.has(m.spouseId) ? { ...m, spouseId: null } : m));
    setIsLoading(true);
    if (user?.id) {
      localStorage.setItem(`members_${user.id}`, JSON.stringify(newMembers));
    }
    setMembers(newMembers);
    setIsLoading(false);
    setSelected(null);
  };

  // simple link spouse (update both)
  const linkSpouse = async (aId, bId) => {
    if (aId === bId) return alert("Không thể tự ghép chính mình.");
    const updatedMembers = members.map((m) => {
        if (m.id === aId) return { ...m, spouseId: bId };
        if (m.id === bId) return { ...m, spouseId: aId };
        return m;
    });
    setIsLoading(true);
    if (user?.id) {
      localStorage.setItem(`members_${user.id}`, JSON.stringify(updatedMembers));
    }
    setMembers(updatedMembers);
    setIsLoading(false);
  };

  // open add modal (optionally parentId)
  const openAdd = (parentId = "") => {
    setEditing(null);
    setForm({ name: "", parentId: parentId ? String(parentId) : "", spouseId: "", birth: "", avatarFile: null });
    setShowAdd(true);
    setSelected(null);
  };

  // open edit modal
  const openEdit = (m) => {
    console.log('Opening edit modal for:', m);
    setEditing(m);
    setForm({
      name: m.name || "",
      parentId: m.parentId ? String(m.parentId) : "",
      spouseId: m.spouseId ? String(m.spouseId) : "",
      birth: m.birth || "",
      avatarFile: null,
    });
    setShowAdd(true);
    console.log('Modal should be visible now, showAdd:', true);
  };

  // handle member actions from context menu
  const handleMemberAction = (actionType, member) => {
    setSelected(member); // Select the member for context
    switch (actionType) {
      case 'update':
        openEdit(member);
        break;
      case 'viewBio':
        setSelectedMemberForDetail(member);
        setShowDetailModal(true);
        break;
      case 'addParent':
        openAdd(""); // Add parent, parentId will be selected later
        alert(`Thêm cha/mẹ cho ${member.name}. Sau khi tạo, hãy chọn ${member.name} làm con của cha/mẹ mới.`);
        break;
      case 'addSpouse':
        const spouseName = prompt(`Nhập tên vợ/chồng của ${member.name}:`);
        if (spouseName && spouseName.trim()) {
          const newSpouse = {
            id: uid(),
            name: spouseName.trim(),
            birth: "",
            parentId: member.parentId, // Same parent as current member
            spouseId: member.id,
            avatar: null,
          };
          const updatedMembers = [...members, newSpouse];
          if (user?.id) {
            localStorage.setItem(`members_${user.id}`, JSON.stringify(updatedMembers));
          }
          setMembers(updatedMembers);
          alert(`Đã thêm ${spouseName} làm vợ/chồng của ${member.name}`);
        }
        break;
      case 'addChild':
        openAdd(member.id);
        break;
      case 'addComment':
        alert(`Thêm bình luận cho ${member.name}`);
        // Implement comment adding logic
        break;
      case 'quickInfo':
        alert(`Thông tin nhanh: Tên: ${member.name}, SN: ${member.birth || "—"}, ID: ${member.id}`);
        break;
      case 'viewDescendants':
        alert(`Xem danh sách con cháu của ${member.name}`);
        // Implement descendants viewing logic
        break;
      case 'downloadExcel':
        // Export member data to CSV
        const memberData = [
          ['Tên', 'Năm sinh', 'Năm mất', 'Nghề nghiệp', 'Giới tính', 'Mối quan hệ', 'Vợ/Chồng', 'Cha/Mẹ'],
          [
            member.name,
            member.birth || '',
            member.death || '',
            member.occupation || '',
            member.gender === 'male' ? 'Nam' : 'Nữ',
            member.relationship || '',
            member.spouseId ? byId(member.spouseId)?.name || '' : '',
            member.parentId ? byId(member.parentId)?.name || '' : ''
          ]
        ];
        const csvContent = memberData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `thong_tin_${member.name.replace(/\s+/g, '_')}.csv`;
        link.click();
        alert(`Đã tải xuống thông tin của ${member.name}`);
        break;
      case 'delete':
        deleteWithDescendants(member.id);
        break;
      default:
        console.warn('Unknown action:', actionType);
    }
  };

  const handleSaveMemberDetail = (updatedMember) => {
    const updatedMembers = members.map((m) => (m.id === updatedMember.id ? updatedMember : m));
    setMembers(updatedMembers);
    if (user?.id) {
      localStorage.setItem(`members_${user.id}`, JSON.stringify(updatedMembers));
    }
    setSelected(updatedMember); // Update selected member if it was the one being edited
    setShowDetailModal(false);
  };

  // render couple or single root list, avoid double rendering couples
  const rendered = new Set();

  return (
    <div className="ft-app">
      <div className="ft-top">
        <div className="ft-header">
          <button className="btn-back" onClick={() => onNavigate('dashboard')}>
            ← Quay lại Dashboard
          </button>
          <div className="ft-title">🌳 Cây Gia Phả</div>
        </div>
        <div className="ft-controls">
          <input
            type="text"
            placeholder="Tìm thành viên theo tên..."
            className="search-member-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        <div className="ft-actions">
            <button className="btn ghost" onClick={() => { 
              if (user?.id) {
                localStorage.removeItem(`members_${user.id}`);
                setMembers(SAMPLE);
                localStorage.setItem(`members_${user.id}`, JSON.stringify(SAMPLE));
              }
              setSelected(null); 
            }}>Reset demo</button>
            <button 
              className="btn primary" 
              onClick={() => openAdd("")}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderRadius: '25px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              ➕ Thêm thành viên
            </button>
          </div>
        </div>
      </div>

      <div className="ft-body">
        <main className="ft-tree-area">
          {isLoading && <div className="loading-message">Đang tải dữ liệu...</div>}

          {!isLoading && roots.length === 0 && searchTerm === "" ? (
            <div className="initial-tree-setup">
              <div className="setup-block">
                <input 
                  type="text" 
                  placeholder="Nhập tên thành viên đầu tiên" 
                  className="first-member-input"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
                <button 
                  className="btn primary search-confirm-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    if (form.name.trim()) {
                      handleAddOrEdit(e);
                    } else {
                      alert('Vui lòng nhập tên thành viên!');
                    }
                  }}
                >
                  🔍 Tạo thành viên đầu tiên
                </button>
              </div>
              <h3 className="list-title">Danh sách cây</h3>
              <div className="empty-tree-message">
                Chưa có cây, vui lòng tạo mới ở thành viên đầu.
              </div>
            </div>
          ) : null}

          {!isLoading && roots.length > 0 && (
          <div className="tree-root">
              {roots
                .filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((r) => {
              if (rendered.has(r.id)) return null;
              const spouse = r.spouseId ? byId(r.spouseId) : null;
              // if spouse exists and spouse is root also -> render couple block
              if (spouse && spouse.parentId === null) {
                rendered.add(r.id);
                rendered.add(spouse.id);
                const kids = childrenOfPair(r.id, spouse.id);
                return (
                  <div key={`couple-${r.id}-${spouse.id}`} className="couple-block">
                    <div className="couple-row">
                          <MemberCard m={r} onSelect={() => setSelected(r)} onAddChild={() => openAdd(r.id)} onMemberAction={handleMemberAction} />
                      <div className="spouse-connector" />
                          <MemberCard m={spouse} onSelect={() => setSelected(spouse)} onAddChild={() => openAdd(spouse.id)} onMemberAction={handleMemberAction} />
                    </div>

                    <div className="couple-children">
                      {/* vertical from midpoint */}
                      <div className="mid-vertical" />

                      {kids.length > 0 ? (
                        <div className="children-row">
                          {kids.map((c) => (
                            <div className="child-column" key={c.id}>
                              {/* child might be part of couple itself -> show its couple if spouse present and parent is root of that couple */}
                              {c.spouseId && byId(c.spouseId) ? (
                                <div className="sub-couple">
                                      <MemberCard m={c} small onSelect={() => setSelected(c)} onAddChild={() => openAdd(c.id)} onMemberAction={handleMemberAction} />
                                  <div className="spouse-connector small" />
                                      <MemberCard m={byId(c.spouseId)} small onSelect={() => setSelected(byId(c.spouseId))} onAddChild={() => openAdd(byId(c.spouseId).id)} onMemberAction={handleMemberAction} />
                                </div>
                              ) : (
                                    <MemberCard m={c} small onSelect={() => setSelected(c)} onAddChild={() => openAdd(c.id)} onMemberAction={handleMemberAction} />
                              )}

                              {/* child's descendants */}
                              <div className="child-vertical" />
                              <div className="grandchildren">
                                {childrenOf(c.id).map((g) => (
                                      <MemberCard key={g.id} m={g} tiny onSelect={() => setSelected(g)} onAddChild={() => openAdd(g.id)} onMemberAction={handleMemberAction} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="children-empty">— Chưa có con —</div>
                      )}
                    </div>
                  </div>
                );
              }

              // single root (no spouse or spouse not root)
              rendered.add(r.id);
              const kids = childrenOf(r.id);
              return (
                <div key={`single-${r.id}`} className="single-block">
                      <MemberCard m={r} onSelect={() => setSelected(r)} onAddChild={() => openAdd(r.id)} onMemberAction={handleMemberAction} />
                  <div className="single-children">
                    <div className="child-vertical" />
                    <div className="children-row">
                          {kids.length > 0 ? kids.map((c) => <MemberCard key={c.id} m={c} small onSelect={() => setSelected(c)} onAddChild={() => openAdd(c.id)} onMemberAction={handleMemberAction} />) : <div className="children-empty">— Chưa có con —</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </main>

        {/* right panel for detail and operations */}
        <aside className="ft-side">
          <div className="side-card">
            <h4>Chi tiết thành viên</h4>
            {!selected ? (
              <div className="side-empty">
                <div style={{fontSize: '3rem', marginBottom: '15px'}}>👆</div>
                <p>Click vào thành viên để xem thông tin chi tiết</p>
              </div>
            ) : (
              <>
                <div className="side-avatar">
                  {selected.avatar ? (
                    <img src={selected.avatar} alt={selected.name} />
                  ) : (
                    <div className="initial">{selected.name.charAt(0)}</div>
                  )}
                </div>
                <h3 style={{textAlign: 'center', marginBottom: '20px', color: '#333'}}>{selected.name}</h3>
                
                <div style={{marginBottom: '20px'}}>
                  <div style={{marginBottom: '8px'}}><strong>Năm sinh:</strong> {selected.birth || "Chưa rõ"}</div>
                  {selected.death && <div style={{marginBottom: '8px'}}><strong>Năm mất:</strong> {selected.death}</div>}
                  {selected.occupation && <div style={{marginBottom: '8px'}}><strong>Nghề nghiệp:</strong> {selected.occupation}</div>}
                  <div style={{marginBottom: '8px'}}><strong>Giới tính:</strong> {selected.gender === 'male' ? 'Nam' : 'Nữ'}</div>
                  <div style={{marginBottom: '8px'}}><strong>Mối quan hệ:</strong> {selected.relationship || 'Chưa xác định'}</div>
                  <div style={{marginBottom: '8px'}}><strong>Vợ/Chồng:</strong> {selected.spouseId ? byId(selected.spouseId)?.name : "Chưa có"}</div>
                  <div><strong>Cha/Mẹ:</strong> {selected.parentId ? byId(selected.parentId)?.name : "Gốc gia đình"}</div>
                </div>

                <div className="side-actions">
                  <button className="btn primary" onClick={() => openEdit(selected)}>✏️ Chỉnh sửa</button>
                  <button className="btn" onClick={() => openAdd(selected.id)}>➕ Thêm con</button>
                  <button className="btn ghost" onClick={() => { 
                    const spouseName = prompt("Nhập tên vợ/chồng:");
                    if (spouseName && spouseName.trim()) {
                      const newSpouse = {
                        id: uid(),
                        name: spouseName.trim(),
                        birth: "",
                        parentId: selected.parentId,
                        spouseId: selected.id,
                        avatar: null,
                      };
                      const updatedMembers = [...members, newSpouse];
                      if (user?.id) {
                        localStorage.setItem(`members_${user.id}`, JSON.stringify(updatedMembers));
                      }
                      setMembers(updatedMembers);
                      alert(`Đã thêm ${spouseName} làm vợ/chồng của ${selected.name}`);
                    }
                  }}>💕 Thêm vợ/chồng</button>
                  <button className="btn danger" onClick={() => deleteWithDescendants(selected.id)}>🗑 Xóa</button>
                </div>
              </>
            )}
          </div>

          <div className="side-card">
            <h4>Hướng dẫn sử dụng</h4>
            <div style={{fontSize: '0.9rem', lineHeight: '1.6', color: '#666'}}>
              <p>• <strong>Click</strong> vào thành viên để xem thông tin</p>
              <p>• <strong>Chuột phải</strong> hoặc click <strong>...</strong> để mở menu</p>
              <p>• <strong>Thêm thành viên</strong> từ nút + hoặc menu</p>
              <p>• <strong>Kéo thả</strong> để sắp xếp (sắp có)</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Debug info */}
      {showAdd && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'red',
          color: 'white',
          padding: '10px',
          zIndex: 999999,
          borderRadius: '5px'
        }}>
          Modal is open! showAdd: {showAdd.toString()}, editing: {editing ? editing.name : 'null'}
        </div>
      )}

      {/* add / edit modal */}
      {showAdd && (
        <div 
          className="modal-overlay" 
          onClick={() => { 
            setShowAdd(false); 
            setEditing(null); 
            setForm({ name: "", parentId: "", spouseId: "", birth: "", avatarFile: null });
          }}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div 
            className="modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              zIndex: 100000,
              border: '2px solid #667eea'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#333', margin: 0 }}>
                {editing ? "Cập nhật thành viên" : "Thêm thành viên"}
              </h3>
              <button
                type="button"
                onClick={() => { 
                  setShowAdd(false); 
                  setEditing(null); 
                  setForm({ name: "", parentId: "", spouseId: "", birth: "", avatarFile: null });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '5px',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f0f0f0';
                  e.target.style.color = '#333';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#666';
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddOrEdit} className="modal-form">
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Tên *</label>
                <input 
                  type="text"
                  value={form.name} 
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} 
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Nhập tên thành viên"
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Năm sinh</label>
                <input 
                  type="text"
                  value={form.birth} 
                  onChange={(e) => setForm((s) => ({ ...s, birth: e.target.value }))} 
                  placeholder="YYYY hoặc ngày đầy đủ"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Cha / Mẹ (chọn nếu là con)</label>
                <select 
                  value={form.parentId} 
                  onChange={(e) => setForm((s) => ({ ...s, parentId: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">(Không) — là gốc gia đình</option>
                  {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Ghép vợ/chồng</label>
                <select 
                  value={form.spouseId} 
                  onChange={(e) => setForm((s) => ({ ...s, spouseId: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                >
                <option value="">(Không)</option>
                  {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Ảnh đại diện (tùy chọn)</label>
                <input 
                  ref={fileRef} 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setForm((s) => ({ ...s, avatarFile: e.target.files && e.target.files[0] }))} 
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <button 
                  type="button" 
                  className="btn ghost" 
                  onClick={() => { 
                    setShowAdd(false); 
                    setEditing(null); 
                    setForm({ name: "", parentId: "", spouseId: "", birth: "", avatarFile: null });
                  }}
                  style={{
                    padding: '12px 20px',
                    border: '2px solid #667eea',
                    borderRadius: '25px',
                    background: 'transparent',
                    color: '#667eea',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn primary"
                  style={{
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '25px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {editing ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {showDetailModal && (
        <MemberDetailModal
          member={selectedMemberForDetail}
          onClose={() => setShowDetailModal(false)}
          onSave={handleSaveMemberDetail}
        />
      )}
    </div>
  );
}

/* MemberCard small component */
function MemberCard({ m, small = false, tiny = false, onSelect = () => {}, onAddChild = () => {}, onMemberAction = () => {} }) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowContextMenu(true);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleThreeDotsClick = (e) => {
    e.stopPropagation();
    setShowContextMenu(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenuPosition({ x: rect.left, y: rect.bottom });
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };

  return (
    <div
      ref={cardRef}
      className={`member-card ${small ? "small" : ""} ${tiny ? "tiny" : ""}`}
      onClick={(e) => { e.stopPropagation(); onSelect(m); }}
      onContextMenu={handleContextMenu}
    >
      <div className="avatar">{m.avatar ? <img src={m.avatar} alt={m.name} /> : <div className="initial">{m.name.charAt(0)}</div>}</div>
      <div className="mname">{m.name}</div>
      {!tiny && <div className="mrole"> {small ? "" : ""} </div>}
      <div className="card-actions">
        <button className="small-btn" onClick={(e) => { e.stopPropagation(); onAddChild(); }}>➕</button>
        <button className="small-btn three-dots-btn" onClick={handleThreeDotsClick}>...</button>
      </div>

      {showContextMenu && (
        <MemberContextMenu
          member={m}
          position={contextMenuPosition}
          onClose={handleCloseContextMenu}
          onAction={onMemberAction}
        />
      )}
    </div>
  );
}
