// src/hooks/useMyReports.js
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export function useMyReports(user, isAuthLoading) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 유저 정보가 아직 로딩 중이거나 로그인이 안 되어있으면 쿼리를 실행하지 않음
        if (isAuthLoading || !user) {
            if (!isAuthLoading && !user) setLoading(false);
            return;
        }

        const fetchMyReports = async () => {
            try {
                const q = query(
                    collection(db, "reports"),
                    where("reporterUid", "==", user.uid || user.id)
                );

                const querySnapshot = await getDocs(q);
                const fetchedReports = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // 최신순 정렬
                fetchedReports.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
                setReports(fetchedReports);
            } catch (error) {
                console.error("신고 내역 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyReports();
    }, [user, isAuthLoading]);

    return { reports, loading };
}