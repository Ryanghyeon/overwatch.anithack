import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import { Layout, LoadingFallback } from '@/components';
import {
  Home,
  Login,
  Register,
  Report,
  Ranking,
  MyPage,
  Admin,
} from './lazyPages';

// 헬퍼 함수: 라우터 진입 시 발생하는 Suspense 보일러플레이트 제거
const withLoading = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

/*
 <새로운 페이지 추가 가이드>
 1. src/pages/[PageName] 디렉토리 및 컴포넌트 생성
 2. src/router/lazyPages.ts에 lazyImport를 활용해 컴포넌트 내보내기 (청크 분할 목적)
 3. 아래 router 배열의 children에 { path, element: withLoading(컴포넌트) } 추가
 */

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // 모든 페이지는 반드시 이 Layout(헤더/푸터)을 통과함
    children: [
      // 기존의 평면적인 라우트 구조가 중첩 라우팅(Nested Routing)으로 개선됨
      { index: true, element: withLoading(Home) },
      { path: 'login', element: withLoading(Login) },
      { path: 'register', element: withLoading(Register) },
      { path: 'report', element: withLoading(Report) },
      { path: 'ranking', element: withLoading(Ranking) },
      { path: 'mypage', element: withLoading(MyPage) },
      { path: 'admin', element: withLoading(Admin) },
      // {path: 'path', element: withLoading(component) }.
    ],
  },
]);
