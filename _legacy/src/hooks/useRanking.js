/* src/hooks/useRanking.js */

import { useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export function useRanking() {
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const q = query(collection(db, "battletags"), orderBy("count", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // 🚨 핵심 수정 2: UI에서 편하게 쓰도록 DB의 count를 reportCount로 매핑해줍니다!
          reportCount: doc.data().count || 0,
        }));

        setRanking(data);
      } catch (error) {
        console.error("랭킹 로딩 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRanking();
  }, []);

  return { ranking, isLoading };
}
