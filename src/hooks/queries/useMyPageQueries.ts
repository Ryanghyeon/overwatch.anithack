/* src/hooks/queries/useMyPageQueries.ts */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuthStore } from '@/store';

// 신고 내역 타입 정의
export interface Report {
  id: string;
  battletag: string;
  reason: string;
  details: string;
  createdAt: Date;
  reporterUid: string; // 신고를 작성한 유저의 UID
}

// Mock 함수 삭제: Firestore 실데이터 쿼리
export const useMyReportsQuery = () => {
  const uid = useAuthStore((state) => state.uid);

  return useQuery({
    queryKey: ['myReports', uid],
    queryFn: async (): Promise<Report[]> => {
      if (!uid) throw new Error('인증 정보가 없습니다.');

      // reports 컬렉션 참조
      const reportsRef = collection(db, 'reports');

      // 현재 로그인한 유저(uid)가 작성한 신고 내역만 필터링
      const q = query(reportsRef, where('reporterUid', '==', uid));

      // 데이터 가져오기
      const snapshot = await getDocs(q);

      // 컴포넌트가 사용하기 편하게 데이터 가공
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          battletag: data.battletag || '알 수 없음',
          reason: data.reason || '기타',
          details: data.details || '',
          reporterUid: data.reporterUid || '',
          // 파이어베이스 Timestamp 객체를 JavaScript Date 객체로 변환
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        };
      });
    },
    enabled: !!uid, // uid가 존재할 때만 쿼리 실행
  });
};

// 서버 데이터 쓰기/수정
export const useUpdateProfileMutation = () => {
  const { uid } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      username: string;
      battletag?: string | null;
    }) => {
      if (!uid) throw new Error('인증 정보가 없습니다.');

      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        username: data.username,
        battletag: data.battletag || null,
      });
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', uid] });
      alert('프로필이 성공적으로 변경되었습니다.');
    },
    onError: (error) => {
      console.error('프로필 업데이트 에러:', error);
      alert('프로필 변경 중 오류가 발생했습니다.');
    },
  });
};
