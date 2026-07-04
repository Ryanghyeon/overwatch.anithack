import { Link } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword,signInWithCustomToken, } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
      console.error(err);
      alert("디스코드 로그인에 실패했습니다.");
    }
  }

  login();
}, [params, navigate]);


 const handleDiscordLogin = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;

    const redirectUri = encodeURIComponent(
      "https://overwatch-anithack-otzm.vercel.app/api/auth/discord/callback"
    );

    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;

    window.location.href = url;
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
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
          로그인
         
          
          <button
  onClick={handleDiscordLogin}
  style={{
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    backgroundColor: "#5865F2",
    color: "white",
  }}
>
  디스코드로 로그인
</button>
        </h1>

        <label>이메일</label>

        <input
        value={email}
onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="example@email.com"
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
        value={password}
onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="비밀번호 입력"
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
  onClick={handleLogin}
  style={{
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  로그인
</button>

<div
  style={{
    textAlign: "center",
    marginTop: "20px",
  }}
>
  <Link
    to="/register"
    style={{
      color: "#60a5fa",
      textDecoration: "none",
    }}
  >
    회원가입
  </Link>
</div>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <Link
            to="/"
            style={{
              color: "#60a5fa",
              textDecoration: "none",
            }}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
