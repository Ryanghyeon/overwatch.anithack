import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
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

        // 🌟 1. 파이어베이스 이메일 유저 DB 동기화
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserNickname(data.nickname || currentUser.email.split("@")[0]);
            setIsAdmin(data.role === "admin");
          } else {
            setUserNickname(currentUser.email.split("@")[0]);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("유저 정보 불러오기 에러:", error);
        }
      } else {
        // ✅ 2. 디스코드 로그인 fallback 및 DB 자동 복구 동기화
        const discordUserStr = localStorage.getItem("user");
        if (discordUserStr) {
          const parsedUser = JSON.parse(discordUserStr);
          setUser(parsedUser);
          
          const discordUid = parsedUser.id || parsedUser.uid; // 디스코드 고유 ID
          
          try {
            const userRef = doc(db, "users", discordUid);
            const userSnap = await getDoc(userRef);

            // 기본 데이터 세팅
            const defaultData = {
              uid: discordUid,
              nickname: parsedUser.username,
              photoUrl: parsedUser.avatar 
                ? `https://cdn.discordapp.com/avatars/${parsedUser.id}/${parsedUser.avatar}.png` 
                : "https://cdn.discordapp.com/embed/avatars/0.png",
            };

            if (userSnap.exists()) {
              // 🛡️ [자동 복구 로직] 기존 유저지만 role이나 createdAt이 없다면?
              const data = userSnap.data();
              const updates = {};
              
              if (!data.role) updates.role = "user";
              if (!data.createdAt) updates.createdAt = new Date();

              // 누락된 필드가 하나라도 있으면 DB에 병합(merge)하여 업데이트!
              if (Object.keys(updates).length > 0) {
                await setDoc(userRef, updates, { merge: true });
              }

              setUserNickname(data.nickname || parsedUser.username);
              setIsAdmin(data.role === "admin" || updates.role === "admin");
            } else {
              // 🔰 완전 처음 가입하는 유저는 모든 정보 생성!
              await setDoc(userRef, {
                ...defaultData,
                role: "user",
                createdAt: new Date(),
              });
              setUserNickname(parsedUser.username);
              setIsAdmin(false);
            }
          } catch (error) {
            console.error("디스코드 DB 동기화 에러:", error);
          }
        } else {
          setUser(null);
          setUserNickname("");
          setIsAdmin(false);
        }
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