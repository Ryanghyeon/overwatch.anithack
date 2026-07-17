// src/hooks/queries/useUser.ts

import { useQuery } from '@tanstack/react-query';
// import { doc, getDoc } from 'firebase/firestore'; // (나중에 Firebase 연결 시 주석 해제)
// import { db } from '@/firebase/firebase';         // (나중에 Firebase 연결 시 주석 해제)
import { useAuthStore } from '@/store';
import type { User } from '@/types';

// Repository 계층 (순수 API 호출 로직)
// UI나 전역 상태와 완벽히 격되어 오직 데이터를 가져오는 역할만 수행

const fetchUserData = async (uid: string): Promise<User> => {
  /* 나중에 이식할 실제 Firebase 로직
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error('유저 정보가 없습니다.');
  const data = docSnap.data();
  return { ...data, createdAt: data.createdAt.toDate().toISOString() } as User;
  */

  // [note] 당장 Firebase 셋업이 안 되어 있으니,
  // 일단 화면 UI를 그리기 위한 Mock(가짜) 데이터를 뱉도록 해둡니다.
  return {
    uid,
    username: '테스트유저',
    photoUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
    role: 'user',
    battletag: '아키텍트#1234',
    createdAt: new Date().toISOString(),
  };
};

// Custom Query Hook (컴포넌트에서 꺼내 사용)

export const useUser = () => {
  // Zustand에서 현재 로그인한 유저의 uid만 받아옴
  const { uid } = useAuthStore();

  // uid를 바탕으로 React Query에 데이터 요청
  return useQuery<User, Error>({
    queryKey: ['user', uid], // 캐시 이름표 (이 uid의 데이터임을 명시)
    queryFn: () => fetchUserData(uid!),

    // [point] uid가 있을 때(로그인 상태)만 API를 찌릅니다.
    // 다시 말해 비로그인 상태면 불필요한 네트워크 낭비 원천 차단
    enabled: !!uid,

    // 가져온 데이터는 5분 동안 신선(stale)한 것으로 간주, 다시 API를 찌르지 않음 (YAGNI 최적화)
    staleTime: 1000 * 60 * 5,
  });
};
