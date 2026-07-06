import { Link } from "react-router-dom";
// 👇 임포트가 예술적으로 단 한 줄!
import { useRegister } from "@/hooks";
import './Register.css';

export default function Register() {
  // 상태와 함수들을 통째로 가져옵니다.
  const {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    isRegistering, executeRegister
  } = useRegister();

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

        {/* ✨ 로딩 중(isRegistering)일 때 버튼을 비활성화하여 중복 클릭 완벽 차단 */}
        <button
          onClick={executeRegister}
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