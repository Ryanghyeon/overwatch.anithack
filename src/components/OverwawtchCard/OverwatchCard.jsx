// src/components/OverwatchCard/OverwatchCard.jsx
import { useNavigate } from "react-router-dom";
import { useOverwatch } from "@/hooks";
import './OverwatchCard.css';

export function OverwatchCard({ battletag }) {
    const { owData, owStats, heroImages, apiLoading, apiError } = useOverwatch(battletag);
    const navigate = useNavigate();

    if (!battletag) return null;

    const topHeroes = owStats?.heroes
        ? Object.entries(owStats.heroes)
            .map(([hero, stats]) => ({ hero, value: stats.time_played || 0 }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
        : [];

    const isPublic = owStats && Object.keys(owStats).length > 0;

    return (
        <div
            className="ow-api-section"
            style={owData?.namecard ? {
                backgroundImage: `linear-gradient(to right, rgba(33, 37, 48, 0.95) 40%, rgba(33, 37, 48, 0.5) 100%), url(${owData.namecard})`,
                backgroundSize: 'cover',
                backgroundPosition: 'right center'
            } : {}}
        >
            <div className="ow-section-header">
                <h3 className="ow-section-title">🎮 오버워치 연동 정보</h3>

                {isPublic && (
                    <button
                        className="btn-detail-stats"
                        onClick={() => navigate(`/ow-stats/${battletag.replace('#', '-')}`)}
                    >
                        상세 전적 📊
                    </button>
                )}
            </div>

            {apiLoading && <p className="ow-api-loading">데이터를 불러오는 중...</p>}
            {!apiLoading && apiError && <p className="ow-api-error">🚨 {apiError}</p>}

            {!apiLoading && owData && (
                <div className="ow-api-info-wrapper">

                    <div className="ow-api-info-container">
                        <div className="ow-profile-left">
                            <div className="ow-avatar-wrapper">
                                <img src={owData.avatar} alt="ow-avatar" className="ow-api-avatar" />
                            </div>

                            <div className="ow-api-text-wrap">
                                <div className="ow-status-row">
                                    {isPublic ? (
                                        <span className="ow-badge public">🔓 공개 프로필</span>
                                    ) : (
                                        <span className="ow-badge private">🔒 비공개 (상세불가)</span>
                                    )}
                                </div>
                                <div className="ow-name-row">
                                    <h4 className="ow-api-username">{owData.username}</h4>
                                    {owData.endorsement && (
                                        <div className="ow-endorsement-inline" title={`추천 레벨 ${owData.endorsement.level}`}>
                                            <img src={owData.endorsement.frame} alt="frame" className="ow-endorsement-frame" />
                                            <span className="ow-endorsement-level">{owData.endorsement.level}</span>
                                        </div>
                                    )}
                                </div>
                                <p className="ow-api-title">{owData.title || "칭호 없음"}</p>
                            </div>
                        </div>

                        {owData.competitive?.pc && Object.keys(owData.competitive.pc).length > 0 && (
                            <div className="ow-tier-right">
                                {Object.entries(owData.competitive.pc).map(([role, data]) => {
                                    if (!data || !data.division) return null;
                                    return (
                                        <div key={role} className="ow-tier-badge">
                                            <div className="ow-tier-icon-group">
                                                <img src={data.role_icon} alt={role} className="ow-role-icon" />
                                                <img src={data.rank_icon} alt="rank" className="ow-rank-icon" />
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
                            <div className="most-heroes-title">🔥 Most Top 3</div>
                            <div className="most-heroes-list">
                                {topHeroes.map((hero) => (
                                    <div key={hero.hero} className="most-hero-item">
                                        {/* ✨ 숫자 뱃지(most-hero-rank) 완전히 제거됨 */}
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
                                        <span className="most-hero-time">
                                            {Math.round(hero.value / 3600)} Hours
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