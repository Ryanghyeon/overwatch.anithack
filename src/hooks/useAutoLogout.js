/* src/hooks/useAutoLogout.js */

// 자동 로그아웃 훅

import { useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";

export function useAutoLogout() {
  useEffect(() => {
    let inactivityTimer;

    const performLogout = async () => {
      if (auth.currentUser) {
        try {
          await signOut(auth);
          alert("장시간 움직임이 없어 자동 로그아웃 되었습니다.");
          window.location.href = "/login";
        } catch (error) {
          console.error("자동 로그아웃 실패:", error);
        }
      }
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(performLogout, 30 * 60 * 1000); // 30분 타이머
      // 테스트용 타이머 5초
      // inactivityTimer = setTimeout(performLogout, 5000);
    };

    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
    ];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);
}
