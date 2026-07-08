/* src/App.jsx */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAutoLogout } from "@/hooks";
import { routeList } from "./routes.jsx";
import { Layout } from "@/components";

function App() {
  useAutoLogout();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {routeList.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
