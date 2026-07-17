// src/pages/MyPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/useAuthStore';
import {
  useMyProfileQuery,
  useMyReportsQuery,
  useUpdateProfileMutation,
} from '@/hooks/queries/useMyPageQueries';

type TabType = 'dashboard' | 'reports' | 'settings';

export const MyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // 🚨 수정됨: 클라이언트 전역 상태에서 isLoggedIn 플래그를 가져옵니다.
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 인증 가드 (비로그인 튕겨내기)
  // 테스트를 위해 로그인 없이 넘어가도록 함. !isLoggedIn으로 바꿀 것
  if (isLoggedIn) {
    return (
      <div className="flex min-h-[calc(100dvh-160px)] flex-col items-center justify-center gap-4 text-white">
        <h2 className="text-xl font-bold">로그인이 필요한 페이지입니다.</h2>
        <button
          onClick={() => navigate('/login')}
          className="bg-primary rounded-lg px-6 py-2 font-bold text-white"
        >
          로그인 하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-160px)] w-full justify-center px-4 py-10 sm:px-6">
      <div className="border-border-main bg-bg-card flex w-full max-w-212.5 flex-col overflow-hidden rounded-2xl border shadow-2xl">
        {/* 상단 탭 (Tab) 내비게이션 */}
        <div className="border-border-main bg-bg-main/50 flex border-b">
          {(['dashboard', 'reports', 'settings'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-4 text-sm font-bold transition-all sm:text-base',
                activeTab === tab
                  ? 'border-primary text-primary border-b-2'
                  : 'text-text-muted hover:text-text-main hover:bg-white/5',
              )}
            >
              {tab === 'dashboard' && '대시보드'}
              {tab === 'reports' && '신고 내역'}
              {tab === 'settings' && '프로필 설정'}
            </button>
          ))}
        </div>

        {/* 탭 내용 렌더링 컨테이너 */}
        <div className="p-6 sm:p-10">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'reports' && <ReportsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🧩 하위 탭 컴포넌트 1: 대시보드
// ==========================================
const DashboardTab = () => {
  const { data: profile, isLoading } = useMyProfileQuery();

  if (isLoading)
    return (
      <div className="text-text-muted py-20 text-center">
        프로필 불러오는 중...
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="border-border-main flex items-center gap-6 border-b pb-8">
        <img
          src={profile?.photoUrl}
          alt="프로필"
          className="border-primary h-20 w-20 rounded-full border-2 shadow-lg"
        />
        <div>
          <h2 className="text-text-main text-2xl font-black">
            {profile?.username}
          </h2>
          <p className="text-text-muted text-sm">
            가입일: {profile?.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* 연동 배너 */}
      <div className="border-border-main bg-bg-input flex items-center justify-between rounded-xl border px-5 py-4">
        <span className="text-text-muted font-bold">블리자드 연동 계정</span>
        {profile?.battletag ? (
          <div className="flex items-center gap-3">
            <span className="text-primary font-black">{profile.battletag}</span>
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-500">
              ✅ 연동됨
            </span>
          </div>
        ) : (
          <span className="text-text-muted">연동된 계정이 없습니다.</span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 🧩 하위 탭 컴포넌트 2: 신고 내역 리스트
// ==========================================
const ReportsTab = () => {
  const { data: reports, isLoading } = useMyReportsQuery();

  if (isLoading)
    return (
      <div className="text-text-muted py-20 text-center">
        신고 내역 불러오는 중...
      </div>
    );
  if (!reports?.length)
    return (
      <div className="text-text-muted py-20 text-center">
        아직 접수한 신고 내역이 없습니다.
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="border-border-main mb-4 inline-flex items-center justify-center gap-3 self-center rounded-xl border bg-white/5 px-6 py-3">
        <span className="text-text-muted font-bold">누적 신고 수</span>
        <span className="text-xl font-black text-blue-400">
          {reports.length} 건
        </span>
      </div>

      {reports.map((report) => (
        <div
          key={report.id}
          className="border-border-main bg-bg-input flex flex-col gap-3 rounded-xl border p-5 transition-transform hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-primary text-lg font-black">
              {report.battletag}
            </span>
            <span className="text-text-muted text-sm">
              {report.createdAt.toLocaleDateString()}
            </span>
          </div>
          <span className="w-fit rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-500">
            {report.reason}
          </span>
          <p className="text-text-main/80 text-sm">{report.details}</p>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 🧩 하위 탭 컴포넌트 3: 설정 폼
// ==========================================
const SettingsTab = () => {
  const { data: profile } = useMyProfileQuery();
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();
  const [username, setUsername] = useState(profile?.username || '');
  const [battletag, setBattletag] = useState(profile?.battletag || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ username, battletag });
  };

  return (
    <form
      onSubmit={handleSave}
      className="mx-auto flex max-w-112.5 flex-col gap-5"
    >
      <div>
        <label className="text-text-muted mb-2 block text-sm font-bold">
          유저네임
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border-border-main bg-bg-input text-text-main focus:border-primary w-full rounded-lg border p-4 outline-none"
        />
      </div>
      <div>
        <label className="text-text-muted mb-2 block text-sm font-bold">
          오버워치 배틀태그
        </label>
        <input
          type="text"
          value={battletag}
          onChange={(e) => setBattletag(e.target.value)}
          className="border-border-main bg-bg-input text-text-main focus:border-primary w-full rounded-lg border p-4 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-primary mt-4 rounded-lg py-4 font-bold text-white transition-all hover:bg-orange-600 disabled:opacity-50"
      >
        {isPending ? '저장 중...' : '변경사항 저장'}
      </button>
    </form>
  );
};
