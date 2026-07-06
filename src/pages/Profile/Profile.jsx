import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { deleteUser } from "firebase/auth";

// 👇 지저분한 임포트 대신 바렐 패턴과 절대 경로(@)로 훅/유틸 싹쓸이!
import { auth, db } from "@/firebase/firebase";
import { useAuth, useOverwatch } from "@/hooks";
import { isValidBattletag } from "@/utils";

import "./Profile.css";

export default function Profile() {
  const { uid: urlUid } = useParams();
  const navigate = useNavigate();

  // ✨ 1. 길었던 로그인 코드가 단 두 줄로 끝납니다.
  const { user, isAuthLoading, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);

  const [targetUserData, setTargetUserData] = useState(null);
  const [isMe, setIsMe] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [battletagInput, setBattletagInput] = useState("");
  const [userReportCount, setUserReportCount] = useState(0);

  // ✨ 2. 유저 정보 세팅 로직 (인증이 끝난 후 실행)
  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const fetchTargetData = async () => {
      const myUid = user.uid || user.id;
      const targetUid = urlUid || myUid;
      setIsMe(myUid === targetUid);

      try {
        const targetRef = doc(db, "users", targetUid);
        const targetSnap = await getDoc(targetRef);

        if (targetSnap.exists()) {
          const data = targetSnap.data();
          setTargetUserData(data);

          if (myUid === targetUid) {
            setEditUsername(data.username || "");
            setBattletagInput(data.battletag || "");
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
    };

    fetchTargetData();
  }, [user, isAuthLoading, urlUid, navigate]);

  // ✨ 3. 오버워치 API 코드는 훅 하나로 종결!
  const { owData, apiLoading, apiError } = useOverwatch(targetUserData?.battletag);

  const handleSave = async () => {
    if (!editUsername.trim()) {
      alert("유저네임을 입력해 주세요.");
      return;
    }

    // ✨ 4. 정규식 덩어리 대신 깔끔한 유틸리티 함수 사용!
    if (battletagInput.trim() && !isValidBattletag(battletagInput)) {
      alert("올바른 배틀태그 형식이 아닙니다. (예: 비매너유저#1234)");
      return;
    }

    try {
      const myUid = user.uid || user.id;
      let finalPhotoUrl = targetUserData?.photoUrl; // 현재 타겟 데이터 기반으로 수정

      if (!finalPhotoUrl || finalPhotoUrl.includes("ui-avatars.com")) {
        finalPhotoUrl = `https://ui-avatars.com/api/?name=${editUsername}&background=random&color=fff`;
      }

      await setDoc(doc(db, "users", myUid), {
        username: editUsername,
        photoUrl: finalPhotoUrl,
        battletag: battletagInput.trim()
      }, { merge: true });

      alert("프로필이 성공적으로 업데이트되었습니다! ✨");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "정말로 탈퇴하시겠습니까? \n모든 프로필 정보가 영구적으로 삭제되며 되돌릴 수 없습니다."
    );
    if (!confirmDelete) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("유저 정보를 찾을 수 없습니다.");

      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteUser(currentUser);
      localStorage.removeItem("user");

      alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
      navigate("/");
    } catch (error) {
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

  if (loading || isAuthLoading) return <div className="profile-loading">데이터를 불러오는 중...</div>;
  if (!targetUserData) return null;

  const displayPhoto = targetUserData.photoUrl || `https://ui-avatars.com/api/?name=${targetUserData.username || "유저"}&background=random&color=fff`;

  // UI (return 문) 부분은 기존 코드와 완벽하게 동일하므로 그대로 유지됩니다!
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

        {targetUserData.battletag && (
          <div className="profile-section ow-api-section">
            <h3 className="section-title">🎮 오버워치 연동 정보</h3>
            {apiLoading && <p className="ow-api-loading">데이터를 불러오는 중...</p>}
            {!apiLoading && apiError && <p className="ow-api-error">🚨 {apiError}</p>}
            {!apiLoading && owData && (
              <div className="ow-api-info-container">
                <img src={owData.avatar} alt="ow-avatar" className="ow-api-avatar" />
                <div className="ow-api-text-wrap">
                  <h4 className="ow-api-username">{owData.username}</h4>
                  <p className="ow-api-title">{owData.title || "칭호 없음"}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {isMe && (
          <div className="profile-section section-me">
            <h3 className="section-title">⚙️ 내 프로필 설정</h3>
            <label className="profile-label">유저네임</label>
            <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="profile-input profile-username-input" placeholder="변경할 닉네임을 입력하세요" />
            <label className="profile-label">오버워치 배틀태그 (선택)</label>
            <input type="text" value={battletagInput} onChange={(e) => setBattletagInput(e.target.value)} className="profile-input profile-battletag-input" placeholder="배틀태그 입력" />
            <p className="profile-tip battletag-tip">💡 프로필이 공개된 배틀태그만 연동됩니다.</p>
            <button onClick={handleSave} className="btn-save btn-profile-save">변경사항 저장</button>
            <div className="danger-zone">
              <button onClick={handleDeleteAccount} className="btn-delete-account">회원 탈퇴</button>
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
            {!targetUserData.battletag && (
              <div className="coming-soon-box">
                <span className="coming-soon-icon">🎮</span>
                <p>오버워치 전적 비공개 또는 미연동 계정입니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}