import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function MyPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. 화면이 켜지면 내 기존 프로필 정보 불러오기
  useEffect(() => {
    const fetchMyProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setNickname(userSnap.data().nickname || "");
          setPhotoUrl(userSnap.data().photoUrl || "https://cdn.discordapp.com/embed/avatars/0.png");
        }
      } catch (error) {
        console.error("프로필 불러오기 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProfile();
  }, [navigate]);

  // 2. 수정 완료 버튼 누르면 DB 업데이트!
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!nickname.trim()) {
      alert("닉네임을 입력해 주세요.");
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        nickname: nickname,
        photoUrl: photoUrl,
      });

      alert("프로필이 성공적으로 업데이트되었습니다! ✨");
      navigate("/"); // 홈으로 돌아가기
    } catch (error) {
      console.error(error);
      alert("프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>로딩 중...</div>;

  return (
    <div className="mypage-wrapper">
      <div className="mypage-box">
        <button className="btn-back" onClick={() => navigate(-1)}>⬅ 뒤로 가기</button>
        
        <h1 className="mypage-title">⚙️ 내 프로필 설정</h1>

        {/* 동그란 프로필 사진 미리보기 */}
        <div className="profile-preview-container">
          <img 
            src={photoUrl || "https://cdn.discordapp.com/embed/avatars/0.png"} 
            alt="프로필 미리보기" 
            className="profile-preview-img"
            onError={(e) => e.target.src = "https://cdn.discordapp.com/embed/avatars/0.png"} // 링크 깨졌을 때 방어
          />
        </div>

        <label className="mypage-label">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mypage-input"
          placeholder="새로운 닉네임 입력"
        />

        <label className="mypage-label">프로필 사진 (이미지 주소 URL)</label>
        <input
          type="text"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          className="mypage-input"
          placeholder="https://..."
        />
        <p className="mypage-tip">💡 팁: 웹상의 이미지 우클릭 후 '이미지 주소 복사'를 붙여넣으세요!</p>

        <button onClick={handleSave} className="btn-save">
          변경사항 저장하기
        </button>
      </div>
    </div>
  );
}