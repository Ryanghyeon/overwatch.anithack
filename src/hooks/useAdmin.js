/* src/hooks/useAdmin.js */

// 관리자 전용 훅

import { useState, useEffect, useCallback } from "react";
import { db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  updateDoc,
} from "firebase/firestore";

export function useAdmin(isAdmin) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 관리자일 때만 데이터를 불러오도록 설정
  const loadReports = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    try {
      const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(data);
    } catch (error) {
      console.error("신고 내역 로딩 에러:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleDelete = async (reportId, targetBattletag) => {
    if (!window.confirm("정말로 이 신고 내역을 삭제하시겠습니까?")) return;

    try {
      // 1. 신고 내역 삭제
      await deleteDoc(doc(db, "reports", reportId));

      // 2. 랭킹(배틀태그) 카운트 차감 및 삭제 연동
      const q = query(
        collection(db, "battletags"),
        where("battletag", "==", targetBattletag),
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const tagDoc = snapshot.docs[0];
        const currentCount = tagDoc.data().count || 1;

        if (currentCount <= 1) {
          await deleteDoc(doc(db, "battletags", tagDoc.id));
        } else {
          await updateDoc(doc(db, "battletags", tagDoc.id), {
            count: currentCount - 1,
          });
        }
      }

      alert("삭제 완료 및 랭킹 데이터 동기화 성공!");
      loadReports(); // ✨ 삭제 후 리스트 새로고침
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return { reports, isLoading, handleDelete };
}
