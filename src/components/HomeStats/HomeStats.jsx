// src/components/HomeStats/HomeStats.jsx

export function HomeStats({ reportCount, battleTagCount }) {
    return (
        <div className="stats-container">
            <div className="stat-item">
                <div className="stat-label">누적 신고</div>
                <div className="stat-value">{reportCount}</div>
            </div>
            <div className="stat-item">
                <div className="stat-label">누적 배틀태그</div>
                <div className="stat-value">{battleTagCount}</div>
            </div>
        </div>
    );
}