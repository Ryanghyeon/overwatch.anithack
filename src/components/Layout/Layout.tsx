/* src/components/Layout/Layout.tsx */

import { Outlet } from 'react-router-dom';
import { useAutoLogout } from '@/hooks';
import { Footer } from '@/components';

export const Layout = () => {
  useAutoLogout(); // 유저가 이 레이아웃에 있는 동안 계속 감시
  return (
    <div className="flex min-h-screen flex-col">
      {/* TODO: 여기에 <Header /> 컴포넌트가 들어갑니다 */}

      {/* 라우터에 따라 가운데 페이지 부분만 갈아끼워짐 */}
      <main className="flex grow flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
