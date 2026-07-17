import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components';
import { Home, Login, Report, Ranking, MyPage, Admin, Register } from '@/pages';

// 페이지 추가 시 배열 안에 객체로 정리
/*
<페이지 추가 시>
1. .src/pages 하위 파일(.tsx, .css) 생성
2. ./pages/index.ts에 export
3. 아래 router 배열에 객체 추가
*/

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // 모든 페이지는 반드시 이 Layout(헤더/푸터)을 통과함
    children: [
      // div는 테스트용 placeholder 역할
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'report', element: <Report /> },
      { path: 'ranking', element: <Ranking /> },
      { path: 'mypage', element: <MyPage /> },
      { path: 'admin', element: <Admin /> },
      // {path: '경로', element: <컴포넌트/>}
      // 기존 routes.jsx에 있던 평면적인 경로들이
      // 이제 Layout의 자식(children)으로 들어옴
    ],
  },
]);
