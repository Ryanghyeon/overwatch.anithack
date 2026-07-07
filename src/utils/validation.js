// src/utils/validations.js

// 1. 이메일 형식 검사
export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 2. 닉네임 형식 검사 (예: 특수문자 제외, 한글/영문/숫자 2~12자)
export const isValidUsername = (username) => {
    const regex = /^[a-zA-Z0-9가-힣]{2,12}$/;
    return regex.test(username);
};

// 3. 비밀번호 형식 검사 (최소 6자리 이상)
export const isValidPassword = (password) => {
    return password.length >= 6;
};

// 4. 배틀태그 형식 검사 (기존 로직 유지)
export const isValidBattletag = (battletag) => {
    const regex = /^.+#[0-9]{3,}$/; // 예: 이름#1234
    return regex.test(battletag);
};