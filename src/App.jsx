/* src/App.jsx */

import { BrowserRouter } from "react-router-dom";
import { useAutoLogout } from "@/hooks";
import { AppRoutes } from "./routes.jsx";
import { Layout } from "@/components";

function App() {
  useAutoLogout();

  return (
    <BrowserRouter>
      <Layout>
        {/* 기존의 복잡한 <Routes>와 map 루프를 모두 날리고 단일 컴포넌트로 교체! */}
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
