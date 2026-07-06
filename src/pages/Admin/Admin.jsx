import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// 👇 파이어베이스는 버리고, 훅 2개만 쏙 가져옵니다.
import { useAuth, useAdmin } from "@/hooks";
import "./Admin.css";

export function Admin() {
  const navigate = useNavigate();

  // ✨ 1. 기존에 만들어둔 훅으로 로그인 및 관리자 권한 확인 끝!
  const { user, isAdmin, isAuthLoading } = useAuth();

  // ✨ 2. 관리자 권한을 넘겨주어 데이터와 함수들을 받아옵니다.
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

  // 👇 UI 부분은 기존 코드 그대로 유지
  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1 className="admin-title">관리자 대시보드</h1>
        <Link to="/">
          <button className="btn-home">🏠 홈으로</button>
        </Link>
      </div>

      {reports.map((report) => (
        <div key={report.id} className="report-card">
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
            onClick={() => handleDelete(report.id, report.battletag)}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}