// 페이지 테스트용 임시 데이터

import { useState } from 'react';
import type { SyntheticEvent } from 'react';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return {
    searchQuery,
    setSearchQuery,
    searchResult: null, // UI 렌더링 확인용 초기 상태
    isSearching: false,
    executeSearch: (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log('임시 검색 실행:', searchQuery);
    },
    searchedTag: '',
    searchError: null,
  };
};
