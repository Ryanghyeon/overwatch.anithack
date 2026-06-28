import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { auth, db } from "../firebase/firebase";

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

  useEffect(() => {
    loadStats();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      console.log("로그인 사용자:", currentUser.email);

      try {
        const q = query(
          collection(db, "admins"),
          where("email", "==", currentUser.email)
        );

        const snapshot = await getDocs(q);

        console.log("관리자 문서 개수:", snapshot.size);
        console.log("관리자 여부:", !snapshot.empty);

        setIsAdmin(!snapshot.empty);

      } catch (error) {
        console.error("관리자 조회 오류:", error);
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
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "64px", marginBottom: "10px" }}>
        OW Watch
      </h1>

      <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
        오버워치 커뮤니티 신고 플랫폼
      </p>

      {!user ? (
        <Link to="/login">
          <button>로그인</button>
        </Link>
      ) : (
        <>
          <p>환영합니다 {user.email}</p>

          {/* 디버깅용 - 나중에 삭제 가능 */}
          <p>관리자 여부 : {isAdmin ? "YES" : "NO"}</p>

          <div style={{ marginBottom: "20px" }}>
            <Link to="/report">
              <button>신고하기</button>
            </Link>
          </div>

          <button
            onClick={async () => {
              await auth.signOut();
              window.location.reload();
            }}
          >
            로그아웃
          </button>

          {isAdmin && (
            <div style={{ marginTop: "20px" }}>
              <Link to="/admin">
                <button
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  🛠 관리자
                </button>
              </Link>
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: "20px" }}>
        <Link to="/ranking">
          <button>신고 랭킹</button>
        </Link>
      </div>

      <div
        style={{
          marginTop: "50px",
          textAlign: "center",
        }}
      >
        <h3>총 신고 건수</h3>
        <p>{reportCount}</p>

        <br />

        <h3>등록된 배틀태그</h3>
        <p>{battleTagCount}</p>
      </div>
    </div>
  );
}
