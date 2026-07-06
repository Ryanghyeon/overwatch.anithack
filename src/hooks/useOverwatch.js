// 오버워치 api 요청 훅
// src/hooks/useOverwatch.js
import { useState, useEffect } from "react";

export function useOverwatch(battletag) {
    const [owData, setOwData] = useState(null);
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    useEffect(() => {
        if (!battletag) return;

        const fetchOwData = async () => {
            setApiLoading(true);
            setApiError(null);
            // '#'을 '-'로 변환
            const formattedTag = battletag.replace("#", "-");

            try {
                const res = await fetch(`https://overfast-api.tekrop.fr/players/${formattedTag}/summary`);
                if (!res.ok) throw new Error("비공개 프로필이거나 존재하지 않는 계정입니다.");
                const data = await res.json();
                setOwData(data);
            } catch (err) {
                setApiError(err.message);
            } finally {
                setApiLoading(false);
            }
        };

        fetchOwData();
    }, [battletag]);

    return { owData, apiLoading, apiError };
}