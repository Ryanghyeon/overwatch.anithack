import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import './Home.css'; // 🔥 CSS 파일 연결

export default function Home() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [battleTagCount, setBattleTagCount] = useState(0);

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
    <div className="home-wrapper">
      <div className="home-box">
        <h1 className="home-title">OW Watch</h1>
        <p className="home-subtitle">오버워치 커뮤니티 신고 플랫폼</p>

        {!user ? (
          <Link to="/login">
            <button className="btn-action">로그인</button>
          </Link>
        ) : (
          <>
            <div className="user-info">
              <strong>{user.email || user.username}</strong>
            </div>

            <Link to="/report">
              <button className="btn-action">🚨 신고하기</button>
            </Link>

            <br />

            <Link to="/ranking">
              <button className="btn-action">🏆 신고 랭킹</button>
            </Link>

            <br />

            {isAdmin && (
              <>
                <Link to="/admin">
                  <button className="btn-action">🛠 관리자</button>
                </Link>
                <br />
              </>
            )}

            <button
              className="btn-action"
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
              <button className="btn-action">🏆 신고 랭킹</button>
            </Link>
          </>
        )}

        <div className="stats-container">
          <div>
            <div className="stat-label">총 신고</div>
            <div className="stat-value report-val">{reportCount}</div>
          </div>

          <div>
            <div className="stat-label">배틀태그</div>
            <div className="stat-value battletag-val">{battleTagCount}</div>
          </div>
        </div>
      </div>

      <div className="admin-indicator">
        관리자 : {isAdmin ? "YES" : "NO"}
      </div>
    </div>
  );
}