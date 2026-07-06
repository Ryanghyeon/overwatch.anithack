import { useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export function useStats() {
    const [reportCount, setReportCount] = useState(0);
    const [battleTagCount, setBattleTagCount] = useState(0);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const reportsSnapshot = await getDocs(collection(db, "reports"));
                const battletagsSnapshot = await getDocs(collection(db, "battletags"));
                setReportCount(reportsSnapshot.size);
                setBattleTagCount(battletagsSnapshot.size);
            } catch (error) {
                console.error("통계 로딩 에러:", error);
            }
        };
        loadStats();
    }, []);

    return { reportCount, battleTagCount };
}