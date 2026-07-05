import { useEffect, useState } from "react";

import { db, auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

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
      const adminQuery = query(
        collection(db, "admins"),
        where("email", "==", user.email)
      );

      const adminSnapshot = await getDocs(adminQuery);

      if (adminSnapshot.empty) {
        alert("관리자만 접근 가능합니다.");
        navigate("/");
        return;
      }

      loadReports();
    } catch (error) {
      console.error(error);
      alert("관리자 확인 중 오류가 발생했습니다.");
    }
  });

  return () => unsubscribe();
}, []);

  const loadReports = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "reports")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReports(data);

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "reports", id));

      alert("삭제 완료");

      loadReports();

    } catch (error) {
      console.error(error);
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
      <h1>관리자 대시보드</h1>
      <div style={{ marginBottom: "20px" }}>
  <Link to="/">
    <button>🏠 홈으로</button>
  </Link>
</div>

      <br />

      {reports.map((report) => (
        <div
          key={report.id}
          style={{
            backgroundColor: "#1e293b",
            padding: "20px",
            marginBottom: "15px",
            borderRadius: "10px",
          }}
        >
          <h3>{report.battletag}</h3>

          <p>사유 : {report.reason}</p>

          <p>
            신고자 UID :
            {report.reporterUid}
          </p>

          <button
            onClick={() =>
              handleDelete(report.id)
            }
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
