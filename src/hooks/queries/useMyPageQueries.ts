// src/hooks/queries/useMyPageQueries.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';

// 💡 [Phase 5 교체 예정] 임시 Mock Fetcher 함수들
const fetchProfile = async (uid: string) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    uid,
    username: '오버워치보안관',
    battletag: 'Justice#1234',
    photoUrl: `https://ui-avatars.com/api/?name=오버워치보안관&background=random&color=fff`,
    role: 'user',
    createdAt: new Date('2023-01-01'),
  };
};

// mock
const fetchMyReports = async (uid: string) => {
  console.log(`[Mock API] ${uid} 유저의 신고 내역을 불러오는 중...`);
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [
    {
      id: '1',
      battletag: 'Hacker#1234',
      reason: '비인가 프로그램 (자동 조준)',
      details: '계속 벽 뒤에서 헤드라인 잡고 따라옴.',
      createdAt: new Date(),
    },
    {
      id: '2',
      battletag: 'TrollUser#999',
      reason: '고의적 게임 진행 방해',
      details: '시작하자마자 우물로 계속 뛰어내림.',
      createdAt: new Date(Date.now() - 86400000),
    },
  ];
};

// 서버 데이터 읽기 (Queries)
export const useMyProfileQuery = () => {
  const uid = useAuthStore((state) => state.uid);

  return useQuery({
    queryKey: ['profile', uid],
    // uid가 null이 아닐 때만 쿼리가 작동하므로 not 단언
    queryFn: () => fetchProfile(uid!),
    enabled: !!uid,
  });
};

export const useMyReportsQuery = () => {
  const uid = useAuthStore((state) => state.uid);

  return useQuery({
    queryKey: ['myReports', uid],
    queryFn: () => fetchMyReports(uid!),
    enabled: !!uid,
  });
};

// 서버 데이터 쓰기/수정 (Mutations)
export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: async (data: { username: string; battletag: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('✅ 프로필 업데이트 완료:', data);
      return true;
    },
  });
};
