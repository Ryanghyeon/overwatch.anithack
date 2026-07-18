# 🚨 OW Watch (오버워치 커뮤니티 신고 플랫폼)

> 오버워치 유저들의 건전한 게임 환경을 위한 배틀태그 기반 악성 유저 신고 및 전적 조회 서비스입니다.

<br>

## 🎮 주요 기능

- 🔥 **배틀태그 전과 조회 (Killer Feature):** 배틀태그(예: 트레이서#1234) 검색 한 번으로 해당 유저의 누적 신고 횟수와 상세 전적(트롤링, 비인가 프로그램 사용 등)을 실시간으로 추적 및 조회하는 강력한 검색 시스템
- **신고 접수 및 방어 로직:** 카테고리별 세부 신고 기능 및 무분별한 중복 허위 신고를 막기 위한 검증 로직 구현
- **디스코드 연동 로그인:** Discord OAuth2를 활용한 간편 로그인 및 유저 프로필 자동 동기화
- **다이내믹 프로필:** 접속자 권한(본인/타인/관리자)에 따라 유동적으로 UI가 변하는 마이페이지 (마이 리포트, 프로필 기능 통합)
- **관리자 대시보드:** 악성 빌런 강제 제재 및 플랫폼 관리를 위한 전용 관리 시스템

<br>

## 🛠 기술 스택 및 API

**Frontend & Build**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
<br>

**State Management & Styling**

![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=ReactQuery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
<br>

**Backend & Database**

![Firebase](https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**Deployment**

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**3rd Party API & Libraries**

<!-- - ![OverFast API](https://img.shields.io/badge/OverFast_API-F99E1A?style=for-the-badge&logo=overwatch&logoColor=white) 오버워치 2 유저 배틀태그 유효성 검증 및 전적 데이터 실시간 스크래핑 -->

![Discord OAuth2](https://img.shields.io/badge/Discord_OAuth2-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Cloudflare Turnstile](https://img.shields.io/badge/Cloudflare_Turnstile-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![UI Avatars API](https://img.shields.io/badge/UI_Avatars_API-333333?style=for-the-badge)

<br>

## 📂 핵심 아키텍처 (Architecture)

프로젝트의 관심사 분리와 Vercel Serverless 환경을 고려하여,
백엔드 API와 프론트엔드 클라이언트 영역을 물리적으로 격리하여 설계했습니다.

```text
📦 project-root
├── 📂 api/             # Vercel Serverless Function (디스코드 콜백, 캡챠 검증 등 백엔드 격리)
└── 📂 src/             # 프론트엔드 (React + TS)
    ├── 📂 api/         # 클라이언트 통신 계층 (Axios 및 엔드포인트 관리)
    ├── 📂 router/      # 라우터 설정 (AsyncBoundary 기반 에러/서스펜스 처리)
    └── 📂 store/       # Zustand 클라이언트 전역 상태 관리
```

## 👥 팀원 역할 분담

<table>
  <tr>
    <th>이름</th>
    <th>담당 역할 및 구현 내용</th>
    <th>GitHub</th>
  </tr>
  <tr>
    <td><strong>변지환</strong></td>
    <td>
      <strong>프론트엔드 리드 및 아키텍처 총괄</strong><br>
      • 기존 JavaScript 레거시 코드의 구조적 한계 파악 및 마이그레이션 주도<br>
      • 자체 TypeScript/Vite 보일러플레이트 구축 및 아키텍처(라우터, 상태 관리, API) 전면 재설계<br>
      • Husky, ESLint, Prettier 도입을 통한 엄격한 코드 컨벤션 표준화 및 협업 환경 세팅<br>
      • <code>AsyncBoundary</code>, <code>ErrorFallback</code> 패턴을 활용한 선언적 에러/로딩 처리(Suspense) 구현<br>
      • 기존 스파게티 코드 리팩토링 및 Custom Hook 패턴 도입을 통한 비즈니스 로직 분리<br>
      • Zustand(<code>useAuthStore</code> 등) 기반 전역 상태 관리 및 Firestore 통신 렌더링 최적화<br>
      • Discord OAuth 및 Firebase Auth 전역 인증 파이프라인 최종 연동<br>
      • Cloudflare 및 Vercel 기반 배포 파이프라인 안정화 및 Tailwind CSS 전역 고도화
    </td>
    <td><a href="https://github.com/pandemoniummm">@pandemoniummm</a></td>
  </tr>
  <tr>
    <td><strong>권량현</strong></td>
    <td>
      <strong>백엔드/인프라 초기 세팅</strong><br>
      • 프로젝트 초기 환경 구성 및 Firebase Admin SDK 아키텍처 설계<br>
      • Discord OAuth 콜백 API 라우팅 및 인증 서버 연동 초기 뼈대 작성<br>
      • Vercel 초기 배포 환경 설정 및 환경변수 관리
    </td>
    <td><a href="https://github.com/Ryanghyeon">@Ryanghyeon</a></td>
  </tr>
  <tr>
    <td><strong>김동인</strong></td>
    <td>
      <strong>프론트엔드 UI 서포트 및 보안 설정</strong><br>
      • 주요 도메인(Login, Ranking, Admin) 초기 UI 컴포넌트 구성<br>
      • Firebase App Check(ReCaptcha V3) 연동을 통한 클라이언트 보안 설정 보조<br>
      • 프로젝트 패키지 의존성 및 Firebase 설정 파일 관리
    </td>
    <td><a href="https://github.com/ininin0423">@ininin0423</a></td>
  </tr>
</table>
