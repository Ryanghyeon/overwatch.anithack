// src/routes.jsx 
import { lazy } from 'react';
import { LoadingSpinner } from '@/components';

// lazy() 적용으로 페이지 열릴 때만 다운로드
const Home = lazy(() => import('@/pages').then(m => ({ default: m.Home })));
const Login = lazy(() => import('@/pages').then(m => ({ default: m.Login })));
const Register = lazy(() => import('@/pages').then(m => ({ default: m.Register })));
const Report = lazy(() => import('@/pages').then(m => ({ default: m.Report })));
const Ranking = lazy(() => import('@/pages').then(m => ({ default: m.Ranking })));
const Admin = lazy(() => import('@/pages').then(m => ({ default: m.Admin })));
const Profile = lazy(() => import('@/pages').then(m => ({ default: m.Profile })));
const MyPage = lazy(() => import('@/pages').then(m => ({ default: m.MyPage })));
const MyReports = lazy(() => import('@/pages').then(m => ({ default: m.MyReports })));


// 라우터 요소에 Suspense를 자동으로 추가해주는 헬퍼 함수
// 분할 페이지 로딩 중 표시할 공통 스피너
const withSuspense = (Component) => (
    <Suspense fallback={<LoadingSpinner text="페이지를 불러오는 중입니다... 🚀" />}>
        <Component />
    </Suspense>
);

export const routeList = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/report", element: <Report /> },
    { path: "/ranking", element: <Ranking /> },
    { path: "/admin", element: <Admin /> },
    { path: "/profile", element: <Profile /> },
    { path: "/profile/:uid", element: <Profile /> },
    { path: "/mypage", element: <MyPage /> },
    { path: "/my-reports", element: <MyReports /> }
];