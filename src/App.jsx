import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Report from "./pages/Report/Report";
import Ranking from "./pages/Ranking/Ranking";
import Admin from "./pages/Admin/Admin";
import Profile from "./pages/Profile/Profile";

// 자동 로그아웃 구현
import { useEffect } from "react";
import { auth } from "./firebase/firebase";
import { signOut } from "firebase/auth";


function App() {

  // 자동 로그아웃
  useEffect(() => {
    let inactivityTimer;

    const performLogout = async () => {
      if (auth.currentUser) {
        try {
          await signOut(auth);
          alert("장시간 움직임이 없어 자동 로그아웃 되었습니다.");
          window.location.href = "/login"; // useNavigate 대신 이게 더 안전하게 튕겨냅니다
        } catch (error) {
          console.error("자동 로그아웃 실패:", error);
        }
      }
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(performLogout, 30 * 60 * 1000); // 30분 타이머

      // 테스트용 타이머 5초
      //inactivityTimer = setTimeout(performLogout, 5000);
    };

    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);


  // 라우팅 설정
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/report" element={<Report />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:uid" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;