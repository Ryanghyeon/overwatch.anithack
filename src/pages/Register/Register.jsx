// src/pages/Register/Register.jsx
import { useState } from 'react';
import { Link } from "react-router-dom";
import { Turnstile } from '@marsidev/react-turnstile'; // ✨ 턴스타일 임포트
import { useRegister } from "@/hooks";
import './Register.css';

export default function Register() {
  // ✨ 캡챠 통과 시 발급받을 '통행증'을 보관하는 공간
  const [captchaToken, setCaptchaToken] = useState(null);

  const {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    isRegistering, executeRegister
  } = useRegister();

  // ✨ 버튼 클릭 시 캡챠 통과 여부를 먼저 검사하는 방패 함수
  const handleRegisterClick = () => {
    if (!captchaToken) {
      alert("로봇이 아님을 인증해 주세요!");
      return;
    }

    // 검증을 통과했다면, 원래 있던 가입 함수를 실행하면서 토큰도 같이 넘겨줍니다!
    executeRegister(captchaToken);
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h1 className="register-title">회원가입</h1>

        <label className="input-label">닉네임</label>
        <input
          type="text"
          placeholder="닉네임 입력"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />

        <label className="input-label">이메일</label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />

        <label className="input-label">비밀번호</label>
        <input
          type="password"
          placeholder="최소 6자리 이상"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />

        {/* ✨ 가입 버튼 바로 위에 캡챠 위젯 등판! */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Turnstile
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            onSuccess={(token) => setCaptchaToken(token)}
          />
        </div>

        {/* ✨ 실행 함수를 handleRegisterClick 으로 교체 */}
        <button
          onClick={handleRegisterClick}
          className="btn-register"
          disabled={isRegistering}
        >
          {isRegistering ? "가입 처리 중..." : "회원가입"}
        </button>

        <div className="link-wrapper">
          <Link to="/login" className="text-link">
            로그인 하러가기
          </Link>
        </div>
      </div>
    </div>
  );
}