import { useState, useCallback } from 'react';

export const useCopyToClipboard = (resetInterval = 2000) => {
  // 2초간 메시지 띄움
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);

        // 일정 시간 후 "복사 완료!" 메시지 원상복구
        setTimeout(() => setIsCopied(false), resetInterval);
      } catch (error) {
        console.error('클립보드 복사 실패:', error);
        setIsCopied(false);
      }
    },
    [resetInterval],
  );

  return { isCopied, copyToClipboard };
};
