/* src/components/Layout/Layout.jsx */

import { Footer } from "@/components";
import "./Layout.css";

export function Layout({ children }) {
  return (
    <div className="layout-wrapper">
      {/* 1. 나중에 헤더(네비게이션 바)가 생기면 여기에 쏙 넣으면 됩니다 */}
      {/* <Header /> */}

      {/* 2. 이 children 자리에 App.jsx의 <Routes> (페이지들)가 들어옵니다! */}
      <main className="layout-main">{children}</main>

      {/* 3. 방금 만든 푸터는 맨 아래에 고정 */}
      <Footer />

      {/* 4. 나중에 알림창(Toast)이나 모달창 공통 컴포넌트도 여기에 추가하면 끝! */}
      {/* <ToastContainer /> */}
    </div>
  );
}
