// src/pages/Home/Home.jsx
import { useAuth, useSearch, useStats } from "@/hooks";
import { SearchForm, SearchResult, HomeMenu, HomeStats } from "@/components"; // ✨ 4개의 부품을 한 번에 가져옴!
import './Home.css';

export function Home() {
  // 1. 필요한 주방 도구(Hook)들 가져오기
  const { user, userName, isAdmin, handleLogout } = useAuth();
  const { searchQuery, setSearchQuery, searchResult, isSearching, executeSearch, searchedTag, searchError } = useSearch();
  const { reportCount, battleTagCount } = useStats();

  // 2. 뼈대 조립하기 (엄청나게 깔끔해짐!)
  return (
    <div className="home-wrapper">
      <div className="home-box">
        {/* 상단 타이틀 */}
        <h1 className="home-title">OW Watch</h1>
        <p className="home-subtitle">오버워치 커뮤니티 신고 플랫폼</p>

        {/* 검색 구역 */}
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          executeSearch={executeSearch}
          isSearching={isSearching}
        />
        <SearchResult
          searchResult={searchResult}
          searchedTag={searchedTag}
          searchError={searchError}
        />

        {/* 유저 메뉴 구역 */}
        <HomeMenu
          user={user}
          userName={userName}
          isAdmin={isAdmin}
          handleLogout={handleLogout}
        />

        {/* 하단 통계 구역 */}
        <HomeStats
          reportCount={reportCount}
          battleTagCount={battleTagCount}
        />
      </div>
    </div>
  );
}