// src/hooks/queries/useMyPageQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuthStore } from '@/store/useAuthStore';

// [TODO] 신고 도메인 작업 시 파이어베이스 실데이터로 교체할 예정
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

export const useMyReportsQuery = () => {
  const uid = useAuthStore((state) => state.uid);

  return useQuery({
    queryKey: ['myReports', uid],
    queryFn: () => fetchMyReports(uid!),
    enabled: !!uid,
  });
};

// Firestore 실제 연동
export const useUpdateProfileMutation = () => {
  const { uid } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { username: string; battletag: string }) => {
      if (!uid) throw new Error('인증 정보가 없습니다.');

      const userRef = doc(db, 'users', uid);
      // Firestore 문서 업데이트
      await updateDoc(userRef, {
        username: data.username,
        battletag: data.battletag || null,
      });
      return true;
    },
    onSuccess: () => {
      // 데이터 업데이트가 성공하면 최신 데이터를 다시 불러오게 강제함
      queryClient.invalidateQueries({ queryKey: ['user', uid] });
      alert('프로필이 성공적으로 변경되었습니다.');
    },
    onError: (error) => {
      console.error('프로필 업데이트 에러:', error);
      alert('프로필 변경 중 오류가 발생했습니다.');
    },
  });
};
