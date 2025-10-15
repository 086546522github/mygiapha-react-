import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import FamilyList from "./components/FamilyList";

function App() {
  const [page, setPage] = useState("login"); // login | register | home | family

  return (
    <div>
      {page === "login" && <Login />}
      {page === "register" && <Register />}
      {page === "home" && <Home />}
      {page === "family" && <FamilyList />}

      {/* Điều hướng nhỏ */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {page === "login" && (
          <>
            <button onClick={() => setPage("register")}>Chưa có tài khoản?</button>
            <button onClick={() => setPage("home")} style={{ marginLeft: "10px" }}>
              Vào trang chủ
            </button>
          </>
        )}

        {page === "register" && (
          <>
            <button onClick={() => setPage("login")}>Đã có tài khoản?</button>
            <button onClick={() => setPage("home")} style={{ marginLeft: "10px" }}>
              Vào trang chủ
            </button>
          </>
        )}

        {page === "home" && (
          <>
            <button onClick={() => setPage("family")}>Quản lý Gia phả</button>
            <button onClick={() => setPage("login")} style={{ marginLeft: "10px" }}>
              Đăng xuất
            </button>
          </>
        )}

        {page === "family" && (
          <>
            <button onClick={() => setPage("home")}>← Quay lại Trang chủ</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
