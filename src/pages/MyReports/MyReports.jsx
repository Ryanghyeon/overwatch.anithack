/* src/pages/MyReports/MyReports.jsx */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useMyReports } from "@/hooks"; // ✨ 방금 만든 훅 가져오기!
import "./MyReports.css";

// ✨ 반복되는 신고 카드를 서브 컴포넌트로 분리!
const ReportCard = ({ report }) => (
  <div className="report-card">
    <div className="report-header">
      <span className="reported-tag">{report.battletag || "알 수 없음"}</span>
      <span className="report-date">
        {report.createdAt
          ? report.createdAt.toDate().toLocaleDateString()
          : "날짜 없음"}
      </span>
    </div>
    <div className="report-body">
      <span className="report-reason-badge">{report.reason || "기타"}</span>
      <p className="report-description">
        {report.details || "상세 내용이 없습니다."}
      </p>
    </div>
  </div>
);

export function MyReports() {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  // ✨ 복잡한 파이어베이스 통신 코드가 단 한 줄로 압축되었습니다!
  const { reports, loading } = useMyReports(user, isAuthLoading);

  // 로그인 체크 로직
  useEffect(() => {
    if (!isAuthLoading && !user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading || loading)
    return (
      <div className="reports-wrapper">
        <div className="reports-loading">데이터를 불러오는 중... 🏃‍♂️💨</div>
      </div>
    );
  if (!user) return null; // 리다이렉트 되기 전 화면 깜빡임 방지

  return (
    <div className="reports-wrapper">
      <div className="reports-box">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ⬅ 뒤로 가기
        </button>

        <h1 className="reports-title">📜 내 신고 내역</h1>
        <p className="reports-subtitle">
          지금까지 내가 접수한 신고 목록입니다.
        </p>

        <div className="reports-summary">
          <span className="summary-label">누적 신고 수</span>
          <span className="summary-count">{reports.length} 건</span>
        </div>

        <div className="reports-list">
          {reports.length === 0 ? (
            <div className="empty-reports">
              <span className="empty-icon">📂</span>
              <p>아직 신고한 내역이 없습니다.</p>
              <button
                className="btn-go-report"
                onClick={() => navigate("/report")}
              >
                신고하러 가기
              </button>
            </div>
          ) : (
            /* ✨ 서브 컴포넌트를 사용해서 .map() 내부가 눈부시게 깔끔해졌습니다! */
            reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
