// src/hooks/useRegister.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";

export function useRegister() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    // ✨ Register.jsx에서 넘겨준 캡챠 토큰을 파라미터로 쏙 받습니다.
    const executeRegister = async (captchaToken) => {
        // 1. 군더더기 없는 입력값 컷오프 (Early Return)
        if (!username || !email || !password) return alert("모든 항목을 입력해 주세요.");
        if (password.length < 6) return alert("비밀번호는 최소 6자리 이상이어야 합니다.");
        if (!captchaToken) return alert("로봇이 아님을 인증해 주세요.");

        setIsRegistering(true);

        try {
            // 2. 서버에 "이 통행증 진짜인지 확인해줘!" 요청 (실패하면 catch로 던져짐)
            // 주의: 백엔드 주소는 유저님의 실제 검증 API 주소로 맞춰주세요!
            await axios.post('/api/verify-captcha', { captchaToken });

            // 3. 캡챠 무사 통과! 파이어베이스 회원가입 진행
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            // 4. 성능 최적화: 이메일 발송과 DB 저장을 '동시에' 실행 (속도 2배 UP!)
            await Promise.all([
                sendEmailVerification(user),
                setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    username,
                    email,
                    photoUrl: `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`,
                    role: "user",
                    createdAt: new Date(),
                })
            ]);

            alert("회원가입 성공! 인증 메일을 발송했습니다. 이메일함을 확인해 주세요.");
            navigate("/login");

        } catch (error) {
            console.error("회원가입 에러:", error);

            // 캡챠 검증 실패 (HTTP 403 등)
            if (error.response?.status === 403) {
                alert("비정상적인 접근(로봇)으로 의심되어 차단되었습니다.");
            }
            // 파이어베이스 에러
            else if (error.code === 'auth/email-already-in-use') {
                alert("이미 가입된 이메일입니다.");
            } else {
                alert("회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
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