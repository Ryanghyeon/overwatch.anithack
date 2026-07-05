import { useState } from "react";
import { auth, db } from "../firebase/firebase";
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

export default function Report() {
  const navigate = useNavigate();
  const [battleTag, setBattleTag] = useState("");
  const [reason, setReason] = useState("");

  const handleReport = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      alert("로그인이 필요합니다.");
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
      reporterUid: user.uid,
      createdAt: new Date(),
    });
    const battletagRef = doc(
  db,
  "battletags",
  battleTag
);

const battletagSnap =
  await getDoc(battletagRef);

if (!battletagSnap.exists()) {
  await setDoc(battletagRef, {
    battletag: battleTag,
    reportCount: 1,
    lastReportedAt: new Date(),
  });
} else {
  await updateDoc(battletagRef, {
    reportCount: increment(1),
    lastReportedAt: new Date(),
  });
}
alert(
  `${battleTag} 신고가 접수되었습니다.`
);

navigate("/");
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "50px",
      }}
    >
      <h1>핵 사용자 신고</h1>

      <br />

      <input
        type="text"
        placeholder="배틀태그 입력 (예: Hacker#1234)"
        value={battleTag}
        onChange={(e) => setBattleTag(e.target.value)}
        style={{
          width: "400px",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
        }}
      />

      <br />
      <br />

      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        style={{
          width: "400px",
          padding: "12px",
          borderRadius: "8px",
        }}
      >
        <option value="">신고 사유 선택</option>
        <option value="에임핵">에임핵</option>
        <option value="월핵">월핵</option>
        <option value="트리거봇">트리거봇</option>
        <option value="기타">기타</option>
      </select>

      <br />
      <br />

      <button
        onClick={handleReport}
        style={{
          padding: "12px 24px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        신고하기
      </button>
    </div>
  );
}