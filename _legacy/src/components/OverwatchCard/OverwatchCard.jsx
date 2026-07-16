/* src/components/OverwatchCard/OverwatchCard.jsx */

import { useOverwatch } from "@/hooks";
import "./OverwatchCard.css";

export function OverwatchCard({ battletag }) {
  const { owData, owStats, heroImages, apiLoading, apiError } =
    useOverwatch(battletag);

  if (!battletag) return null;

  const hasCompetitive =
    owStats?.competitive && Object.keys(owStats.competitive).length > 0;
  const hasQuickplay =
    owStats?.quickplay && Object.keys(owStats.quickplay).length > 0;
  const isPublic = hasCompetitive || hasQuickplay;

  // ✨ 마이페이지는 무조건 '이번 시즌 경쟁전' 우선! (경쟁전을 아예 안 했으면 빠대)
  const currentStats = hasCompetitive
    ? owStats.competitive
    : owStats?.quickplay;

  // ✨ 현재 띄워주는 데이터가 경쟁전인지 여부를 저장해둡니다.
  const isShowingComp = hasCompetitive;

  let topHeroes = [];

  if (currentStats && currentStats.heroes) {
    const heroesArray = Object.entries(currentStats.heroes).map(
      ([heroName, stats]) => ({
        hero: heroName,
        value: stats.time_played || 0,
      }),
    );
    heroesArray.sort((a, b) => b.value - a.value);
    topHeroes = heroesArray.slice(0, 3);
  }

  // ✨ 0시간 문제 해결: 1시간 미만이면 분 단위로, 그 이상이면 시간 단위로!
  const formatPlayTime = (seconds) => {
    if (seconds < 3600) {
      return `${Math.round(seconds / 60)}분`;
    }
    return `${Math.round(seconds / 3600)}시간`;
  };

  return (
    <div
      className="ow-api-section"
      style={
        owData?.namecard
          ? {
              backgroundImage: `linear-gradient(to right, rgba(33, 37, 48, 0.95) 40%, rgba(33, 37, 48, 0.5) 100%), url(${owData.namecard})`,
              backgroundSize: "cover",
              backgroundPosition: "right center",
            }
          : {}
      }
    >
      <div className="ow-section-header">
        <h3 className="ow-section-title">🎮 오버워치 연동 정보</h3>
      </div>

      {apiLoading && <p className="ow-api-loading">데이터를 불러오는 중...</p>}
      {!apiLoading && apiError && <p className="ow-api-error">🚨 {apiError}</p>}

      {!apiLoading && owData && (
        <div className="ow-api-info-wrapper">
          <div className="ow-api-info-container">
            <div className="ow-profile-left">
              <div className="ow-avatar-wrapper">
                <img
                  src={owData.avatar}
                  alt="ow-avatar"
                  className="ow-api-avatar"
                />
              </div>

              <div className="ow-api-text-wrap">
                {/* ✨ isPublic이 '거짓(비공개)'일 때만 뱃지가 렌더링되도록 수정! */}
                {!isPublic && (
                  <div className="ow-status-row">
                    <span className="ow-badge private">🔒 비공개 프로필</span>
                  </div>
                )}
                <div className="ow-name-row">
                  <h4 className="ow-api-username">{owData.username}</h4>
                  {owData.endorsement && (
                    <div
                      className="ow-endorsement-inline"
                      title={`추천 레벨 ${owData.endorsement.level}`}
                    >
                      <img
                        src={owData.endorsement.frame}
                        alt="frame"
                        className="ow-endorsement-frame"
                      />
                      <span className="ow-endorsement-level">
                        {owData.endorsement.level}
                      </span>
                    </div>
                  )}
                </div>
                <p className="ow-api-title">{owData.title || "칭호 없음"}</p>
              </div>
            </div>

            {owData.competitive?.pc &&
              Object.keys(owData.competitive.pc).length > 0 && (
                <div className="ow-tier-right">
                  {Object.entries(owData.competitive.pc).map(([role, data]) => {
                    if (!data || !data.division) return null;
                    return (
                      <div key={role} className="ow-tier-badge">
                        <div className="ow-tier-icon-group">
                          <img
                            src={data.role_icon}
                            alt={role}
                            className="ow-role-icon"
                          />
                          <img
                            src={data.rank_icon}
                            alt="rank"
                            className="ow-rank-icon"
                          />
                        </div>
                        <span className="ow-tier-text">
                          {data.division.toUpperCase()} {data.tier}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>

          {topHeroes.length > 0 && (
            <div className="ow-most-heroes-section">
              {/* ✨ 고정되어 있던 글씨 대신, 조건에 따라 타이틀이 바뀝니다! */}
              <div className="most-heroes-title">
                {isShowingComp ? "🏆 이번 시즌 경쟁전" : "⚡ 빠른 대전 기록"}{" "}
                모스트 3
              </div>
              <div className="most-heroes-list">
                {topHeroes.map((hero) => (
                  <div key={hero.hero} className="most-hero-item">
                    <div className="most-hero-portrait">
                      {heroImages && heroImages[hero.hero] ? (
                        <img
                          src={heroImages[hero.hero]}
                          alt={hero.hero}
                          title={hero.hero.toUpperCase()}
                          className="ow-hero-img"
                        />
                      ) : (
                        hero.hero.toUpperCase()
                      )}
                    </div>
                    {/* ✨ '0시간' 문제 해결: 1시간 미만은 n분, 1시간 이상은 n시간 표기 */}
                    <span className="most-hero-time">
                      {formatPlayTime(hero.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
