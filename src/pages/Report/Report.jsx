import { useState } from "react";
import { auth, db } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import './Report.css'; 

export default function Report() {
  const navigate = useNavigate();
  const [battleTag, setBattleTag] = useState("");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState(""); 

  const handleReport = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert("로그인이 필요합니다.");
        return;
      }

      if (!battleTag.trim()) {
        alert("배틀태그를 입력해 주세요.");
        return;
      }

      const battleTagRegex = /^[a-zA-Z0-9가-힣]+#\d{4,5}$/;
      
      if (!battleTagRegex.test(battleTag)) {
        alert("올바른 배틀태그 형식이 아닙니다. (예: 비매너유저#12345)");
        return;
      }

      if (!reason) {
        alert("신고 사유를 선택해 주세요.");
        return;
      }

      const reportQuery = query(
        collection(db, "reports"),
        where("reporterUid", "==", user.uid),
        where("battletag", "==", battleTag)
      );
      const existingReports = await getDocs(reportQuery);
      if (!existingReports.empty) {
        alert("이미 신고한 배틀태그입니다.");
        return;
      }
      
      await addDoc(collection(db, "reports"), {
        battletag: battleTag,
        reason: reason,
        details: details, 
        reporterUid: user.uid,
        createdAt: new Date(),
      });
      
      // ✨ battletags 장부 업데이트 로직 (reportCount -> count 로 이름 통일!)
      const battletagRef = doc(db, "battletags", battleTag);
      const battletagSnap = await getDoc(battletagRef);

      if (!battletagSnap.exists()) {
        await setDoc(battletagRef, {
          battletag: battleTag,
          count: 1, // ✨ 여기 수정됨!
          lastReportedAt: new Date(),
        });
      } else {
        await updateDoc(battletagRef, {
          count: increment(1), // ✨ 여기 수정됨!
          lastReportedAt: new Date(),
        });
      }
      
      alert(`${battleTag} 신고가 접수되었습니다.`);
      navigate("/");
      
    } catch (error) {
      console.error(error);
      alert("신고 접수 중 오류가 발생했습니다.");
    }
  };

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

        <button onClick={handleReport} className="btn-report">
          신고 접수하기
        </button>
      </div>
    </div>
  );
}