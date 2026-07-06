// 신규 유저 회원가입 훅
// src/hooks/useRegister.js
import { useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export function useRegister() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false); // 로딩 상태 추가

    const executeRegister = async () => {
        // 1. 간단한 입력값 검사 추가
        if (!username || !email || !password) {
            alert("모든 항목을 입력해 주세요.");
            return;
        }
        if (password.length < 6) {
            alert("비밀번호는 최소 6자리 이상이어야 합니다.");
            return;
        }

        setIsRegistering(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                username,
                email,
                photoUrl: `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`,
                role: "user",
                createdAt: new Date(),
            });

            alert("회원가입 성공! 인증 메일을 발송했습니다. 이메일함을 확인해 주세요.");
            navigate("/login"); // 가입 성공 시 로그인 페이지로 이동

        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                alert("이미 가입된 이메일입니다.");
            } else {
                alert("회원가입 중 오류가 발생했습니다: " + error.message);
            }
        } finally {
            setIsRegistering(false);
        }
    };

    return {
        username, setUsername,
        email, setEmail,
        password, setPassword,
        isRegistering, executeRegister
    };
}