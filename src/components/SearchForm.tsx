import { cn } from '@/utils/cn';
import type { SyntheticEvent } from 'react';

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  executeSearch: (e: SyntheticEvent<HTMLFormElement>) => void;
  isSearching?: boolean;
}

export const SearchForm = ({
  searchQuery,
  setSearchQuery,
  executeSearch,
  isSearching = false,
}: SearchFormProps) => {
  return (
    <form onSubmit={executeSearch} className="mx-auto w-full">
      <div className="flex items-center gap-3">
        {/* 검색 인풋창 */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="배틀태그 검색 (예: 홍길동#1234)"
          maxLength={20}
          disabled={isSearching}
          className={cn(
            'h-14 flex-1 rounded-lg px-5 text-[17px] transition-all duration-200 outline-none',
            'border-border-main bg-bg-main text-text-main border',
            'placeholder:text-text-muted',
            'focus:border-primary focus:bg-bg-card focus:ring-primary focus:ring-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        />

        {/* 검색 버튼 */}
        <button
          type="submit"
          disabled={isSearching}
          className={cn(
            'h-14 rounded-lg px-7 text-[17px] font-bold whitespace-nowrap transition-all duration-200',
            'bg-primary hover:bg-primary-hover text-white active:scale-[0.96]',
            'disabled:bg-border-main disabled:text-text-muted disabled:transform-none disabled:cursor-not-allowed',
          )}
        >
          {isSearching ? '검색 중...' : '검색'}
        </button>
      </div>
    </form>
  );
};
