/* src/hooks/useRanking.ts */

import { useState, useEffect } from 'react';

// 랭킹 데이터 스펙(인터페이스) 정의
export interface RankingData {
  id: string;
  battletag: string;
  reportCount: number;
}

export const useRanking = () => {
  const [ranking, setRanking] = useState<RankingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Phase 5에서 React Query + Firebase 로직으로 대체될 Mock 데이터입니다.
    const fetchRanking = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setRanking([
          { id: '1', battletag: 'Hacker#1234', reportCount: 152 },
          { id: '2', battletag: 'TrollUser#999', reportCount: 89 },
          { id: '3', battletag: 'ToxicPlayer#555', reportCount: 45 },
          { id: '4', battletag: 'AimbotGod#111', reportCount: 30 },
          { id: '5', battletag: 'Thrower#777', reportCount: 12 },
        ]);
        setIsLoading(false);
      }, 1000); // 1초 로딩 딜레이 (파이어베이스 연동시 삭제)
    };

    fetchRanking();
  }, []);

  return { ranking, isLoading };
};
