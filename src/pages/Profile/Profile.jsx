import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore"; // ✨ deleteDoc 추가
import { onAuthStateChanged, deleteUser } from "firebase/auth"; // ✨ deleteUser 추가
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

  // 프로필 저장
  const handleSave = async () => {
    if (!editUsername.trim()) {
      alert("유저네임을 입력해 주세요.");
      return;
    }

    try {
      let finalPhotoUrl = currentUserData.photoUrl;

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

  // ✨ 회원 탈퇴 로직
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "정말로 탈퇴하시겠습니까? \n모든 프로필 정보가 영구적으로 삭제되며 되돌릴 수 없습니다."
    );
    if (!confirmDelete) return;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("유저 정보를 찾을 수 없습니다.");

      // 1. Firestore(장부)에서 내 문서 삭제
      await deleteDoc(doc(db, "users", user.uid));

      // 2. Authentication(출입국 관리소)에서 계정 삭제
      await deleteUser(user);

      // 3. 로컬 스토리지 데이터 청소
      localStorage.removeItem("user");

      alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
      navigate("/");
    } catch (error) {
      console.error(error);
      // ✨ 파이어베이스 보안 정책 방어 코드: 로그인한 지 오래된 상태에서 탈퇴 시도 시
      if (error.code === 'auth/requires-recent-login') {
        alert("보안을 위해 다시 로그인한 후 탈퇴를 진행해 주세요.");
        await auth.signOut();
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        alert("탈퇴 중 오류가 발생했습니다: " + error.message);
      }
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

            {/* ✨ 회원 탈퇴 버튼 추가 */}
            <div className="danger-zone">
              <button onClick={handleDeleteAccount} className="btn-delete-account">
                회원 탈퇴
              </button>
            </div>
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