// 오버워치 api 요청 훅
// src/hooks/useOverwatch.js
import { useState, useEffect } from "react";

export function useOverwatch(battletag) {
    // 기본 요약 정보 (아바타, 닉네임, 칭호, 추천레벨, 비공개여부, 경쟁전 티어 등)
    const [owData, setOwData] = useState(null);
    // 상세 스탯 정보 (모스트 영웅, 승률 등 - 공개 프로필만 가능)
    const [owStats, setOwStats] = useState(null);

    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    useEffect(() => {
        if (!battletag) return;

        const fetchOwData = async () => {
            setApiLoading(true);
            setApiError(null);

            // 배틀태그의 '#'을 '-'로 변환 (API 규칙)
            const formattedTag = battletag.replace("#", "-");

            try {
                // 1차 요청: 유저 기본 요약 정보 가져오기
                const summaryRes = await fetch(`https://overfast-api.tekrop.fr/players/${formattedTag}/summary`);
                if (!summaryRes.ok) throw new Error("계정을 찾을 수 없거나 잘못된 배틀태그입니다.");

                const summaryData = await summaryRes.json();
                setOwData(summaryData);

                // 2차 요청: 프로필이 '공개(public)' 상태일 때만 상세 스탯 긁어오기!
                if (summaryData.privacy === "public") {
                    try {
                        const statsRes = await fetch(`https://overfast-api.tekrop.fr/players/${formattedTag}/stats/summary`);
                        if (statsRes.ok) {
                            const statsData = await statsRes.json();
                            setOwStats(statsData);
                        }
                    } catch (e) {
                        console.warn("상세 스탯을 불러오는데 실패했습니다.", e);
                    }
                } else {
                    // 비공개 계정이면 스탯을 null로 밀어버림
                    setOwStats(null);
                }

            } catch (err) {
                setApiError(err.message);
            } finally {
                setApiLoading(false);
            }
        };

        fetchOwData();
    }, [battletag]);

    // ✨ 반환값에 'owStats'가 추가되었습니다!
    return { owData, owStats, apiLoading, apiError };
}
