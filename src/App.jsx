// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAutoLogout } from "@/hooks";
import { routeList } from "./routes";

function App() {
  useAutoLogout();

  return (
    <BrowserRouter>
      <Routes>
        {routeList.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;