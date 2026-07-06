// src/components/SearchResult/SearchResult.jsx
import { useState } from "react";

export function SearchResult({ searchResult, searchedTag, searchError }) {
    const [showNotice, setShowNotice] = useState(false);

    // ✨ 1순위: 에러가 있는지 가장 먼저 검사합니다! (여기서 걸리면 바로 에러창 리턴)
    if (searchError) {
        return (
            <div className="search-result-box">
                <p className="result-error" style={{ color: "#ff4757", fontWeight: "bold" }}>
                    {searchError}
                </p>
            </div>
        );
    }

    // ✨ 2순위: 에러가 없는데, 검색 결과도 없다면? (초기 상태) 아무것도 안 그립니다.
    if (searchResult === null) return null;

    // ✨ 3순위: 에러도 없고 검색도 완료되었을 때 진짜 결과창을 보여줍니다.
    return (
        <div className="search-result-box">
            {searchResult === false ? (
                <p className="result-clean">
                    🟢 <strong>{searchedTag}</strong> 유저는 접수된 신고 내역이 없습니다.
                </p>
            ) : (
                <div className="result-danger">
                    <p>
                        🚨 <strong>{searchResult.battletag}</strong> 유저는 현재까지
                        <span className="danger-count"> {searchResult.reportCount}번</span> 신고되었습니다!
                    </p>

                    <button
                        className="btn-go-detail"
                        onClick={() => setShowNotice(true)}
                    >
                        🔍 상세 전과 기록 보기
                    </button>

                    {showNotice && (
                        <p className="update-notice" style={{ marginTop: "15px", color: "#ffa502", fontSize: "0.9rem" }}>
                            🛠️ 상세 신고 기록실 타임라인은 업데이트 예정입니다!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}