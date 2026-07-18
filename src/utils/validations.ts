/* src/utils/validations.ts */

// 1. 배틀태그 검증 (블리자드 오피셜 정규식 적용)
export const isValidBattletag = (tag?: string | null): boolean => {
  if (!tag) return false;
  const cleanTag = tag.trim();
  // 첫 글자는 영문/한글, 두 번째부터 숫자 포함 2~12글자, # 뒤에 숫자 4~5자리
  const regex = /^[a-zA-Z가-힣][a-zA-Z0-9가-힣]{1,11}#[0-9]{4,5}$/;
  return regex.test(cleanTag);
};

// 2. 이메일 형식 검사
export const isValidEmail = (email?: string | null): boolean => {
  if (!email) return false;
  // 영문, 숫자, 허용된 특수문자(._%+-) 조합 @ 도메인.최상위도메인(2글자 이상)
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

// 3. 닉네임 형식 검사 (특수문자 제외, 한글/영문/숫자 2~12자)
export const isValidUsername = (username?: string | null): boolean => {
  if (!username) return false;
  const regex = /^[a-zA-Z0-9가-힣]{2,12}$/;
  return regex.test(username);
};

// 4. 비밀번호 형식 검사 (최소 6자리 이상)
export const isValidPassword = (password?: string | null): boolean => {
  if (!password) return false;
  return password.length >= 6;
};
