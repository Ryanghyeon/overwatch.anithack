// src/hooks/useMyProfile.js
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export function useMyProfile(user) {
    const [myBattletag, setMyBattletag] = useState("");
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        // 유저 정보가 없으면 로딩을 끄고 바로 리턴
        if (!user) {
            setProfileLoading(false);
            return;
        }

        const fetchMyProfile = async () => {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setMyBattletag(docSnap.data().battletag || "");
                }
            } catch (error) {
                console.error("내 정보 불러오기 에러:", error);
            } finally {
                setProfileLoading(false);
            }
        };

        fetchMyProfile();
    }, [user]);

    return { myBattletag, profileLoading };
}