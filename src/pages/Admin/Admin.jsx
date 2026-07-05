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
        // 🌟 [권한 검사 다이어트] 이제 users 컬렉션에서 내 role 필드만 확인합니다!
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().role === "admin") {
          loadReports(); // 🟢 관리자 확인 완료되면 신고 리스트 로딩
        } else {
          alert("관리자 권한이 없습니다.");
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
      await deleteDoc(doc(db, "reports", reportId));

      const q = query(
        collection(db, "battletags"),
        where("battletag", "==", targetBattletag)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const tagDoc = snapshot.docs[0];
        const currentCount = tagDoc.data().count || 1;

        if (currentCount <= 1) {
          await deleteDoc(doc(db, "battletags", tagDoc.id));
        } else {
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
          
          {report.details && (
            <div className="report-details-box">
              <span className="report-details-title">📝 세부사항</span>
              <div className="report-details-text">{report.details}</div>
            </div>
          )}

          {/* ✨ 인라인 스타일을 완벽하게 제거하고 클래스명으로 교체했습니다! */}
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