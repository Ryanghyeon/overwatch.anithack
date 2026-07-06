// src/components/HomeMenu/HomeMenu.jsx
import { Link } from "react-router-dom";

export function HomeMenu({ user, userName, isAdmin, handleLogout }) {
    // 1. 비로그인 상태일 때
    if (!user) {
        return (
            <div className="menu-buttons" style={{ marginTop: "30px" }}>
                <Link to="/login" className="btn-action">로그인</Link>
                <Link to="/ranking" className="btn-action">🏆 신고 랭킹</Link>
            </div>
        );
    }

    // 2. 로그인 상태일 때 (유저 or 관리자)
    return (
        <div className="user-menu" style={{ marginTop: "30px" }}>
            {isAdmin ? (
                <div className="admin-greeting">
                    <span className="admin-badge">👑</span>
                    <span className="admin-nickname">{userName}</span> 관리자 계정 작동 중
                </div>
            ) : (
                <div className="user-greeting">
                    반갑습니다, <span className="user-nickname">{userName}</span> 님!
                </div>
            )}

            <div className="menu-buttons">
                <Link to="/report" className="btn-action highlight">🚨 신고하기</Link>
                <Link to="/ranking" className="btn-action">🏆 신고 랭킹</Link>
                <Link to="/Profile" className="btn-action">⚙️ 내 프로필 설정</Link>

                {isAdmin && (
                    <Link to="/admin" className="btn-action admin-btn">🛠 관리자 대시보드</Link>
                )}

                <button className="btn-action outline" onClick={handleLogout}>로그아웃</button>
            </div>
        </div>
    );
}