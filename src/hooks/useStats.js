/* src/hooks/useStats.js */

import { useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export function useStats() {
  const [reportCount, setReportCount] = useState(0);
  const [battleTagCount, setBattleTagCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // ✨ reports는 건드리지 않고, battletags만 가져옵니다!
        const battletagsSnapshot = await getDocs(collection(db, "battletags"));

        // 1. 누적 배틀태그 수 = battletags 문서의 총 개수
        setBattleTagCount(battletagsSnapshot.size);

        // 2. 누적 신고 수 = battletags 안에 있는 count 필드를 싹 다 더함!
        let totalReports = 0;
        battletagsSnapshot.forEach((doc) => {
          totalReports += doc.data().count || 0;
        });

        setReportCount(totalReports);
      } catch (error) {
        console.error("통계 로딩 에러:", error);
      }
    };
    loadStats();
  }, []);

  return { reportCount, battleTagCount };
}
