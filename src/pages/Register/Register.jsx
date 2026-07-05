import { Link } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import './Register.css'; // 🔥 CSS 파일 연결

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      console.log("회원가입 성공:", user.email);

      await sendEmailVerification(user);

      console.log("인증메일 발송 성공");

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username,
        email,
        role: "user",
        createdAt: new Date(),
      });

      alert("인증 메일을 발송했습니다.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
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
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />

        <button onClick={handleRegister} className="btn-register">
          회원가입
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