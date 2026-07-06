// 유저 로그인 훅
// src/hooks/useLogin.js
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "@/firebase/firebase";
import { signInWithEmailAndPassword, signInWithCustomToken, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";

export function useLogin() {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);
    const [rememberEmail, setRememberEmail] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false); // ✨ 따닥(중복 클릭) 방지용 로딩 상태

    // 1. 저장된 이메일 불러오기
    useEffect(() => {
        const savedEmail = localStorage.getItem("savedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberEmail(true);
        }
    }, []);

    // 2. 디스코드 로그인 콜백 처리
    useEffect(() => {
        const token = params.get("token");
        if (!token) return;

        async function processDiscordLogin() {
            try {
                await signInWithCustomToken(auth, token);
                navigate("/");
            } catch (err) {
                console.error("디스코드 로그인 실패:", err);
                alert("로그인 처리 중 문제가 발생했습니다.");
            }
        }
        processDiscordLogin();
    }, [params, navigate]);

    // 3. 디스코드 로그인 버튼 클릭 시
    const handleDiscordLogin = () => {
        const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
        const redirectUri = encodeURIComponent(
            "https://overwatch-anithack-otzm.vercel.app/api/auth/discord/callback"
        );
        window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;
    };

    // 4. 이메일 로그인 실행
    const executeLogin = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!email.trim() || !password.trim()) {
            alert("이메일과 비밀번호를 모두 입력해 주세요.");
            return;
        }

        setIsLoggingIn(true); // 로딩 시작

        try {
            const persistenceType = keepLoggedIn ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistenceType);

            await signInWithEmailAndPassword(auth, email, password);

            if (rememberEmail) {
                localStorage.setItem("savedEmail", email);
            } else {
                localStorage.removeItem("savedEmail");
            }

            navigate("/");
        } catch (error) {
            console.error(error);
            alert("이메일이나 비밀번호가 올바르지 않습니다.");
        } finally {
            setIsLoggingIn(false); // 로딩 종료
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        keepLoggedIn, setKeepLoggedIn,
        rememberEmail, setRememberEmail,
        isLoggingIn, handleDiscordLogin, executeLogin
    };
}