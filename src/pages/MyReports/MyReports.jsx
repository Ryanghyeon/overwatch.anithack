// src/pages/MyReports/MyReports.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { useAuth } from "@/hooks";
import "./MyReports.css";

export function MyReports() {
    const { user, isAuthLoading } = useAuth();
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthLoading) return;

        if (!user) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        const fetchMyReports = async () => {
            try {
                const q = query(
                    collection(db, "reports"),
                    where("reporterUid", "==", user.uid || user.id)
                );

                const querySnapshot = await getDocs(q);
                const fetchedReports = [];

                querySnapshot.forEach((doc) => {
                    fetchedReports.push({ id: doc.id, ...doc.data() });
                });

                fetchedReports.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

                setReports(fetchedReports);
            } catch (error) {
                console.error("신고 내역 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyReports();
    }, [user, isAuthLoading, navigate]);

    if (isAuthLoading || loading) {
        return (
            <div className="reports-wrapper">
                <div className="reports-loading">데이터를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="reports-wrapper">
            <div className="reports-box">
                <button className="btn-back" onClick={() => navigate(-1)}>⬅ 뒤로 가기</button>

                <h1 className="reports-title">📜 내 신고 내역</h1>
                <p className="reports-subtitle">지금까지 내가 접수한 신고 목록입니다.</p>

                {/* ✨ 새롭게 추가된 총 신고 횟수 요약 박스 ✨ */}
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
                                onClick={() => navigate('/report')}
                            >
                                신고하러 가기
                            </button>
                        </div>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className="report-card">
                                <div className="report-header">
                                    <span className="reported-tag">{report.battletag || "알 수 없음"}</span>
                                    <span className="report-date">
                                        {report.createdAt ? report.createdAt.toDate().toLocaleDateString() : "날짜 없음"}
                                    </span>
                                </div>
                                <div className="report-body">
                                    <span className="report-reason-badge">{report.reason || "기타"}</span>
                                    <p className="report-description">
                                        {report.details || "상세 내용이 없습니다."}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}