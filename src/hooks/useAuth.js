// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true); // 로딩 상태

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        const updates = {};
                        if (!data.role) updates.role = "user";
                        if (!data.createdAt) updates.createdAt = new Date();
                        if (!data.photoUrl && data.avatar) {
                            updates.photoUrl = `https://cdn.discordapp.com/avatars/${data.uid}/${data.avatar}.png`;
                        }
                        if (Object.keys(updates).length > 0) {
                            await setDoc(userRef, updates, { merge: true });
                        }
                        setUserName(data.username || (currentUser.email ? currentUser.email.split("@")[0] : "유저"));
                        setIsAdmin(data.role === "admin" || updates.role === "admin");
                    } else {
                        const defaultName = currentUser.email ? currentUser.email.split("@")[0] : "유저";
                        await setDoc(userRef, {
                            uid: currentUser.uid,
                            username: defaultName,
                            photoUrl: "https://cdn.discordapp.com/embed/avatars/0.png",
                            role: "user",
                            createdAt: new Date(),
                        });
                        setUserName(defaultName);
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error("유저 정보 불러오기 에러:", error);
                }
            } else {
                const discordUserStr = localStorage.getItem("user");
                if (discordUserStr) {
                    const parsedUser = JSON.parse(discordUserStr);
                    setUser(parsedUser);
                    const discordUid = parsedUser.id || parsedUser.uid;
                    try {
                        const userRef = doc(db, "users", discordUid);
                        const userSnap = await getDoc(userRef);

                        if (userSnap.exists()) {
                            const data = userSnap.data();
                            const updates = {};
                            if (!data.role) updates.role = "user";
                            if (!data.createdAt) updates.createdAt = new Date();
                            if (Object.keys(updates).length > 0) {
                                await setDoc(userRef, updates, { merge: true });
                            }
                            setUserName(data.username || parsedUser.username);
                            setIsAdmin(data.role === "admin" || updates.role === "admin");
                        } else {
                            const defaultData = {
                                uid: discordUid,
                                username: parsedUser.username,
                                photoUrl: parsedUser.avatar ? `https://cdn.discordapp.com/avatars/${parsedUser.id}/${parsedUser.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png",
                            };
                            await setDoc(userRef, { ...defaultData, role: "user", createdAt: new Date() });
                            setUserName(parsedUser.username);
                            setIsAdmin(false);
                        }
                    } catch (error) {
                        console.error("디스코드 DB 동기화 에러:", error);
                    }
                } else {
                    setUser(null);
                    setUserName("");
                    setIsAdmin(false);
                }
            }
            setIsAuthLoading(false); // 인증 확인 끝!
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await auth.signOut();
        localStorage.removeItem("user");
        window.location.reload();
    };

    return { user, userName, isAdmin, isAuthLoading, handleLogout };
}