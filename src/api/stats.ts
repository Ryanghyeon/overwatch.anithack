/* src/api/stats.ts */

import {
  collection,
  getAggregateFromServer,
  sum,
  count,
} from 'firebase/firestore';
import { db } from '@/firebase/firebase';

// 주고받을 데이터 타입 정의
export interface HomeStatsData {
  reportCount: number;
  battleTagCount: number;
}

// Firestore에서 통계 데이터를 가져오는 역할만 하는 순수 비동기 함수
export const fetchHomeStats = async (): Promise<HomeStatsData> => {
  const battletagsRef = collection(db, 'battletags');

  // getDocs(레거시) 대신 getAggregateFromServer 사용
  // 서버에서 계산된 결과값(count, sum)만 1번의 읽기 비용으로 가져옴
  const snapshot = await getAggregateFromServer(battletagsRef, {
    totalBattleTags: count(),
    totalReports: sum('count'),
  });

  return {
    battleTagCount: snapshot.data().totalBattleTags,
    reportCount: snapshot.data().totalReports,
  };
};
