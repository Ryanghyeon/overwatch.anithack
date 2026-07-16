/* src/hooks/useReport.js */

// 신고 기능을 위한 커스텀 훅

import { useState } from "react";
import { db } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { isValidBattletag, textSanitizer } from "@/utils";

export function useReport(user) {
  const navigate = useNavigate();
  const [battleTag, setBattleTag] = useState("");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 따닥(중복 클릭) 방지용

  const submitReport = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!battleTag.trim()) {
      alert("배틀태그를 입력해 주세요.");
      return;
    }

    if (!isValidBattletag(battleTag)) {
      alert("올바른 배틀태그 형식이 아닙니다. (예: 비매너유저#12345)");
      return;
    }

    if (!reason) {
      alert("신고 사유를 선택해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 중복 신고 검사
      const reportQuery = query(
        collection(db, "reports"),
        where("reporterUid", "==", user.uid || user.id),
        where("battletag", "==", battleTag),
      );
      const existingReports = await getDocs(reportQuery);
      if (!existingReports.empty) {
        alert("이미 신고한 배틀태그입니다.");
        setIsSubmitting(false);
        return;
      }

      //텍스트소독기
      const safeDetails = textSanitizer(details);

      // 파이어베이스에 신고 내역 추가
      await addDoc(collection(db, "reports"), {
        battletag: battleTag,
        reason: reason,
        details: safeDetails,
        reporterUid: user.uid || user.id,
        createdAt: new Date(),
      });

      // 3. 배틀태그 누적 카운트 업데이트
      const battletagRef = doc(db, "battletags", battleTag);
      const battletagSnap = await getDoc(battletagRef);

      if (!battletagSnap.exists()) {
        await setDoc(battletagRef, {
          battletag: battleTag,
          count: 1,
          lastReportedAt: new Date(),
        });
      } else {
        await updateDoc(battletagRef, {
          count: increment(1),
          lastReportedAt: new Date(),
        });
      }

      alert(`${battleTag} 신고가 접수되었습니다.`);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("신고 접수 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    battleTag,
    setBattleTag,
    reason,
    setReason,
    details,
    setDetails,
    submitReport,
    isSubmitting,
  };
}
