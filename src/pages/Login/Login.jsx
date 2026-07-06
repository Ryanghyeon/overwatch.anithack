// src/pages/Login/Login.jsx
import { Link } from "react-router-dom";
import { useLogin } from "@/hooks";
import './Login.css';

export default function Login() {
  const {
    email, setEmail,
    password, setPassword,
    keepLoggedIn, setKeepLoggedIn,
    rememberEmail, setRememberEmail,
    isLoggingIn, handleDiscordLogin, executeLogin
  } = useLogin();

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

        <div className="checkbox-group-wrapper">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="keepLogin"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="checkbox-input"
            />
            <label htmlFor="keepLogin" className="checkbox-label">
              로그인 상태 유지
            </label>
          </div>

          <div className="checkbox-item">
            <input
              type="checkbox"
              id="saveEmail"
              checked={rememberEmail}
              onChange={(e) => setRememberEmail(e.target.checked)}
              className="checkbox-input"
            />
            <label htmlFor="saveEmail" className="checkbox-label">
              이메일 저장
            </label>
          </div>
        </div>

        <button type="submit" className="btn-login" disabled={isLoggingIn}>
          {isLoggingIn ? "로그인 중..." : "로그인"}
        </button>

        <div className="link-wrapper">
          <Link to="/register" className="text-link">회원가입(이메일 인증)</Link>
          <Link to="/" className="text-link">홈으로 돌아가기</Link>
        </div>
      </form>
    </div>
  );
}