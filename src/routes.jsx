/* src/routes.jsx */

import { Routes, Route } from "react-router-dom";
// ✅ lazy를 빼고 일반적인 import 방식으로 전부 변경
import {
  Home,
  Login,
  Register,
  Report,
  Ranking,
  Admin,
  Profile,
  MyPage,
  MyReports,
} from "@/pages";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/report" element={<Report />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:uid" element={<Profile />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/my-reports" element={<MyReports />} />
    </Routes>
  );
}
