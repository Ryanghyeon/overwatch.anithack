import { Link } from "react-router-dom";
import { useAuth, useSearch, useStats } from "@/hooks";
import './Home.css';

export default function Home() {
  const { user, userName, isAdmin, handleLogout } = useAuth();
  const { searchQuery, setSearchQuery, searchResult, isSearching, executeSearch } = useSearch();
  const { reportCount, battleTagCount } = useStats();

  return (
    <div className="home-wrapper">
      <div className="home-box">
        {/* 타이틀을 일반 텍스트로 안전하게 변경! */}
        <h1 className="home-title">OW Watch</h1>
        <p className="home-subtitle">오버워치 커뮤니티 신고 플랫폼</p>

        {/* 검색 폼 */}
        <form onSubmit={executeSearch} className="search-form">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="배틀태그 검색 (예: 트레이서#1234)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-search" disabled={isSearching}>
              {isSearching ? "🔍" : "검색"}
            </button>
          </div>
        </form>

        {/* 검색 결과 창 */}
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
                  <span className="danger-count"> {searchResult.reportCount}번</span> 신고되었습니다!
                </p>
                <button className="btn-go-detail" onClick={() => alert("상세 신고 기록실 타임라인은 업데이트 예정입니다!")}>
                  🔍 상세 전과 기록 보기
                </button>
              </div>
            )}
          </div>
        )}

        {/* 로그인 메뉴 */}
        {!user ? (
          <div className="menu-buttons" style={{ marginTop: "30px" }}>
            <Link to="/login" className="btn-action">로그인</Link>
            <Link to="/ranking" className="btn-action">🏆 신고 랭킹</Link>
          </div>
        ) : (
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

            {/* ✨ 여기가 핵심! 널브러진 버튼들을 박스 안에 세로로 정렬 */}
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
        )}

        {/* 통계 창 */}
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-label">누적 신고</div>
            <div className="stat-value">{reportCount}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">누적 배틀태그</div>
            <div className="stat-value">{battleTagCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}