
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { auth, db } from "../firebase/firebase";

import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs
} from "firebase/firestore";




export default function Home() {
  const loadStats = async () => {
  try {
    const reportsSnapshot = await getDocs(
      collection(db, "reports")
    );

    const battletagsSnapshot = await getDocs(
      collection(db, "battletags")
    );

    setReportCount(reportsSnapshot.size);
    setBattleTagCount(battletagsSnapshot.size);

  } catch (error) {
    console.error(error);
  }
};
  const [user, setUser] = useState(null);
  const [reportCount, setReportCount] = useState(0);
const [battleTagCount, setBattleTagCount] = useState(0);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  loadStats();

  return () => unsubscribe();
}, []);
  console.log(auth.currentUser);
  const testFirebase = async () => {
  try {
    await addDoc(collection(db, "reports"), {
      battletag: "TestPlayer#1234",
      reason: "테스트 신고",
      createdAt: new Date(),
    });

    alert("Firebase 저장 성공!");
  } catch (error) {
    console.error(error);
    alert("에러 발생");
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
      <h1
        style={{
          fontSize: "64px",
          marginBottom: "10px",
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

      <div>
  {!user ? (
    <Link to="/login">
      <button>로그인</button>
    </Link>
  ) : (
    <Link to="/report">
      <button>신고하기</button>
    </Link>
  )}
</div>

{user && (
  <div style={{ marginBottom: "20px" }}>
    <p>환영합니다 {user.email}</p>

    <button
      onClick={async () => {
        await auth.signOut();
        window.location.reload();
      }}
    >
      로그아웃
    </button>
  </div>
)}
      <div style={{ marginTop: "20px" }}>
        <Link to="/ranking">
          <button
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            신고 랭킹
          </button>
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