// src/hooks/useOverwatch.js 
import { useState, useEffect } from "react";

export function useOverwatch(battletag) {
    const [owData, setOwData] = useState(null);
    const [owStats, setOwStats] = useState({ quickplay: null, competitive: null });
    const [heroImages, setHeroImages] = useState({});
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    useEffect(() => {
        if (!battletag) return;

        const formattedTag = battletag.replace("#", "-");
        // ✨ 1. 배틀태그를 기반으로 고유한 캐시 키를 만듭니다.
        const CACHE_KEY = `ow_cache_${formattedTag}`;

        const fetchOwData = async () => {
            // ✨ 2. API를 호출하기 전에, 세션 스토리지에 저장된 전적이 있는지 먼저 검사합니다!
            try {
                const cachedData = sessionStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const parsedCache = JSON.parse(cachedData);
                    setOwData(parsedCache.owData);
                    setOwStats(parsedCache.owStats);
                    setHeroImages(parsedCache.heroImages);
                    return; // ⭐️ 저장된 데이터가 있다면 여기서 함수를 종료하여 불필요한 API 호출을 완벽 차단합니다!
                }
            } catch (e) {
                console.error("캐시 데이터를 읽어오는 중 에러 발생:", e);
            }

            setApiLoading(true);
            setApiError(null);

            try {
                // 1차: 기본 정보 및 초상화[cite: 6]
                const [summaryRes, heroesRes] = await Promise.all([
                    fetch(`https://overfast-api.tekrop.fr/players/${formattedTag}/summary`),
                    fetch('https://overfast-api.tekrop.fr/heroes')
                ]);

                if (!summaryRes.ok) throw new Error("계정을 찾을 수 없거나 잘못된 배틀태그입니다.");

                // 데이터를 state에 바로 넣지 않고, 캐싱을 위해 변수에 먼저 담아둡니다.
                const fetchedOwData = await summaryRes.json();
                let fetchedHeroImages = {};

                if (heroesRes.ok) {
                    const heroesList = await heroesRes.json();
                    heroesList.forEach(h => fetchedHeroImages[h.key] = h.portrait);
                }

                // 2차: 모스트 영웅 플레이 시간만 가져오기 (상세 스탯 제외)
                let fetchedOwStats = { quickplay: {}, competitive: {} };

                try {
                    // 딱 필요한 summary 데이터 2개만 가볍게 호출합니다!
                    const [qpSumRes, compSumRes] = await Promise.all([
                        fetch(`https://overfast-api.tekrop.fr/players/${formattedTag}/stats/summary?gamemode=quickplay`),
                        fetch(`https://overfast-api.tekrop.fr/players/${formattedTag}/stats/summary?gamemode=competitive`)
                    ]);

                    fetchedOwStats = {
                        quickplay: qpSumRes.ok ? await qpSumRes.json() : {},
                        competitive: compSumRes.ok ? await compSumRes.json() : {}
                    };

                } catch (e) {
                    console.error("요약 스탯을 불러오는 중 에러 발생:", e);
                    fetchedOwStats = { quickplay: {}, competitive: {} };
                }

                // ✨ 상태 업데이트 적용
                setOwData(fetchedOwData);
                setHeroImages(fetchedHeroImages);
                setOwStats(fetchedOwStats);

                // ✨ 3. 성공적으로 불러온 데이터를 하나로 묶어서 세션 스토리지에 저장합니다!
                try {
                    const cacheObj = {
                        owData: fetchedOwData,
                        heroImages: fetchedHeroImages,
                        owStats: fetchedOwStats
                    };
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
                } catch (e) {
                    console.error("캐시 데이터를 저장하는 중 에러 발생 (용량 초과 등):", e);
                }
            } catch (err) {
                setApiError(err.message);
            } finally {
                setApiLoading(false);
            }
        };

        fetchOwData();
    }, [battletag]);

    return { owData, owStats, heroImages, apiLoading, apiError };
}