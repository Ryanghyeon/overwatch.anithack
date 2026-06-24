import { useEffect, useState } from "react";

import { db } from "../firebase/firebase";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Admin() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
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