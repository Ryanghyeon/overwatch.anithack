import { useAuthListener } from '@/hooks';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { LoadingSpinner } from './components';

function App() {
  // 앱이 켜지자마자 문지기 배치. 알아서 Zustand 업데이트 함
  useAuthListener();

  const { isAuthLoading } = useAuthStore();
  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  // 라우터 렌더링
  return <RouterProvider router={router} />;
}

export default App;
