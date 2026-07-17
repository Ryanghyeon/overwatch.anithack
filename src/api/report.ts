// src/api/report.ts
import { db } from '@/firebase/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  Timestamp,
} from 'firebase/firestore';

export const submitNewReport = async (
  reporterUid: string,
  battletag: string,
  reason: string,
  Details: string,
) => {
  // 중복 신고 검사 (동일 유저가 동일 배틀태그를 또 신고했는지)
  const reportQuery = query(
    collection(db, 'reports'),
    where('reporterUid', '==', reporterUid),
    where('battletag', '==', battletag),
  );
  const existingReports = await getDocs(reportQuery);

  if (!existingReports.empty) {
    throw new Error('ALREADY_REPORTED');
  }

  const now = Timestamp.now();

  // 파이어베이스에 신고 내역 추가
  await addDoc(collection(db, 'reports'), {
    battletag,
    reason,
    details: Details,
    reporterUid,
    createdAt: now,
  });

  // 배틀태그 누적 카운트 및 랭킹 데이터 업데이트
  const battletagRef = doc(db, 'battletags', battletag);
  const battletagSnap = await getDoc(battletagRef);

  if (!battletagSnap.exists()) {
    // 최초 신고 시 새 문서 생성
    await setDoc(battletagRef, {
      battletag,
      count: 1,
      lastReportedAt: now,
    });
  } else {
    // 기존 누적 신고 시 카운트 증가
    await updateDoc(battletagRef, {
      count: increment(1),
      lastReportedAt: now,
    });
  }
};
