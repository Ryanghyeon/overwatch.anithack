import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import './Login.css';

export default function Login() {
  const navigate = useNavigate();  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    console.log("🔍 현재 주소창의 token 값:", token);

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
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="login-title">로그인</h1>
        
        <button onClick={handleDiscordLogin} className="btn-discord">
          디스코드로 로그인
        </button>

        <label className="input-label auth-label">이메일</label>
        <input 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          type="email" 
          placeholder="example@email.com" 
          className="input-field" 
        />

        <label className="input-label">비밀번호</label>
        <input 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          type="password" 
          placeholder="비밀번호 입력" 
          className="input-field" 
        />

        <button onClick={handleLogin} className="btn-login">
          로그인
        </button>

        <div className="link-wrapper">
          <Link to="/register" className="text-link">회원가입</Link>
        </div>

        <div className="link-wrapper">
          <Link to="/" className="text-link">홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}