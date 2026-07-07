// src/pages/Login/Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "@/firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Turnstile } from "react-turnstile";
import { useLogin } from "@/hooks";
import './Login.css';

export function Login() {
  const {
    email, setEmail,
    password, setPassword,
    keepLoggedIn, setKeepLoggedIn,
    rememberEmail, setRememberEmail,
    isLoggingIn, handleDiscordLogin, executeLogin,
    failedAttempts,
    loginError, setLoginError // ✨ 훅에서 에러 상태 가져오기
  } = useLogin();

  const [loginCaptcha, setLoginCaptcha] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCaptcha, setResetCaptcha] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // 1. 기존 로그인 실행 함수 래핑 (캡챠 검증 추가)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (failedAttempts >= 5 && !loginCaptcha) {
      // ✨ alert 대신 인라인 에러 띄우기
      return setLoginError("로봇이 아님을 인증해 주세요.");
    }
    executeLogin(e);
  };

  const handleFormKeyDown = (e) => {
    if (e.key === "Enter") handleLoginSubmit(e);
  };

  // 2. 비밀번호 재설정 이메일 발송 함수 (여긴 팝업 형태라 alert 유지해도 무방합니다)
  const handlePasswordReset = async () => {
    if (!resetEmail) return alert("가입하신 이메일을 입력해 주세요.");
    if (!resetCaptcha) return alert("로봇이 아님을 인증해 주세요.");

    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert("비밀번호 재설정 링크가 이메일로 발송되었습니다!\n메일함을 확인해 주세요.");
      setShowForgotModal(false);
      setResetEmail("");
      setResetCaptcha("");
    } catch (error) {
      console.error("이메일 발송 에러:", error);
      if (error.code === 'auth/user-not-found') alert("가입되지 않은 이메일입니다.");
      else alert("이메일 발송에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleLoginSubmit} onKeyDown={handleFormKeyDown} className="login-box" noValidate>
        <h1 className="login-title">로그인</h1>

        <button type="button" onClick={handleDiscordLogin} className="btn-discord">
          디스코드로 로그인
        </button>

        <label className="input-label auth-label">이메일</label>
        <input
          value={email}
          onChange={(e) => { setEmail(e.target.value); setLoginError(""); /* 타이핑 시 에러 숨김 */ }}
          type="email" placeholder="example@email.com" className="input-field"
        />

        <label className="input-label">비밀번호</label>
        <input
          value={password}
          onChange={(e) => { setPassword(e.target.value); setLoginError(""); /* 타이핑 시 에러 숨김 */ }}
          type="password" placeholder="비밀번호 입력" className="input-field"
        />

        <div className="checkbox-group-wrapper">
          <div className="checkbox-item">
            <input type="checkbox" id="keepLogin" checked={keepLoggedIn} onChange={(e) => setKeepLoggedIn(e.target.checked)} className="checkbox-input" />
            <label htmlFor="keepLogin" className="checkbox-label">로그인 상태 유지</label>
          </div>
          <div className="checkbox-item">
            <input type="checkbox" id="saveEmail" checked={rememberEmail} onChange={(e) => setRememberEmail(e.target.checked)} className="checkbox-input" />
            <label htmlFor="saveEmail" className="checkbox-label">이메일 저장</label>
          </div>
        </div>

        {/* ✨ 5회 이상 실패 시 캡챠 등장! */}
        {failedAttempts >= 5 && (
          <div className="captcha-container">
            <Turnstile sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onVerify={(token) => { setLoginCaptcha(token); setLoginError(""); }} />
          </div>
        )}

        {/* ✨ 인라인 에러 텍스트 출력 영역 */}
        {loginError && <p className="error-text">{loginError}</p>}

        <button type="submit" className="btn-login" disabled={isLoggingIn}>
          {isLoggingIn ? "로그인 중..." : "로그인"}
        </button>

        <div className="link-wrapper">
          <Link to="/register" className="text-link">회원가입</Link>
          <span style={{ color: "var(--border-color)" }}>|</span>
          <button type="button" onClick={() => setShowForgotModal(true)} className="text-link" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
            비밀번호 찾기
          </button>
          <span style={{ color: "var(--border-color)" }}>|</span>
          <Link to="/" className="text-link">홈으로</Link>
        </div>
      </form>

      {/* ✨ 비밀번호 찾기 모달창 */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">비밀번호 찾기</h2>
            <p className="modal-desc">가입하신 이메일 주소를 입력하시면,<br />비밀번호 재설정 링크를 보내드립니다.</p>

            <input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} type="email" placeholder="가입한 이메일 입력" className="input-field" style={{ marginBottom: 0 }} />

            <div className="captcha-container">
              <Turnstile sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onVerify={(token) => setResetCaptcha(token)} />
            </div>

            <div className="modal-btn-group">
              <button onClick={handlePasswordReset} className="btn-login" disabled={isResetting} style={{ flex: 1, marginTop: 0 }}>
                {isResetting ? "발송 중..." : "이메일 받기"}
              </button>
              <button onClick={() => setShowForgotModal(false)} className="btn-login" style={{ flex: 1, marginTop: 0, background: "transparent", color: "var(--text-sub)", border: "1px solid var(--border-color)" }}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}