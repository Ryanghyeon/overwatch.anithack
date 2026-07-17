/* src/hooks/useReport.ts */

import { useState } from 'react';
import type { SyntheticEvent } from 'react';

// [!] Phase 5에서 Zustand(useAuthStore)와 React Query를 붙여 진짜 통신 로직으로 바꿀 예정입니다.
export const useReport = () => {
  const [battleTag, setBattleTag] = useState('');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReport = (e?: SyntheticEvent<HTMLFormElement>) => {
    // 💡 form 태그의 기본 동작(새로고침) 방지
    if (e) e.preventDefault();

    setIsSubmitting(true);
    console.log('🚨 임시 신고 제출:', { battleTag, reason, details });

    // API 통신 흉내 (1초 딜레이)
    setTimeout(() => {
      setIsSubmitting(false);
      alert('신고가 성공적으로 접수되었습니다! (테스트)');
      // 접수 후 폼 초기화
      setBattleTag('');
      setReason('');
      setDetails('');
    }, 1000);
  };

  return {
    battleTag,
    setBattleTag,
    reason,
    setReason,
    details,
    setDetails,
    submitReport,
    isSubmitting,
  };
};
