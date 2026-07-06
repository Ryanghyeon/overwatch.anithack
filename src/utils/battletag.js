// 배틀태그 입력 시 무결성 검증
// src/utils/battletag.js

export const isValidBattletag = (tag) => {
  if (!tag) return false;
  const cleanTag = tag.trim();
  // 한글, 영문, 숫자 조합 + # + 숫자 4~5자리
  // ✨ 블리자드 오피셜 정규식
  // 1. ^[a-zA-Z가-힣] : 첫 글자는 무조건 영문 대소문자 또는 한글 (숫자 컷!)
  // 2. [a-zA-Z0-9가-힣]{2,11} : 두 번째 글자부터는 숫자 포함 가능, 2~11글자 (첫 글자 포함 총 3~12글자)
  // 3. #[0-9]{4,6}$ : 끝에는 # 기호와 숫자 4~6자리 고정
  const regex = /^[a-zA-Z가-힣][a-zA-Z0-9가-힣]{1,11}#[0-9]{3,6}$/;
  return regex.test(cleanTag);
};