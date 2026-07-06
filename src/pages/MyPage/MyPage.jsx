// src/pages/MyPage/MyPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import './MyPage.css'; // ✨ Home.css 대신 전용 CSS 연결!

export function MyPage() {
    const { user, userName } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="mypage-wrapper">
                <div className="mypage-box">
                    <h2>로그인이 필요한 페이지입니다.</h2>
                    <button className="btn-action highlight" onClick={() => navigate('/login')}>로그인 하러 가기</button>
                </div>
            </div>
        );
    }

    return (
        <div className="mypage-wrapper">
            {/* ✨ 클래스 이름들을 모두 mypage- 로 독립시켰습니다! */}
            <div className="mypage-box">
                <h1 className="mypage-title">My Page</h1>
                <p className="mypage-subtitle">{userName} 님의 전용 공간입니다</p>

                <div className="mypage-menu">
                    <Link to="/my-reports" className="btn-action highlight">📜 본인 신고 내역 보기</Link>
                    <Link to="/Profile" className="btn-action">⚙️ 내 프로필 설정</Link>

                    <button
                        className="btn-action outline"
                        style={{ marginTop: "20px" }}
                        onClick={() => navigate('/')}
                    >
                        🏠 홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}