// src/api/admin.ts
import { db } from '@/firebase/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';

export interface AdminReport {
  id: string;
  battletag: string;
  reason: string;
  details: string;
  reporterUid: string;
  createdAt: Timestamp;
}

// 1. 신고 내역 전체 불러오기
export const fetchAdminReports = async (): Promise<AdminReport[]> => {
  const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as AdminReport[];
};

// 신고 내역 삭제 및 랭킹 데이터(배틀태그) 동기화 (레거시 핵심 로직 이식)
export const deleteReportAndSyncRanking = async (
  reportId: string,
  targetBattletag: string,
) => {
  // 신고 내역 자체를 삭제
  await deleteDoc(doc(db, 'reports', reportId));

  // 랭킹(배틀태그) 카운트 차감 및 삭제 연동
  const q = query(
    collection(db, 'battletags'),
    where('battletag', '==', targetBattletag),
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const tagDoc = snapshot.docs[0];
    const currentCount = tagDoc.data().count || 1;

    // 카운트가 1이하였다면 배틀태그 자체를 랭킹에서 아예 삭제, 아니면 1 차감
    if (currentCount <= 1) {
      await deleteDoc(doc(db, 'battletags', tagDoc.id));
    } else {
      await updateDoc(doc(db, 'battletags', tagDoc.id), {
        count: currentCount - 1,
      });
    }
  }
};
