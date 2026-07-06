// 배틀태그 입력 시 무결성 검증
// src/utils/battletag.js

/**
 * 배틀태그 무결성 검증 함수
 * @param {string} tag - 검사할 배틀태그
 * @returns {boolean} - 통과하면 true, 실패하면 false
 */
export const isValidBattletag = (tag) => {
    if (!tag) return false;
    // 한글, 영문, 숫자 조합 + # + 숫자 4~5자리
    const battleTagRegex = /^[a-zA-Z0-9가-힣]+#\d{4,5}$/;
    return battleTagRegex.test(tag.trim());
};

/**
 * Overfast API 요청용 포맷 변환 함수 (#을 -로 변경)
 * @param {string} tag - 변환할 배틀태그
 * @returns {string} - 변환된 배틀태그 (예: Ryang-1234)
 */
export const formatBattletagForApi = (tag) => {
    if (!tag) return "";
    return tag.trim().replace("#", "-");
};

/**
 * 
 import
 * import { isValidBattletag, formatBattletagForApi } from "../../utils/battletag";


const handleSearch = (e) => {
  e.preventDefault();

  // 1. 공통 검증 모듈 사용
  if (!isValidBattletag(searchQuery)) {
    alert("올바른 배틀태그 형식이 아닙니다. (예: 홍길동#1234)");
    return;
  }
  
  // 2. 공통 변환 모듈 사용
  const apiFormattedTag = formatBattletagForApi(searchQuery);
  
  // 이제 apiFormattedTag를 가지고 API를 찌르거나 페이지를 이동하면 끝!
};


 */