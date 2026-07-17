// src/hooks/queries/useAuthMutations.ts

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store';

// import { auth } from '@/firebase/firebase';
// import { signInWithEmailAndPassword, signInWithCustomToken } from 'firebase/auth';

// Repository: 이메일 로그인 API
const loginWithEmailAPI = async ({
  email,
  password,
}: Record<string, string>) => {
  /*
  // 나중에 이식할 실제 Firebase 로직:
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
  */

  // [note] 당장은 Firebase 셋업이 안 되어 있으니 Mock(가짜) 딜레이를 줍니다.
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (email === 'admin@test.com' && password === '1234') {
    return { uid: 'mock-uid-123', email };
  }
  throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.'); // 에러 발생 테스트용
};

// Custom Mutation Hook: 이메일 로그인
export const useEmailLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginWithEmailAPI,

    // 로그인 성공 시 (YAGNI: 더 이상 수동으로 상태 안 바꿔도 됨)
    onSuccess: (data) => {
      console.log('로그인 성공!', data);
      navigate('/'); // 메인 화면으로 이동
    },

    // 로그인 실패 시
    onError: (error) => {
      console.error('로그인 실패:', error.message);
      // alert(error.message); // 필요하다면 토스트 메시지나 alert 호출
    },
  });
};

// 디스코드 로그인 핸들러
export const handleDiscordLogin = () => {
  window.location.href = '/api/auth/discord';
};

// Custom Mutation Hook: Logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout: clearAuthStore } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      // 실제 파이어베이스 로직: await auth.signOut
      await new Promise((resolve) => setTimeout(resolve, 500)); // Mock Delay
      localStorage.removeItem('user');
    },

    // 로그아웃 성공 시 잔여 상태 청소
    onSuccess: () => {
      clearAuthStore(); // Zustand 비우기
      queryClient.clear(); // React Query에 남아있는 캐시 강제 소각
      navigate('/login', { replace: true }); // 뒤로가기 못하게 막고 로그인 페이지로 이동
    },
  });
};
