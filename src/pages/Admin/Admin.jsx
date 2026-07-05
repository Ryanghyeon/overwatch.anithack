import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  updateDoc,
} from "firebase/firestore";
import "./Admin.css";

export default function Admin() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        const adminRef = doc(db, "admins", "masterAdmin");
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists() && adminSnap.data()[user.email] !== undefined) {
          loadReports();
        } else {
          alert("관리자만 접근 가능합니다.");
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        alert("관리자 확인 중 오류가 발생했습니다.");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadReports = async () => {
    try {
      // ✅ reports 컬렉션을 'createdAt' 기준으로 내림차순(desc) 정렬해서 가져와라!
      const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReports(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (reportId, targetBattletag) => {
    if (!window.confirm("정말로 이 신고 내역을 삭제하시겠습니까?")) return;

    try {
      // 1. [reports] 장부에서 해당 신고 내역 삭제
      await deleteDoc(doc(db, "reports", reportId));

      // 2. [battletags] 장부에서 해당 배틀태그 검색
      const q = query(
        collection(db, "battletags"),
        where("battletag", "==", targetBattletag)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // 해당 배틀태그 문서를 찾았다면
        const tagDoc = snapshot.docs[0];
        const currentCount = tagDoc.data().count || 1;

        if (currentCount <= 1) {
          // 카운트가 1이었는데 방금 지웠으니, 아예 명단에서 삭제!
          await deleteDoc(doc(db, "battletags", tagDoc.id));
        } else {
          // 카운트가 2 이상이면 1 빼고 업데이트!
          await updateDoc(doc(db, "battletags", tagDoc.id), {
            count: currentCount - 1,
          });
        }
      }

      alert("삭제 완료 및 랭킹 데이터 동기화 성공!");
      loadReports();
      
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

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
          
          {/* ✅ 세부사항이 있을 때만 화면에 그려주는 조건부 렌더링! */}
          {report.details && (
            <div className="report-details-box">
              <span className="report-details-title">📝 세부사항</span>
              <div className="report-details-text">{report.details}</div>
            </div>
          )}

          <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
            <p className="report-uid" style={{ margin: 0 }}>
              신고자 UID : {report.reporterUid}
            </p>
            <Link to={`/profile/${report.reporterUid}`}>
              <button style={{
                background: "rgba(56, 189, 248, 0.1)",
                color: "#38bdf8",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px"
              }}>
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