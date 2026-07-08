/* src/pages/Register/Register.jsx */

import { useState } from "react";
// ✨ 1. 페이지 이동을 위해 useNavigate를 수입해 옵니다!
import { Link, useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRegister } from "@/hooks";
import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isValidBattletag,
} from "@/utils";
import "./Register.css";

const InputGroup = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  tip,
  error,
}) => (
  <div style={{ marginBottom: "15px" }}>
    <label className="input-label">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`input-field ${error ? "input-error" : ""}`}
      style={{ marginBottom: "4px" }}
    />
    <div
      style={{ minHeight: "18px", display: "flex", alignItems: "flex-start" }}
    >
      {error ? (
        <p
          style={{
            color: "#ef4444",
            fontSize: "12px",
            margin: 0,
            fontWeight: "bold",
          }}
        >
          🚨 {error}
        </p>
      ) : (
        tip && (
          <p className="input-tip" style={{ margin: 0 }}>
            {tip}
          </p>
        )
      )}
    </div>
  </div>
);

export function Register() {
  // ✨ 2. 네비게이션 함수 장착!
  const navigate = useNavigate();

  const [captchaToken, setCaptchaToken] = useState(null);
  const [battletag, setBattletag] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [battletagError, setBattletagError] = useState("");

  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    isRegistering,
    executeRegister,
  } = useRegister();

  // ✨ 3. 함수를 비동기(async)로 변경합니다.
  const handleRegisterClick = async () => {
    let hasError = false;

    if (!username.trim()) {
      setUsernameError("닉네임을 입력해 주세요.");
      hasError = true;
    } else if (!isValidUsername(username)) {
      setUsernameError("닉네임은 특수문자를 제외한 2~12자여야 합니다.");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!email.trim()) {
      setEmailError("이메일을 입력해 주세요.");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError("이메일 형식이 올바르지 않습니다.");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("비밀번호를 입력해 주세요.");
      hasError = true;
    } else if (!isValidPassword(password)) {
      setPasswordError("비밀번호는 최소 6자리 이상이어야 합니다.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (battletag.trim() && !isValidBattletag(battletag)) {
      setBattletagError(
        "Battletag 형식이 올바르지 않습니다. 예: 트레이서#1234",
      );
      hasError = true;
    } else {
      setBattletagError("");
    }

    if (hasError) return;

    if (!captchaToken) {
      alert("로봇이 아님을 인증해 주세요!");
      return;
    }

    // ✨ 4. 가입 로직을 실행하고(await), 성공하면 alert 후 로그인 페이지로 쏩니다!
    try {
      // await executeRegister("dummy", battletag.trim());
      await executeRegister("captchaToken", battletag.trim());
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h1 className="register-title">회원가입</h1>

        <InputGroup
          label="닉네임"
          placeholder="특수문자 제외 2~12자"
          value={username}
          onChange={(val) => {
            setUsername(val);
            if (usernameError) setUsernameError("");
          }}
          error={usernameError}
        />

        <InputGroup
          label="이메일"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(val) => {
            setEmail(val);
            if (emailError) setEmailError("");
          }}
          error={emailError}
        />

        <InputGroup
          label="비밀번호"
          type="password"
          placeholder="최소 6자리 이상"
          value={password}
          onChange={(val) => {
            setPassword(val);
            if (passwordError) setPasswordError("");
          }}
          error={passwordError}
        />

        <InputGroup
          label="Battletag (선택)"
          placeholder="트레이서#1234"
          value={battletag}
          onChange={(val) => {
            setBattletag(val);
            if (battletagError) setBattletagError("");
          }}
          tip="💡 가입 후 마이페이지에서도 등록/수정할 수 있습니다."
          error={battletagError}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            marginTop: "15px",
          }}
        >
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
