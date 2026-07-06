import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, deleteUser } from "firebase/auth";
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

  // ✨ API 전용 State 추가
  const [owData, setOwData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [battletagInput, setBattletagInput] = useState("");

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
            setBattletagInput(data.battletag || ""); // 저장된 배틀태그가 있으면 인풋에 넣기
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

  // ✨ API: 대상 유저의 DB에 'battletag'가 있을 경우 자동으로 정보 가져오기
  useEffect(() => {
    if (!targetUserData || !targetUserData.battletag) return;

    const fetchOwData = async () => {
      setApiLoading(true);
      setApiError(null);
      const formattedTag = targetUserData.battletag.replace("#", "-");
      try {
        const res = await fetch(`https://overfast-api.tekrop.fr/players/${formattedTag}/summary`);
        if (!res.ok) throw new Error("비공개 프로필이거나 존재하지 않는 계정입니다.");
        const data = await res.json();
        setOwData(data);
      } catch (err) {
        setApiError(err.message);
      } finally {
        setApiLoading(false);
      }
    };
    fetchOwData();
  }, [targetUserData]);


  // 프로필(유저네임 및 배틀태그) 일괄 저장
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
        battletag: battletagInput.trim() // ✨ 배틀태그도 DB에 함께 저장!
      }, { merge: true });

      alert("프로필이 성공적으로 업데이트되었습니다! ✨");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    // ... (기존 회원 탈퇴 로직 동일)
    const confirmDelete = window.confirm(
      "정말로 탈퇴하시겠습니까? \n모든 프로필 정보가 영구적으로 삭제되며 되돌릴 수 없습니다."
    );
    if (!confirmDelete) return;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("유저 정보를 찾을 수 없습니다.");

      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
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

        {/* ✨ 오버워치 API 전적 카드 (나/타인 상관없이 DB에 배틀태그가 있으면 보여줌) */}
        {targetUserData.battletag && (
          <div className="profile-section ow-api-section" style={{ background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
            <h3 className="section-title" style={{ margin: "0 0 15px 0" }}>🎮 오버워치 연동 정보</h3>
            
            {apiLoading && <p>데이터를 불러오는 중...</p>}
            
            {!apiLoading && apiError && (
              <p style={{ color: "#ff4d4d", fontSize: "14px" }}>🚨 {apiError}</p>
            )}

            {!apiLoading && owData && (
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <img src={owData.avatar} alt="ow-avatar" style={{ width: "60px", borderRadius: "10px" }} />
                <div>
                  <h4 style={{ margin: "0", color: "#fff" }}>{owData.username}</h4>
                  <p style={{ margin: "5px 0 0 0", color: "#aaa", fontSize: "14px" }}>{owData.title || "칭호 없음"}</p>
                </div>
              </div>
            )}
          </div>
        )}

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
              style={{ marginBottom: "15px" }}
            />
            
            {/* ✨ 배틀태그 입력칸 추가 */}
            <label className="profile-label">오버워치 배틀태그 (선택)</label>
            <input
              type="text"
              value={battletagInput}
              onChange={(e) => setBattletagInput(e.target.value)}
              className="profile-input"
              placeholder="배틀태그 입력"
            />
            <p className="profile-tip" style={{ marginTop: "5px" }}>
              💡 프로필 설정이 공개된 배틀태그만 연동됩니다. (샵(#) 포함)
            </p>

            <button onClick={handleSave} className="btn-save" style={{ marginTop: "15px" }}>
              변경사항 저장
            </button>

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
            
            {/* 배틀태그가 없으면 기존의 coming-soon 박스 보여주기 */}
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