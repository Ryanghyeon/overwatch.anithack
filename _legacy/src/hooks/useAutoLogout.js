/* src/hooks/useAutoLogout.js */

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
    };

    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
    ];

    // 1. 이벤트 리스너 등록
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // 2. 초기 타이머 시작
    resetTimer();

    // 3. 올바른 형태의 Cleanup 함수 반환 (에러 해결 핵심)
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);
}
