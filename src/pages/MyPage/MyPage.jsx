// src/pages/MyPage/MyPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { useAuth } from "@/hooks";
import { OverwatchCard } from "@/components"; // ✨ 프로필에서 쫓겨났던 부품 소환!
import './MyPage.css';

export function MyPage() {
    const { user, userName } = useAuth();
    const navigate = useNavigate();

    // DB에서 진짜 내 배틀태그를 가져와서 저장할 State
    const [myBattletag, setMyBattletag] = useState("");
    const [loading, setLoading] = useState(true);

    // ✨ 화면이 켜지면 파이어베이스에서 내 프로필 정보를 스윽 가져옵니다.
    useEffect(() => {
        if (!user) return;

        const fetchMyProfile = async () => {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // DB에 배틀태그가 있으면 넣고, 없으면 빈 문자열("")로 세팅
                    setMyBattletag(docSnap.data().battletag || "");
                }
            } catch (error) {
                console.error("내 정보 불러오기 에러:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyProfile();
    }, [user]);

    if (!user) {
        return (
            <div className="mypage-wrapper">
                <div className="mypage-box">
                    <h2>로그인이 필요한 페이지입니다.</h2>
                    <button className="btn-action highlight" onClick={() => navigate('/login')}>로그인 하러 가기</button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="mypage-wrapper">
                <div className="mypage-box">
                    <h2 style={{ color: "white" }}>데이터를 불러오는 중...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="mypage-wrapper">
            <div className="mypage-box">
                <h1 className="mypage-title">My Page</h1>
                <p className="mypage-subtitle">{userName} 님의 전용 공간입니다</p>

                {/* ✨ 오버워치 연동 정보 카드 ✨ */}
                <div className="ow-account-card">
                    <div className="ow-account-label">블리자드 연동 계정</div>
                    <div className="ow-account-info">
                        {myBattletag ? (
                            <>
                                <span className="ow-battletag">{myBattletag}</span>
                                <span className="ow-status">✅ 연동됨</span>
                            </>
                        ) : (
                            <>
                                <span className="ow-battletag" style={{ color: "#7b8398" }}>연동된 계정이 없습니다</span>
                                {/* 연동 안 된 사람은 프로필 설정 창으로 보내버리기! */}
                                <button
                                    className="btn-action highlight small"
                                    style={{ height: "32px", width: "auto", padding: "0 15px", fontSize: "0.85rem" }}
                                    onClick={() => navigate('/Profile')}
                                >
                                    연동하러 가기
                                </button>
                            </>
                        )}
                    </div>

                    {/* ✨ 진짜 오버워치 API 정보를 그려주는 컴포넌트 등판! (배틀태그가 있을 때만 렌더링) */}
                    {myBattletag && (
                        <div style={{ marginTop: "15px", borderTop: "1px solid #3a3f50", paddingTop: "5px" }}>
                            <OverwatchCard battletag={myBattletag} />
                        </div>
                    )}
                </div>

                <div className="mypage-menu">
                    <Link to="/my-reports" className="btn-action highlight">📜 내 신고 내역 보기</Link>
                    <Link to="/Profile" className="btn-action">⚙️ 내 프로필 설정</Link>

                    <button
                        className="btn-action outline"
                        style={{ marginTop: "20px" }}
                        onClick={() => navigate('/')}
                    >
                        🏠 홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}