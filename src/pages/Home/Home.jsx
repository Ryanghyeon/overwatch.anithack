import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { auth, db } from "../../firebase/firebase";

import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [battleTagCount, setBattleTagCount] = useState(0);

  const buttonStyle = {
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    minWidth: "180px",
    margin: "8px 0",
  };

useEffect(() => {
  loadStats();

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      // ✅ Firebase 로그인
      setUser(currentUser);
    } else {
      // ✅ 디스코드 로그인 fallback
      const discordUser = localStorage.getItem("user");

      if (discordUser) {
        setUser(JSON.parse(discordUser));
      } else {
        setUser(null);
      }
    }

    // ✅ 관리자 체크는 Firebase만
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
  });

  return () => unsubscribe();
}, []);

  const loadStats = async () => {
    try {
      const reportsSnapshot = await getDocs(collection(db, "reports"));
      const battletagsSnapshot = await getDocs(collection(db, "battletags"));

      setReportCount(reportsSnapshot.size);
      setBattleTagCount(battletagsSnapshot.size);
    } catch (error) {
      console.error(error);
    }
  };

  return (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontFamily: "sans-serif",
    }}
  >
    <div
      style={{
        width: "420px",
        background: "#1e293b",
        borderRadius: "20px",
        padding: "40px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          marginBottom: "10px",
          color: "#f59e0b",
        }}
      >
        OW Watch
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "30px",
        }}
      >
        오버워치 커뮤니티 신고 플랫폼
      </p>

      {!user ? (
        <Link to="/login">
          <button style={buttonStyle}>로그인</button>
        </Link>
      ) : (
        <>
          <div
            style={{
              background: "#334155",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
           <strong>{user.email || user.username}</strong>
          </div>

          <Link to="/report">
            <button style={buttonStyle}>🚨 신고하기</button>
          </Link>

          <br />

          <Link to="/ranking">
            <button style={buttonStyle}>🏆 신고 랭킹</button>
          </Link>

          <br />

          {isAdmin && (
            <>
              <Link to="/admin">
                <button style={buttonStyle}>🛠 관리자</button>
              </Link>
              <br />
            </>
          )}

          <button
            style={buttonStyle}
            onClick={async () => {
  await auth.signOut();
  localStorage.removeItem("user"); // ✅ 디코도 같이 로그아웃
  window.location.reload();
}}
          >
            로그아웃
          </button>
        </>
      )}

      {!user && (
        <>
          <br />
          <Link to="/ranking">
            <button style={buttonStyle}>🏆 신고 랭킹</button>
          </Link>
        </>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "35px",
          paddingTop: "20px",
          borderTop: "1px solid #475569",
        }}
      >
        <div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            총 신고
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "#f59e0b",
            }}
          >
            {reportCount}
          </div>
        </div>

        <div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            배틀태그
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "#38bdf8",
            }}
          >
            {battleTagCount}
          </div>
        </div>
      </div>
    </div>

    <div
      style={{
        position: "fixed",
        bottom: "15px",
        right: "15px",
        color: "#94a3b8",
        fontSize: "13px",
      }}
    >
      관리자 : {isAdmin ? "YES" : "NO"}
    </div>
  </div>
);
}
