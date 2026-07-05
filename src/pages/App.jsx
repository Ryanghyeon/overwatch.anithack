import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Report from "./Report";
import Ranking from "./Ranking";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/report" element={<Report />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;