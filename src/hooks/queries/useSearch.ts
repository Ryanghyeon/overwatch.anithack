/* src/hooks/queries/useSearch.ts */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSearchResult } from '@/api';
import { isValidBattletag } from '@/utils';

export function useSearch() {
  // Form UI 관련 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedTag, setSearchedTag] = useState('');
  const [searchError, setSearchError] = useState('');

  // React Query 적용 (데이터 통신 및 상태 자동 관리)
  // searchedTag가 변경되면 fetchSearchResult 호출
  const { data: searchResult = null, isFetching: isSearching } = useQuery({
    queryKey: ['searchResult', searchedTag],
    queryFn: () => fetchSearchResult(searchedTag),
    // 핵심: searchedTag가 빈 값이 아닐 때만 쿼리를 실행하도록 방어막 설정
    enabled: !!searchedTag,
    // 동일한 유저를 연속해서 검색할 때 불필요한 과금을 막기 위한 5분 캐싱
    staleTime: 1000 * 60 * 5,
    retry: 0, // 검색 실패 시 재시도하지 않음
  });

  // 3. 폼 제출(Submit) 핸들러
  const executeSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const targetTag = searchQuery.trim();
    if (!targetTag) return;

    // 새로운 검색 시작 시 에러 초기화
    setSearchError('');

    // 유효성 검사
    if (!isValidBattletag(targetTag)) {
      setSearchError(
        `⚠️ '${targetTag}' 은(는) 올바른 배틀태그 형식이 아닙니다.`,
      );
      return;
    }

    // 검증을 통과 시 searchedTag 상태만 업데이트합니다.
    // 상태가 업데이트되면 React Query의 `queryKey`가 변하면서 자동으로 검색 API(통신) 실행
    setSearchedTag(targetTag);
  };

  // 컴포넌트에서 사용할 수 있도록 반환
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
