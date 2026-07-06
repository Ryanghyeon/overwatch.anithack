import { useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export function useRanking() {
    const [ranking, setRanking] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadRanking = async () => {
            try {
                const q = query(collection(db, "battletags"), orderBy("reportCount", "desc"));
                const snapshot = await getDocs(q);

                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
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