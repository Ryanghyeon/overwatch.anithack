// src/components/OverwatchCard/OverwatchCard.jsx
import { useNavigate } from "react-router-dom";
import { useOverwatch } from "@/hooks";
import './OverwatchCard.css';

export function OverwatchCard({ battletag }) {
    const { owData, apiLoading, apiError } = useOverwatch(battletag);
    const navigate = useNavigate();

    if (!battletag) return null;

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
                {owData && owData.privacy === "public" && (
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
                <div className="ow-api-info-container">

                    <div className="ow-profile-left">
                        {/* 1. 깔끔해진 아바타 영역 (추천 레벨 제거됨) */}
                        <div className="ow-avatar-wrapper">
                            <img src={owData.avatar} alt="ow-avatar" className="ow-api-avatar" />
                        </div>

                        <div className="ow-api-text-wrap">
                            {/* 2. 위쪽으로 올라간 공개/비공개 상태 뱃지 */}
                            <div className="ow-status-row">
                                {owData.privacy === "private" ? (
                                    <span className="ow-badge private">🔒 비공개 프로필</span>
                                ) : (
                                    <span className="ow-badge public">🔓 공개 프로필</span>
                                )}
                            </div>

                            {/* 3. 닉네임과 나란히 배치된 추천 레벨 */}
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

                    {/* 우측 영역은 동일하게 유지 */}
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
            )}
        </div>
    );
}