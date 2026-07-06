import { Link } from "react-router-dom";
// 👇 파이어베이스 임포트 없이 훅 하나로 깔끔하게 데이터 로드
import { useRanking } from "@/hooks";
import './Ranking.css';

export function Ranking() {
  // 상태와 데이터를 훅에서 쏙 빼옵니다.
  const { ranking, isLoading } = useRanking();

  return (
    <div className="ranking-wrapper">
      <div className="ranking-header">
        <h1 className="ranking-title">🏆 신고 랭킹</h1>
        <p className="ranking-subtitle">가장 많이 신고된 배틀태그 순위</p>

        <Link to="/">
          <button className="btn-home">← 홈으로</button>
        </Link>
      </div>

      <div className="ranking-list">
        {/* 로딩 중일 때 텅 빈 화면 대신 안내 문구 표시 */}
        {isLoading ? (
          <div className="loading-text">랭킹 데이터를 불러오는 중입니다...</div>
        ) : (
          ranking.map((player, index) => (
            <div key={player.id} className="ranking-card">
              <div className="ranking-medal">
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
                {index > 2 && `#${index + 1}`}
              </div>

              <div className="ranking-info">
                <h2 className="battletag-name">{player.battletag}</h2>
                {/* ✨ 예외 처리 우회 코드를 다 지우고 reportCount로 다이렉트 연결! */}
                <p className="report-count">🚨 신고 {player.reportCount}회</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}