// src/hooks/useAuthListener.ts

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
// import { auth } from '@/firebase/firebase';
// import { onAuthStateChanged } from 'firebase/auth';

// 앱이 켜질 때 딱 한 번 실행되어,
// 유저의 세션(Firebase, Discord)이 살아있는지 확인하고 지갑(Zustand)을 업데이트하는 전역 문지기
export const useAuthListener = () => {
  const { setAuth } = useAuthStore(); // setAuthLoading은 당장 사용하는 변수가 아니므로 현 단계에선 제거함
  // const { setAuth, setAuthLoading } = useAuthStore();

  useEffect(() => {
    // 나중에 주석 해제할 실제 Firebase + Discord 복합 인증 로직:
    /*
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // 1. 파이어베이스 이메일 로그인 유저인 경우
        setAuth(firebaseUser.uid);
      } else {
        // 2. 파이어베이스에 없으면, 로컬스토리지(디스코드 로그인) 확인
        const discordUserStr = localStorage.getItem("user");
        if (discordUserStr) {
          const parsedUser = JSON.parse(discordUserStr);
          setAuth(parsedUser.id || parsedUser.uid);
        } else {
          // 3. 둘 다 없으면 완벽한 로그아웃 상태
          setAuth(null);
        }
      }
    });
    return () => unsubscribe();
    */

    // [note] 당장은 Firebase가 없으니, 1초 뒤에 '로그아웃 상태'로 판정하는 Mock 딜레이를 줍니다.
    // (만약 새로고침 시 로그인 유지 테스트를 하고 싶다면 아래를 true로, setAuth에 'mock-uid-123'을 넣으세요)
    const timer = setTimeout(() => {
      setAuth(null); // 지갑 비우고 로딩(isAuthLoading) 끝냄
    }, 1000);

    return () => clearTimeout(timer);
  }, [setAuth]);
};
