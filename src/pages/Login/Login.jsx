import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";
import './Login.css';

export default function Login() {
  const navigate = useNavigate();  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (!token) return;

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

  // 🔥 핵심 로그인 로직 (e가 넘어오면 무조건 브라우저 기본 동작부터 차단)
  const executeLogin = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // 이벤트가 상위 레이아웃으로 퍼져서 씹히는 것 방지
    }

    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("이메일이나 비밀번호가 올바르지 않습니다."); 
    }
  };

  // ✨ 방어막 1: PC 브라우저에서 엔터키를 직접 낚아채는 함수
  const handleFormKeyDown = (e) => {
    if (e.key === "Enter") {
      // 엔터키 고유의 브라우저 기본 서브밋 동작을 여기서 미리 차단하고
      e.preventDefault(); 
      // 우리가 만든 로그인 로직을 직접 강제 호출합니다.
      executeLogin(e);
    }
  };

  return (
    <div className="login-wrapper">
      {/* ✨ 방어막 2 & 3 통합 
        - onSubmit: 마우스 클릭 및 모바일 키보드 '이동/완료' 버튼 대응
        - onKeyDown: PC에서 탭키나 인풋창 엔터키가 씹히는 현상 철저히 방어
      */}
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