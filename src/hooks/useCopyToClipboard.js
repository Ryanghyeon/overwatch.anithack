/* src/hooks/useCopyToClipboard.js */

import { useState } from "react";

export function useCopyToClipboard(resetTime = 1000) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, resetTime);
    } catch (err) {
      console.error("복사 실패", err);
    }
  };

  return { isCopied, copyToClipboard };
}
