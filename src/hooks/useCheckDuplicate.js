/* src/hooks/useCheckDuplicate.js */

// 닉네임, 배틀태그 중복 체크를 위한 커스텀 훅

import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const useCheckDuplicate = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkUsername = async (username, currentUid = null) => {
    if (!username) return false;
    setIsChecking(true);
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return false;
      // 본인 닉네임이면 통과
      if (
        currentUid &&
        querySnapshot.docs.length === 1 &&
        querySnapshot.docs[0].id === currentUid
      )
        return false;

      return true; // 중복됨
    } catch (error) {
      console.error("유저네임 검사 에러:", error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const checkBattletag = async (battletag, currentUid = null) => {
    if (!battletag) return false;
    setIsChecking(true);
    try {
      const q = query(
        collection(db, "users"),
        where("battletag", "==", battletag),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return false;
      // 본인 배틀태그면 통과
      if (
        currentUid &&
        querySnapshot.docs.length === 1 &&
        querySnapshot.docs[0].id === currentUid
      )
        return false;

      return true; // 중복됨
    } catch (error) {
      console.error("배틀태그 검사 에러:", error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return { isChecking, checkUsername, checkBattletag };
};
