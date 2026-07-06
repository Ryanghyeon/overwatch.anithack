import { useAuth, useReport } from "@/hooks";
import './Report.css';

export function Report() {
  // 1. 로그인 유저 정보 가져오기
  const { user } = useAuth();


  // 2. 신고 관련 로직과 상태 가져오기 (user 정보를 넘겨줌)
  const {
    battleTag, setBattleTag,
    reason, setReason,
    details, setDetails,
    submitReport, isSubmitting
  } = useReport(user);

  return (
    <div className="report-wrapper">
      <div className="report-box">
        <h1 className="report-title">🚨 핵 사용자 신고</h1>

        <input
          type="text"
          placeholder="배틀태그 입력 (예: Hacker#1234)"
          value={battleTag}
          onChange={(e) => setBattleTag(e.target.value)}
          className="report-input"
        />

        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="report-input"
        >
          <option value="">신고 사유 선택 (필수)</option>
          <option value="비인가 프로그램 (자동 조준/격발)">비인가 프로그램 (자동 조준/격발)</option>
          <option value="비인가 프로그램 (위치 투시/ESP)">비인가 프로그램 (위치 투시/ESP)</option>
          <option value="고의적 게임 진행 방해 (패작/트롤링)">고의적 게임 진행 방해 (패작/트롤링)</option>
          <option value="부적절한 의사소통 (욕설/비하)">부적절한 의사소통 (욕설/비하)</option>
          <option value="기타 사유">기타 사유</option>
        </select>

        <textarea
          placeholder="핵 사용 정황이나 발생 시간 등 세부사항을 적어주세요. (선택)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="report-input report-textarea"
        ></textarea>

        {/* ✨ 제출 중일 때는 버튼을 비활성화하여 중복 클릭 방지! */}
        <button
          onClick={submitReport}
          className="btn-report"
          disabled={isSubmitting}
        >
          {isSubmitting ? "접수 중..." : "신고 접수하기"}
        </button>
      </div>
    </div>
  );
}