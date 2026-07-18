/* src/api/users.ts */

import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

interface CheckDuplicateParams {
  field: 'username' | 'battletag';
  value: string;
  currentUid?: string | null;
}

// 훅에서 호출할 파이어베이스 통신 함수
export const checkDuplicate = async ({
  field,
  value,
  currentUid = null,
}: CheckDuplicateParams): Promise<boolean> => {
  if (!value) return false;

  // limit(1): 중복을 하나라도 찾으면 즉시 탐색 종료 (과금 방지 최적화)
  const q = query(collection(db, 'users'), where(field, '==', value), limit(1));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return false;

  // 검색된 문서가 현재 로그인한 본인의 것이라면 중복이 아닌 것으로 처리
  if (currentUid && querySnapshot.docs[0].id === currentUid) {
    return false;
  }

  return true; // 중복됨
};
