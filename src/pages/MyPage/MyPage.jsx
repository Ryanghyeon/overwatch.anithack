/* src/pages/MyPage/MyPage.jsx */

import { Link, useNavigate } from "react-router-dom";
import { useAuth, useMyProfile } from "@/hooks"; // ✨ 새로 만든 훅 쏙!
import { OverwatchCard } from "@/components";
import "./MyPage.css";

// ✨ 1. 예외 화면(로딩, 비로그인)을 전담하는 미니 컴포넌트로 분리!
const MyPageFallback = ({ type, onLogin }) => (
  <div className="mypage-wrapper">
    <div className="mypage-box">
      {type === "loading" && (
        <h2 style={{ color: "white" }}>데이터를 불러오는 중... 🏃‍♂️💨</h2>
      )}
      {type === "no-auth" && (
        <>
          <h2>로그인이 필요한 페이지입니다.</h2>
          <button className="btn-action highlight" onClick={onLogin}>
            로그인 하러 가기
          </button>
        </>
      )}
    </div>
  </div>
);

export function MyPage() {
  const { user, userName } = useAuth();
  const navigate = useNavigate();

  // ✨ 2. 파이어베이스 통신 로직이 단 한 줄로 깔끔하게 압축되었습니다!
  const { myBattletag, profileLoading } = useMyProfile(user);

  // ✨ 3. 예외 상황 처리도 단 두 줄로 끝!
  if (!user)
    return <MyPageFallback type="no-auth" onLogin={() => navigate("/login")} />;
  if (profileLoading) return <MyPageFallback type="loading" />;

  // ✨ 4. 아래부터는 순수한 View 영역 (데이터를 어떻게 가져왔는지 알 필요 없이 예쁘게 그리기만 합니다)
  return (
    <div className="mypage-wrapper">
      <div className="mypage-box">
        <h1 className="mypage-title">My Page</h1>
        <p className="mypage-subtitle">{userName} 님의 전용 공간입니다</p>

        {/* 얇고 세련된 연동 상태 배너 */}
        <div className="ow-link-banner">
          <div className="ow-account-label">블리자드 연동 계정</div>
          <div className="ow-account-info">
            {myBattletag ? (
              <>
                <span className="ow-battletag">{myBattletag}</span>
                <span className="ow-status">✅ 연동됨</span>
              </>
            ) : (
              <>
                <span className="ow-battletag" style={{ color: "#7b8398" }}>
                  연동된 계정이 없습니다
                </span>
                <button
                  className="btn-action highlight small"
                  style={{
                    height: "32px",
                    width: "auto",
                    padding: "0 15px",
                    fontSize: "0.85rem",
                    margin: "0",
                  }}
                  onClick={() => navigate("/Profile")}
                >
                  연동하러 가기
                </button>
              </>
            )}
          </div>
        </div>

        {/* 오버워치 전적 카드 */}
        {myBattletag && <OverwatchCard battletag={myBattletag} />}

        {/* 하단 메뉴 */}
        <div className="mypage-menu">
          <Link to="/my-reports" className="btn-action highlight">
            📜 내 신고 내역 보기
          </Link>
          <Link to="/Profile" className="btn-action">
            ⚙️ 내 프로필 설정
          </Link>

          <button
            className="btn-action outline"
            style={{ marginTop: "20px" }}
            onClick={() => navigate("/")}
          >
            🏠 홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
