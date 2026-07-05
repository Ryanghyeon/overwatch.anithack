import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [params] = useSearchParams();

  useEffect(() => {
    // 1. 주소창에서 토큰 가져오기
    const token = params.get("token");
    console.log("🔍 현재 주소창의 token 값:", token);

    // 토큰이 없으면 여기서 함수가 종료되므로 화면이 그대로 멈춰있게 됩니다.
    if (!token) {
      console.log("⚠️ 토큰이 없습니다. 대기 중...");
      return;
    }

    async function login() {
      try {
        console.log("🚀 파이어베이스 커스텀 토큰 로그인 시도 중...");
        await signInWithCustomToken(auth, token);
        console.log("✅ 로그인 성공! 메인 페이지로 이동합니다.");
        navigate("/");
      } catch (err) {
        console.error("🚨 로그인 에러 발생:", err);
        alert(`로그인 실패: ${err.message}`);
      }
    }

    login();
  }, [params, navigate]);

  const handleDiscordLogin = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      "https://overwatch-anithack-otzm.vercel.app/api/auth/discord/callback"
    );
    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;

    window.location.href = url;
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "400px", padding: "40px", backgroundColor: "#1e293b", borderRadius: "12px", color: "white" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>로그인</h1>
        
        <button onClick={handleDiscordLogin} style={{ width: "100%", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", marginTop: "10px", backgroundColor: "#5865F2", color: "white" }}>
          디스코드로 로그인
        </button>

        <label style={{ display: "block", marginTop: "20px" }}>이메일</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="example@email.com" style={{ width: "100%", padding: "12px", marginTop: "8px", marginBottom: "20px", borderRadius: "8px", border: "none" }} />

        <label style={{ display: "block" }}>비밀번호</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="비밀번호 입력" style={{ width: "100%", padding: "12px", marginTop: "8px", marginBottom: "20px", borderRadius: "8px", border: "none" }} />

        <button onClick={handleLogin} style={{ width: "100%", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", backgroundColor: "#3b82f6", color: "white" }}>
          로그인
        </button>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/register" style={{ color: "#60a5fa", textDecoration: "none" }}>회원가입</Link>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/" style={{ color: "#60a5fa", textDecoration: "none" }}>홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}
