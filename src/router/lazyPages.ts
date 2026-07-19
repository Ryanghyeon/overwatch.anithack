/* src/router/lazyPages.ts */

import { lazy } from 'react';

// 헬퍼 함수: Named Export 컴포넌트를 동적 임포트할 때 반복되는 패턴 축약
const lazyImport = (
  importFunc: () => Promise<Record<string, React.ComponentType>>,
  name: string,
) => lazy(() => importFunc().then((m) => ({ default: m[name] })));

/*
 <Lazy 로딩 설정>
 [!]: pages/index.ts (바렐 파일)를 거치지 않고 개별 파일 경로로 다이렉트 임포트
 [*]: Vite(Rollup)의 청크 분할(Code Splitting) 최적화를 온전히 유지하기 위함
 */

// Lazy 로딩: 바렐 파일(@/pages)을 거치지 않고 다이렉트로 꽂아서 청크 분할 최적화
export const Home = lazyImport(() => import('@/pages/Home'), 'Home');
export const Login = lazyImport(() => import('@/pages/Login'), 'Login');
export const Register = lazyImport(
  () => import('@/pages/Register'),
  'Register',
);
export const Report = lazyImport(() => import('@/pages/Report'), 'Report');
export const Ranking = lazyImport(() => import('@/pages/Ranking'), 'Ranking');
export const MyPage = lazyImport(() => import('@/pages/MyPage'), 'MyPage');
export const Admin = lazyImport(() => import('@/pages/Admin'), 'Admin');
