import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc, setDoc, query, where } from "firebase/firestore";
import './Home.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [battleTagCount, setBattleTagCount] = useState(0);

  // ✨ 검색 관련 상태 추가
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null); // null: 검색 안함, false: 클린 유저, object: 전과 유저
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadStats();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const updates = {};
            
            if (!data.role) updates.role = "user";
            if (!data.createdAt) updates.createdAt = new Date();
            
            if (!data.photoUrl && data.avatar) {
              updates.photoUrl = `https://cdn.discordapp.com/avatars/${data.uid}/${data.avatar}.png`;
            }

            if (Object.keys(updates).length > 0) {
              await setDoc(userRef, updates, { merge: true });
            }

            const displayUsername = data.username || (currentUser.email ? currentUser.email.split("@")[0] : "유저");
            setUserName(displayUsername);
            setIsAdmin(data.role === "admin" || updates.role === "admin");
            
          } else {
            const defaultName = currentUser.email ? currentUser.email.split("@")[0] : "유저";
            await setDoc(userRef, {
              uid: currentUser.uid,
              username: defaultName,
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
              username: parsedUser.username,
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

              setUserName(data.username || parsedUser.username);
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

  // ✨ 통합 검색 함수 (battletags 요약 장부만 1번 조회하므로 비용/속도 최적화 완벽)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const q = query(collection(db, "battletags"), where("battletag", "==", searchQuery.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // 전과가 있는 배틀태그인 경우
        const tagDoc = querySnapshot.docs[0];
        setSearchResult({ id: tagDoc.id, ...tagDoc.data() });
      } else {
        // 전과가 없는 깨끗한 유저인 경우
        setSearchResult(false);
      }
    } catch (error) {
      console.error("검색 중 에러 발생:", error);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
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

        {/* ✨ [추가] 통합 검색창 UI */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="배틀태그 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-search" disabled={isSearching}>
              {isSearching ? "🔍" : "🔍 검색"}
            </button>
          </div>
        </form>

        {searchResult !== null && (
          <div className="search-result-box">
            {searchResult === false ? (
              <p className="result-clean">
                🟢 <strong>{searchQuery}</strong> 유저는 접수된 신고 내역이 없습니다.
              </p>
            ) : (
              <div className="result-danger">
              <p>
                🚨 <strong>{searchResult.battletag}</strong> 유저는 현재까지 
                <span className="danger-count"> {searchResult.count || searchResult.reportCount || 0}번</span> 신고되었습니다!
              </p>
              <button className="btn-go-detail" onClick={() => alert("상세 신고 기록실 타임라인은 업데이트 예정입니다!")}>
              🔍 상세 전과 기록 보기
              </button>
            </div>
            )}
          </div>
        )}

        {!user ? (
          <div className="auth-buttons" style={{ marginTop: "30px" }}>
            <Link to="/login"><button className="btn-action">로그인</button></Link>
            <br />
            <Link to="/ranking"><button className="btn-action">🏆 신고 랭킹</button></Link>
          </div>
        ) : (
          <div className="user-menu" style={{ marginTop: "30px" }}>
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
          </div>
        )}

        <div className="stats-container">
          <div>
            <div className="stat-label">누적 신고</div>
            <div className="stat-value report-val">{reportCount}</div>
          </div>
          <div>
            <div className="stat-label">누적 배틀태그</div>
            <div className="stat-value battletag-val">{battleTagCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}