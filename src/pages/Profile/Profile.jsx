import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const { uid: urlUid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  
  const [currentUserData, setCurrentUserData] = useState(null);
  const [targetUserData, setTargetUserData] = useState(null);
  const [isMe, setIsMe] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [editUsername, setEditUsername] = useState("");
  const [userReportCount, setUserReportCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      let myUid = null;
      if (user) {
        myUid = user.uid;
      } else {
        const discordUserStr = localStorage.getItem("user");
        if (discordUserStr) myUid = JSON.parse(discordUserStr).id || JSON.parse(discordUserStr).uid;
      }

      if (!myUid) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const targetUid = urlUid || myUid;
      setIsMe(myUid === targetUid);

      try {
        const myRef = doc(db, "users", myUid);
        const mySnap = await getDoc(myRef);
        if (mySnap.exists()) {
          setCurrentUserData(mySnap.data());
          setIsAdmin(mySnap.data().role === "admin");
        }

        const targetRef = doc(db, "users", targetUid);
        const targetSnap = await getDoc(targetRef);
        
        if (targetSnap.exists()) {
          const data = targetSnap.data();
          setTargetUserData(data);
          
          if (myUid === targetUid) {
            setEditUsername(data.username || "");
          } else {
            const q = query(collection(db, "reports"), where("reporterUid", "==", targetUid));
            const reportDocs = await getDocs(q);
            setUserReportCount(reportDocs.size);
          }
        } else {
          alert("존재하지 않는 유저입니다.");
          navigate("/");
        }
      } catch (error) {
        console.error("프로필 로딩 에러:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [urlUid, navigate]);

  const handleSave = async () => {
    if (!editUsername.trim()) {
      alert("유저네임을 입력해 주세요.");
      return;
    }

    try {
      let finalPhotoUrl = currentUserData.photoUrl;

      // ✨ 핵심 로직: 디스코드 프사(discordapp.com)를 쓰고 있다면 건드리지 않음!
      // 기존 프사가 없거나, ui-avatars(기본 이니셜 프사)를 쓰고 있을 때만 새 닉네임으로 프사 업데이트
      if (!finalPhotoUrl || finalPhotoUrl.includes("ui-avatars.com")) {
        finalPhotoUrl = `https://ui-avatars.com/api/?name=${editUsername}&background=random&color=fff`;
      }

      await setDoc(doc(db, "users", currentUserData.uid), {
        username: editUsername,
        photoUrl: finalPhotoUrl, 
      }, { merge: true });

      alert("프로필이 성공적으로 업데이트되었습니다! ✨");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleAdminBan = () => {
    alert(`[관리자 권한] ${targetUserData.username} 유저를 제재했습니다. (기능 구현 예정)`);
  };

  if (loading) return <div className="profile-loading">데이터를 불러오는 중...</div>;
  if (!targetUserData) return null;

  const displayPhoto = targetUserData.photoUrl || `https://ui-avatars.com/api/?name=${targetUserData.username || "유저"}&background=random&color=fff`;

  return (
    <div className="profile-wrapper">
      <div className="profile-box">
        <button className="btn-back" onClick={() => navigate(-1)}>⬅ 뒤로 가기</button>
        
        <div className="profile-header">
          <img src={displayPhoto} alt="프로필" className="profile-preview-img" />
          <h1 className="profile-username">
            {targetUserData.username}
            {targetUserData.role === "admin" && <span className="badge-admin">👑</span>}
          </h1>
          <p className="profile-date">
            가입일 : {targetUserData.createdAt ? targetUserData.createdAt.toDate().toLocaleDateString() : "기록 없음"}
          </p>
        </div>

        {isMe && (
          <div className="profile-section section-me">
            <h3 className="section-title">⚙️ 내 프로필 설정</h3>
            
            <label className="profile-label">유저네임</label>
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              className="profile-input"
              placeholder="변경할 닉네임을 입력하세요"
            />
            
            <p className="profile-tip">
              💡 디스코드 가입 유저는 원본 프로필 사진이 유지되며,<br/>
              이메일 가입 유저는 닉네임 변경 시 프로필 사진이 새롭게 만들어집니다!
            </p>

            <button onClick={handleSave} className="btn-save">
              변경사항 저장
            </button>
          </div>
        )}

        {!isMe && isAdmin && (
          <div className="profile-section section-admin">
            <h3 className="section-title text-red">🚨 관리자 전용 정보</h3>
            <p className="admin-info"><strong>UID:</strong> {targetUserData.uid}</p>
            <p className="admin-info"><strong>Email:</strong> {targetUserData.email || "비공개(디스코드 가입 등)"}</p>
            <p className="admin-info"><strong>작성한 신고:</strong> {userReportCount}건</p>
            <button onClick={handleAdminBan} className="btn-ban">이 유저 강제 정지하기</button>
          </div>
        )}

        {!isMe && !isAdmin && (
          <div className="profile-section section-public">
            <div className="stats-box">
              <span className="stats-label">활동 점수 (신고 기여도)</span>
              <span className="stats-value">{userReportCount} 건</span>
            </div>
            
            <div className="coming-soon-box">
              <span className="coming-soon-icon">🎮</span>
              <p>오버워치 전적 연동</p>
              <span className="coming-soon-badge">업데이트 예정</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}