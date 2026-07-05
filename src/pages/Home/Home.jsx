import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import './Home.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [userNickname, setUserNickname] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [battleTagCount, setBattleTagCount] = useState(0);

  useEffect(() => {
    loadStats();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // 🌟 1. 유저 정보 & 관리자 권한 한 번에 체크! (과거 admins 컬렉션 코드 완전 삭제)
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserNickname(data.nickname || currentUser.email.split("@")[0]);
            setIsAdmin(data.role === "admin"); // ✨ 단 한 줄로 관리자 검사 끝!
          } else {
            setUserNickname(currentUser.email.split("@")[0]);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("유저 정보 불러오기 에러:", error);
        }
      } else {
        // ✅ 디스코드 로그인 fallback
        const discordUser = localStorage.getItem("user");
        if (discordUser) {
          const parsedUser = JSON.parse(discordUser);
          setUser(parsedUser);
          setUserNickname(parsedUser.username);
        } else {
          setUser(null);
          setUserNickname("");
        }
        setIsAdmin(false);
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
      console.error("통계 로딩 에러:", error);
    }
  };

  // 🌟 2. 로그아웃 기능도 밖으로 빼서 깔끔하게 정리
  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="home-wrapper">
      <div className="home-box">
        <h1 className="home-title">OW Watch</h1>
        <p className="home-subtitle">오버워치 커뮤니티 신고 플랫폼</p>

        {/* 🌟 3. 조건부 렌더링(UI) 구조 단순화 */}
        {!user ? (
          <>
            <Link to="/login"><button className="btn-action">로그인</button></Link>
            <br />
            <Link to="/ranking"><button className="btn-action">🏆 신고 랭킹</button></Link>
          </>
        ) : (
          <>
            {isAdmin ? (
              <div className="admin-greeting">
                <span className="admin-badge">👑 </span> 
                <span className="admin-nickname">{userNickname}</span> 관리자 계정 작동 중
              </div>
            ) : (
              <div className="user-greeting">
                반갑습니다, <span className="user-nickname">{userNickname}</span> 님!
              </div>
            )}

            <Link to="/Profile" className="profile-link">
              <button className="btn-profile-setting">⚙️ 내 프로필 설정</button>
            </Link>

            <Link to="/report"><button className="btn-action">🚨 신고하기</button></Link>
            <br />
            <Link to="/ranking"><button className="btn-action">🏆 신고 랭킹</button></Link>
            <br />

            {isAdmin && (
              <>
                <Link to="/admin"><button className="btn-action">🛠 관리자 대시보드</button></Link>
                <br />
              </>
            )}

            <button className="btn-action" onClick={handleLogout}>로그아웃</button>
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
    </div>
  );
}