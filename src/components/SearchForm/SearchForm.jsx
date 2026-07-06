// src/components/SearchForm/SearchForm.jsx
import './SearchForm.css';

export function SearchForm({ searchQuery, setSearchQuery, executeSearch, isSearching }) {
    return (
        <form onSubmit={executeSearch} className="search-form">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    placeholder="배틀태그 검색 (예: 트레이서#1234)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    maxLength={20}
                />
                <button type="submit" className="btn-search" disabled={isSearching}>
                    {isSearching ? "🔍" : "검색"}
                </button>
            </div>
        </form>
    );
}