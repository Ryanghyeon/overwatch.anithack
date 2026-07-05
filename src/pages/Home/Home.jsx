import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import './Home.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(""); // ✨ userNickname -> userName으로 변경!
  const [isAdmin, setIsAdmin] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [battleTagCount, setBattleTagCount] = useState(0);

  useEffect(() => {
    loadStats();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // 🌟 1. 파이어베이스 유저 동기화 (이메일 & 디스코드 커스텀 토큰 모두 여기로 옴)
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const updates = {};
            
            // 🛡️ [자동 복구 로직] 백엔드가 생성한 반쪽짜리 디스코드 계정 방어
            if (!data.role) updates.role = "user";
            if (!data.createdAt) updates.createdAt = new Date();
            
            // ✨ (삭제됨) 더 이상 nickname으로 복사하는 땜질 코드가 필요 없습니다!
            
            // 디스코드 프로필 사진 URL 생성 (백엔드가 avatar 해시값만 줬을 경우 방어)
            if (!data.photoUrl && data.avatar) {
              updates.photoUrl = `https://cdn.discordapp.com/avatars/${data.uid}/${data.avatar}.png`;
            }

            // 누락된 필드가 하나라도 있으면 DB에 병합(merge)하여 덮어쓰기!
            if (Object.keys(updates).length > 0) {
              await setDoc(userRef, updates, { merge: true });
            }

            // ✨ 화면에 띄울 이름 결정 (DB의 username 우선, 없으면 이메일 앞부분)
            const displayUsername = data.username || (currentUser.email ? currentUser.email.split("@")[0] : "유저");
            setUserName(displayUsername);
            setIsAdmin(data.role === "admin" || updates.role === "admin");
            
          } else {
            // 🔰 완전 처음 가입하는 일반 파이어베이스 유저 기본 세팅
            const defaultName = currentUser.email ? currentUser.email.split("@")[0] : "유저";
            await setDoc(userRef, {
              uid: currentUser.uid,
              username: defaultName, // ✨ nickname 대신 username으로 저장!
              photoUrl: "https://cdn.discordapp.com/embed/avatars/0.png",
              role: "user",
              createdAt: new Date(),
            });
            setUserName(defaultName);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("유저 정보 불러오기 에러:", error);
        }
      } else {
        // ✅ 2. 혹시 모를 로컬 스토리지 전용 디스코드 유저 fallback 처리
        const discordUserStr = localStorage.getItem("user");
        if (discordUserStr) {
          const parsedUser = JSON.parse(discordUserStr);
          setUser(parsedUser);
          
          const discordUid = parsedUser.id || parsedUser.uid;
          
          try {
            const userRef = doc(db, "users", discordUid);
            const userSnap = await getDoc(userRef);

            const defaultData = {
              uid: discordUid,
              username: parsedUser.username, // ✨ nickname 대신 username으로 저장!
              photoUrl: parsedUser.avatar 
                ? `https://cdn.discordapp.com/avatars/${parsedUser.id}/${parsedUser.avatar}.png` 
                : "https://cdn.discordapp.com/embed/avatars/0.png",
            };

            if (userSnap.exists()) {
              const data = userSnap.data();
              const updates = {};
              
              if (!data.role) updates.role = "user";
              if (!data.createdAt) updates.createdAt = new Date();

              if (Object.keys(updates).length > 0) {
                await setDoc(userRef, updates, { merge: true });
              }

              setUserName(data.username || parsedUser.username); // ✨ 데이터 불러올 때도 username
              setIsAdmin(data.role === "admin" || updates.role === "admin");
            } else {
              await setDoc(userRef, {
                ...defaultData,
                role: "user",
                createdAt: new Date(),
              });
              setUserName(parsedUser.username);
              setIsAdmin(false);
            }
          } catch (error) {
            console.error("디스코드 DB 동기화 에러:", error);
          }
        } else {
          setUser(null);
          setUserName("");
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
                <span className="admin-nickname">{userName}</span> 관리자 계정 작동 중
              </div>
            ) : (
              <div className="user-greeting">
                반갑습니다, <span className="user-nickname">{userName}</span> 님!
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
            <div className="stat-label">누적 신고 수</div>
            <div className="stat-value report-val">{reportCount}</div>
          </div>
          <div>
            <div className="stat-label">누적 배틀태그 수</div>
            <div className="stat-value battletag-val">{battleTagCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}