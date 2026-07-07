// src/pages/Admin/Admin.jsx
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useAdmin } from "@/hooks";
import "./Admin.css";

// ✨ 1. 길고 복잡했던 개별 신고 카드 UI를 미니 컴포넌트로 완벽하게 분리!
const AdminReportCard = ({ report, onDelete }) => (
  <div className="report-card">
    <div className="report-header">
      <h3 className="report-battletag">{report.battletag}</h3>
      <span className="report-time">
        {report.createdAt
          ? report.createdAt.toDate().toLocaleString('ko-KR')
          : "시간 정보 없음"}
      </span>
    </div>

    <p className="report-reason">
      <strong>사유 : </strong> {report.reason}
    </p>

    {report.details && (
      <div className="report-details-box">
        <span className="report-details-title">📝 세부사항</span>
        <div className="report-details-text">{report.details}</div>
      </div>
    )}

    <div className="report-footer-info">
      <p className="report-uid">
        신고자 UID : {report.reporterUid}
      </p>
      <Link to={`/profile/${report.reporterUid}`}>
        <button className="btn-view-profile">
          🔍 프로필(기록) 보기
        </button>
      </Link>
    </div>

    <button
      className="btn-delete"
      onClick={() => onDelete(report.id, report.battletag)}
    >
      삭제
    </button>
  </div>
);

export function Admin() {
  const navigate = useNavigate();

  const { user, isAdmin, isAuthLoading } = useAuth();
  const { reports, isLoading, handleDelete } = useAdmin(isAdmin);

  // 권한 없는 유저 쫓아내기 로직
  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    } else if (!isAdmin) {
      alert("관리자 권한이 없습니다.");
      navigate("/");
    }
  }, [user, isAdmin, isAuthLoading, navigate]);

  // 로딩 화면 처리
  if (isAuthLoading || isLoading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>데이터를 불러오는 중...</div>;
  }

  // ✨ 2. 메인 컴포넌트의 화면 렌더링 영역이 예술적으로 깔끔해졌습니다!
  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1 className="admin-title">관리자 대시보드</h1>
        <Link to="/">
          <button className="btn-home">🏠 홈으로</button>
        </Link>
      </div>

      {/* ✨ 미니 컴포넌트를 호출하기만 하면 끝! */}
      {reports.map((report) => (
        <AdminReportCard
          key={report.id}
          report={report}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}