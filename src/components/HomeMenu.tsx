import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

// 스토어와 훅을 가져옵니다.
import { useAuthStore } from '@/store/useAuthStore';
import { useLogoutMutation } from '@/hooks';

export const HomeMenu = () => {
  // AuthStore 있는 상태를 꺼내옴
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const uid = useAuthStore((state) => state.uid);

  // useLogout 훅을 호출하여 mutate 함수를 꺼냅니다.
  const { mutate: handleLogout } = useLogoutMutation();

  // [!] Phase 4 진행을 위한 임시 목업(Mock) 데이터
  // 향후 useUser 쿼리 훅이 완성되면 거기서 nickname과 isAdmin을 가져와 교체 예정
  const userName = '유저';
  const isAdmin = uid === 'admin-mock-uid';

  // 비로그인 상태
  if (!isLoggedIn) {
    return (
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {/* 로그인 (메인 액션) */}
        <Link
          to="/login"
          className={cn(
            'flex h-14 flex-1 items-center justify-center rounded-lg text-[16px] font-bold transition-all duration-200',
            'bg-primary hover:bg-primary-hover text-white active:scale-[0.96]',
          )}
        >
          로그인
        </Link>
        {/* 신고 랭킹 */}
        <Link
          to="/ranking"
          className={cn(
            'flex h-14 flex-1 items-center justify-center rounded-lg text-[16px] font-bold transition-all duration-200',
            'border-border-main bg-bg-card text-text-main hover:border-primary hover:text-primary border active:scale-[0.96]',
          )}
        >
          🏆 신고 랭킹
        </Link>
      </div>
    );
  }

  // 로그인 상태 (유저 or 관리자)
  return (
    <div className="mt-8 flex flex-col gap-5">
      {/* 👋 환영 인사 영역 */}
      <div className="text-text-main text-center text-[15px]">
        {isAdmin ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">👑</span>
            <span className="font-extrabold text-[#ff4757]">{userName}</span>
            <span className="text-text-muted">관리자 계정 작동 중</span>
          </div>
        ) : (
          <div>
            반갑습니다,{' '}
            <span className="text-primary font-bold">{userName}</span> 님!
          </div>
        )}
      </div>

      {/* 🎛️ 메뉴 버튼 그룹 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Link
          to="/report"
          className={cn(
            'col-span-2 flex h-14 items-center justify-center rounded-lg text-[16px] font-bold transition-all duration-200 sm:col-span-1',
            'bg-primary hover:bg-primary-hover text-white active:scale-[0.96]',
          )}
        >
          🚨 신고하기
        </Link>
        <Link
          to="/ranking"
          className={cn(
            'flex h-14 items-center justify-center rounded-lg text-[16px] font-bold transition-all duration-200',
            'border-border-main bg-bg-card text-text-main hover:border-primary hover:text-primary border active:scale-[0.96]',
          )}
        >
          🏆 신고 랭킹
        </Link>
        <Link
          to="/mypage"
          className={cn(
            'flex h-14 items-center justify-center rounded-lg text-[16px] font-bold transition-all duration-200',
            'border-border-main bg-bg-card text-text-main hover:border-primary hover:text-primary border active:scale-[0.96]',
          )}
        >
          👤 마이페이지
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className={cn(
              'col-span-2 mt-2 flex h-14 items-center justify-center rounded-lg text-[16px] font-bold transition-all duration-200 sm:col-span-3',
              'bg-[#ff4757] text-white shadow-[0_4px_12px_rgba(255,71,87,0.2)]',
              'hover:-translate-y-px hover:bg-[#ff6b81] active:scale-[0.98]',
            )}
          >
            🛠 관리자 대시보드
          </Link>
        )}

        <button
          onClick={() => handleLogout()}
          className={cn(
            'col-span-2 flex h-13 items-center justify-center rounded-lg text-[14px] font-bold transition-all duration-200 sm:col-span-3',
            'border-border-main text-text-muted border bg-transparent',
            'hover:bg-bg-main hover:text-text-main active:scale-[0.98]',
          )}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};
