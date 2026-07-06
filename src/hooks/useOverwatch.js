// src/hooks/useOverwatch.js
import { useState, useEffect } from "react";

export function useOverwatch(battletag) {
    const [owData, setOwData] = useState(null);
    const [owStats, setOwStats] = useState(null);
    const [heroImages, setHeroImages] = useState({}); // ✨ 영웅 초상화 URL 저장소 추가!
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    useEffect(() => {
        if (!battletag) return;

        const fetchOwData = async () => {
            setApiLoading(true);
            setApiError(null);
            const formattedTag = battletag.replace("#", "-");

            try {
                // 1차: 기본 요약 정보와 '전체 영웅 초상화 목록'을 동시에 가져옵니다! (속도 최적화)
                const [summaryRes, heroesRes] = await Promise.all([
                    fetch(`https://overfast-api.tekrop.fr/players/${formattedTag}/summary`),
                    fetch('https://overfast-api.tekrop.fr/heroes')
                ]);

                if (!summaryRes.ok) throw new Error("계정을 찾을 수 없거나 잘못된 배틀태그입니다.");

                const summaryData = await summaryRes.json();
                setOwData(summaryData);

                // ✨ 영웅 이름(key)과 초상화 URL(portrait)을 짝지어서 딕셔너리로 만듭니다.
                if (heroesRes.ok) {
                    const heroesList = await heroesRes.json();
                    const imageMap = {};
                    heroesList.forEach(hero => {
                        imageMap[hero.key] = hero.portrait;
                    });
                    setHeroImages(imageMap);
                }

                // 2차: 상세 통계 가져오기
                try {
                    const statsRes = await fetch(`https://overfast-api.tekrop.fr/players/${formattedTag}/stats/summary`);

                    if (statsRes.ok) {
                        const statsData = await statsRes.json();
                        setOwStats(statsData);
                    } else {
                        setOwStats({});
                    }
                } catch (e) {
                    setOwStats({});
                }

            } catch (err) {
                setApiError(err.message);
            } finally {
                setApiLoading(false);
            }
        };

        fetchOwData();
    }, [battletag]);

    // ✨ heroImages도 밖으로 내보내줍니다.
    return { owData, owStats, heroImages, apiLoading, apiError };
}