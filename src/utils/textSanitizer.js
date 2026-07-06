// src/utils/textSanitizer.js

// 입력된 텍스트를 HTML에서 안전하게 표시할 수 있도록 변환하는 함수
export const textSanitizer = (text) => {
    if (!text) return "";
    return text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\(/g, "&#40;")
        .replace(/\)/g, "&#41;")
        .replace(/'/g, "&#x27;")
        .replace(/"/g, "&quot;");
};