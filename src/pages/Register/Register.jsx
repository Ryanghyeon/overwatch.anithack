// src/pages/Register/Register.jsx
import { useState } from 'react';
import { Link } from "react-router-dom";
import { Turnstile } from '@marsidev/react-turnstile';
import { useRegister } from "@/hooks";
import { isValidBattletag } from "@/utils"; // ✨ 배틀태그 무결성 검증 유틸 소환!
import './Register.css';

export function Register() {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [battletag, setBattletag] = useState(""); // ✨ 배틀태그 상태 추가

  const {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    isRegistering, executeRegister
  } = useRegister();

  const handleRegisterClick = () => {
    // ✨ 1순위: 배틀태그를 입력했다면 무결성 검사부터 진행! (빈칸이면 통과)
    if (battletag.trim() && !isValidBattletag(battletag)) {
      alert("올바른 배틀태그 형식이 아닙니다. (예: 트레이서#1234)");
      return;
    }

    // 2순위: 캡챠 검사
    if (!captchaToken) {
      alert("로봇이 아님을 인증해 주세요!");
      return;
    }

    // ✨ 검증을 모두 통과했다면, executeRegister에 캡챠 토큰과 '배틀태그'를 같이 넘겨줍니다!
    executeRegister(captchaToken, battletag.trim());
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

        {/* ✨ 배틀태그 선택 입력창 추가 ✨ */}
        <label className="input-label">오버워치 배틀태그 (선택)</label>
        <input
          type="text"
          placeholder="트레이서#1234"
          value={battletag}
          onChange={(e) => setBattletag(e.target.value)}
          className="input-field"
          style={{ marginBottom: "5px" }} /* 팁 문구와 간격 조절 */
        />
        <p className="input-tip">💡 가입 후 마이페이지에서도 등록/수정할 수 있습니다.</p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '15px' }}>
          <Turnstile
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            onSuccess={(token) => setCaptchaToken(token)}
          />
        </div>

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