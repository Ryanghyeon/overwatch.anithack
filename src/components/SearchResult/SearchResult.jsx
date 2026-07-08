/* src/components/SearchResult/SearchResult.jsx */

import { useState } from "react";
import "./SearchResult.css"; // ✨ CSS import 잊지 마세요!

export function SearchResult({ searchResult, searchedTag, searchError }) {
  const [showNotice, setShowNotice] = useState(false);

  // ✨ 핵심: early return(중간에 끝내기)을 없애고, 무조건 껍데기(wrapper)를 그립니다!
  return (
    <div className="search-result-wrapper">
      {/* 1순위: 에러가 발생했을 때 */}
      {searchError && (
        <div className="search-result-box">
          <p className="result-error">{searchError}</p>
        </div>
      )}

      {/* 2순위: 에러가 없고, 검색 결과가 존재할 때 (null이 아닐 때) */}
      {!searchError && searchResult !== null && (
        <div className="search-result-box">
          {searchResult === false ? (
            <p className="result-clean">
              🟢 <strong>{searchedTag}</strong> 유저는 접수된 신고 내역이
              없습니다.
            </p>
          ) : (
            <div className="result-danger">
              <p>
                🚨 <strong>{searchResult.battletag}</strong> 유저는 현재까지
                <span className="danger-count">
                  {" "}
                  {searchResult.reportCount}번
                </span>{" "}
                신고되었습니다!
              </p>

              <button
                className="btn-go-detail"
                onClick={() => setShowNotice(true)}
              >
                🔍 상세 전과 기록 보기
              </button>

              {showNotice && (
                <p className="update-notice">
                  🛠️ 상세 신고 기록실 타임라인은 업데이트 예정입니다!
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
