/* src/hooks/useAuthListener.ts */

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { auth } from '@/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuthListener = () => {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    // Firebase 인증 상태 변경을 실시간 감시 (Observer 패턴)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // 파이어베이스 이메일 로그인 유저인 경우 UID를 스토어에 꽂음
        setAuth(firebaseUser.uid);
      } else {
        // 파이어베이스에 없으면, 로컬스토리지(디스코드 로그인) 확인
        const discordUserStr = localStorage.getItem('user');
        if (discordUserStr) {
          try {
            const parsedUser = JSON.parse(discordUserStr);
            setAuth(parsedUser.id || parsedUser.uid);
          } catch (e) {
            console.error('Discord 세션 파싱 실패:', e);
            setAuth(null);
          }
        } else {
          // 둘 다 없으면 로그아웃 상태
          setAuth(null);
        }
      }
    });

    // 컴포넌트 언마운트 시 메모리 누수 방지 (구독 해제)
    return () => unsubscribe();
  }, [setAuth]);
};
