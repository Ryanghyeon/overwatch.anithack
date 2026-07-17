// src/hooks/queries/useAdminQueries.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';

// [Phase 5 교체 예정] 임시 Mock Fetcher 함수들
const fetchAdminReports = async () => {
  console.log('[Mock API] 전체 신고 내역을 불러옵니다...');
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: '1',
      battletag: 'AimbotGod#111',
      reason: '비인가 프로그램 (자동 조준)',
      details: '1라운드부터 계속 에임핵 사용함. 리플레이 확인 요망.',
      reporterUid: 'user_999',
      createdAt: new Date(),
    },
    {
      id: '2',
      battletag: 'ToxicPlayer#555',
      reason: '부적절한 의사소통',
      details: '팀보이스로 심한 욕설과 패드립.',
      reporterUid: 'user_123',
      createdAt: new Date(Date.now() - 86400000),
    },
  ];
};

// 서버 데이터 읽기 (전체 신고 내역 조회)
export const useAdminReportsQuery = () => {
  const uid = useAuthStore((state) => state.uid);

  return useQuery({
    queryKey: ['adminReports'],
    queryFn: fetchAdminReports,
    // Phase 5에서 실제 useUser 쿼리의 role 기반으로 변경될 임시 허용 조건
    enabled: !!uid,
  });
};

// 서버 데이터 쓰기 (신고 내역 삭제)
export const useDeleteReportMutation = () => {
  return useMutation({
    mutationFn: async (reportId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`✅ [Mock API] 신고 내역 삭제 완료: ${reportId}`);
      return reportId;
    },
  });
};
