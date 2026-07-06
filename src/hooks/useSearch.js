// 검색 기능을 위한 커스텀 훅
// src/hooks/useSearch.js
import { useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { isValidBattletag } from "@/utils";

export function useSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const executeSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        if (!isValidBattletag(searchQuery)) {
            alert("올바른 배틀태그 형식이 아닙니다. (예: 홍길동#1234)");
            return;
        }

        setIsSearching(true);
        try {
            const q = query(collection(db, "battletags"), where("battletag", "==", searchQuery.trim()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const tagDoc = querySnapshot.docs[0];
                setSearchResult({ id: tagDoc.id, ...tagDoc.data() });
            } else {
                setSearchResult(false);
            }
        } catch (error) {
            console.error("검색 중 에러 발생:", error);
            alert("검색 중 오류가 발생했습니다.");
        } finally {
            setIsSearching(false);
        }
    };

    return { searchQuery, setSearchQuery, searchResult, isSearching, executeSearch };
}