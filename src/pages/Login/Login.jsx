import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword, signInWithCustomToken, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import './Login.css';

export default function Login() {
  const navigate = useNavigate();  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [params] = useSearchParams();
  
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  // ✨ 에러 1 해결: State는 반드시 컴포넌트 안에 위치!
  const [rememberEmail, setRememberEmail] = useState(false); 

  // ✨ 에러 2 해결: 이메일 불러오기는 디스코드 로그인과 분리해서 별도의 useEffect로 독립!
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true); 
    }
  }, []);

  // 디스코드 로그인 콜백 처리
  useEffect(() => {
    const token = params.get("token");
    if (!token) return; // 토큰이 없으면 여기서 멈춤

    async function login() {
      try {
        await signInWithCustomToken(auth, token);
        navigate("/");
      } catch (err) {
        console.error("디스코드 로그인 실패:", err);
        alert("로그인 처리 중 문제가 발생했습니다.");
      }
    }
    login();
  }, [params, navigate]);

  const handleDiscordLogin = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      "https://overwatch-anithack-otzm.vercel.app/api/auth/discord/callback"
    );
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;
  };

  const executeLogin = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

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
    }
  };

  const handleFormKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      executeLogin(e);
    }
  };

  return (
    <div className="login-wrapper">
      <form 
        onSubmit={executeLogin} 
        onKeyDown={handleFormKeyDown} 
        className="login-box" 
        noValidate
      >
        <h1 className="login-title">로그인</h1>
        
        <button type="button" onClick={handleDiscordLogin} className="btn-discord">
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              id="keepLogin" 
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              style={{ marginRight: '6px', cursor: 'pointer' }}
            />
            <label htmlFor="keepLogin" style={{ color: '#94a3b8', fontSize: '13px', cursor: 'pointer', userSelect: 'none' }}>
              로그인 상태 유지
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              id="saveEmail" 
              checked={rememberEmail}
              onChange={(e) => setRememberEmail(e.target.checked)}
              style={{ marginRight: '6px', cursor: 'pointer' }}
            />
            <label htmlFor="saveEmail" style={{ color: '#94a3b8', fontSize: '13px', cursor: 'pointer', userSelect: 'none' }}>
              이메일 저장
            </label>
          </div>
        </div>

        <button type="submit" className="btn-login">
          로그인
        </button>

        <div className="link-wrapper" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
          <Link to="/register" className="text-link">회원가입</Link>
          <Link to="/" className="text-link">홈으로 돌아가기</Link>
        </div>
      </form>
    </div>
  );
}