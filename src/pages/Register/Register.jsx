import { Link } from "react-router-dom";
import { useState } from "react";

import { auth, db } from "../firebase/firebase";

import { createUserWithEmailAndPassword } from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";

export default function Register() {



  const [nickname, setNickname] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleRegister = async () => {
  try {
    const userCredential =
      await createUserWithEmailAndPassword(
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
      nickname,
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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "40px",
          backgroundColor: "#1e293b",
          borderRadius: "12px",
          color: "white",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          회원가입
        </h1>

        <label>닉네임</label>
        <input
  type="text"
  placeholder="닉네임 입력"
  value={nickname}
  onChange={(e) => setNickname(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "none",
  }}
/>

        <label>이메일</label>
        <input
  type="email"
  placeholder="example@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "none",
  }}
/>

        <label>비밀번호</label>
       <input
  type="password"
  placeholder="비밀번호 입력"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "none",
  }}
/>
      <button
  onClick={handleRegister}
  style={{
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  회원가입
</button>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <Link
            to="/login"
            style={{
              color: "#60a5fa",
              textDecoration: "none",
            }}
          >
            로그인 하러가기
          </Link>
        </div>
      </div>
    </div>
  );
}