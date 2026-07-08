/* src/hooks/useDashboardSummary.js */

import { useMemo } from "react";

export function useDashboardSummary(owStats, currentStats) {
  return useMemo(() => {
    // 1. 프로필 공개 여부 체크
    const hasCompetitive =
      owStats?.competitive && Object.keys(owStats.competitive).length > 0;
    const hasQuickplay =
      owStats?.quickplay && Object.keys(owStats.quickplay).length > 0;
    const isPublic = hasCompetitive || hasQuickplay;

    // 2. 종합 스탯 계산
    const generalStats = currentStats?.general || {};
    const gamesPlayed = generalStats.games_played || 0;
    const gamesWon = generalStats.games_won || 0;
    const winRate =
      gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
    const kda = generalStats.kda || 0;

    return {
      isPublic,
      gamesPlayed,
      gamesWon,
      winRate,
      kda,
    };
  }, [owStats, currentStats]); // 데이터가 바뀔 때만 재계산
}
