/* src/hooks/useSearch.js */

import { useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { isValidBattletag } from "@/utils";

export function useSearch() {
  // 1. 상태 관리 (State)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedTag, setSearchedTag] = useState("");
  const [searchError, setSearchError] = useState("");

  // 2. 검색 실행 함수
  const executeSearch = async (e) => {
    e.preventDefault();

    // 검색어 공백 제거 및 빈 값 체크
    const targetTag = searchQuery.trim();
    if (!targetTag) return;

    // ✨ 핵심 1: 새로운 검색을 시작할 때 기존의 에러와 결과창을 깔끔하게 비워줍니다.
    setSearchError("");
    setSearchResult(null);

    // ✨ 핵심 2: 유효성 검사 (다이나믹 에러 메시지 적용으로 화면 즉각 반응)
    if (!isValidBattletag(targetTag)) {
      setSearchError(
        `⚠️ '${targetTag}' 은(는) 올바른 배틀태그 형식이 아닙니다.`,
      );
      return;
    }

    // ✨ 핵심 3: 검증을 통과했을 때만 검색어 박제 및 로딩 시작
    setSearchedTag(targetTag);
    setIsSearching(true);

    try {
      const q = query(
        collection(db, "battletags"),
        where("battletag", "==", targetTag),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // 악성 유저 발견
        const tagDoc = querySnapshot.docs[0];
        const data = tagDoc.data();

        setSearchResult({
          id: tagDoc.id,
          ...data,
          reportCount: data.count,
        });
      } else {
        setSearchResult(false);
      }
    } catch (error) {
      console.error("검색 중 에러 발생:", error);
      // alert 대신 화면에 에러를 띄우도록 통일
      setSearchError(
        "서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      // 성공하든 실패하든 로딩 상태는 무조건 해제
      setIsSearching(false);
    }
  };

  // 3. 상태와 함수 밖으로 꺼내주기
  return {
    searchQuery,
    setSearchQuery,
    searchResult,
    isSearching,
    executeSearch,
    searchedTag,
    searchError,
  };
}
