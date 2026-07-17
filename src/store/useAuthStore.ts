import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  uid: string | null;
  isAuthLoading: boolean; // 앱 초기 진입 시 Firebase 인증 상태를 기다리는 로딩

  // Actions (상태를 변경하는 함수들)
  setAuth: (uid: string | null) => void;
  setAuthLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  uid: null,
  isAuthLoading: true, // 처음 앱을 켜면 일단 로딩 상태로 시작

  // uid가 들어오면 자동으로 isLoggedIn을 true로 만듦 (!! 연산자 활용)
  setAuth: (uid) =>
    set({
      uid,
      isLoggedIn: !!uid,
      isAuthLoading: false,
    }),

  setAuthLoading: (isLoading) => set({ isAuthLoading: isLoading }),

  logout: () =>
    set({
      uid: null,
      isLoggedIn: false,
    }),
}));
