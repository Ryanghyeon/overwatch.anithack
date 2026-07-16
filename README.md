# 🚨 OW Watch (오버워치 커뮤니티 신고 플랫폼)

> 오버워치 유저들의 건전한 게임 환경을 위한 배틀태그 기반 악성 유저 신고 및 전적 조회 서비스입니다.

<br>

## 🎮 주요 기능
- 🔥 **배틀태그 전과 조회 (Killer Feature):** 배틀태그(예: 트레이서#1234) 검색 한 번으로 해당   유저의 누적 신고 횟수와 상세 전적(트롤링, 비인가 프로그램 사용 등)을 실시간으로 추적 및 조회하는 강력한 검색 시스템
- **신고 접수 및 방어 로직:** 카테고리별 세부 신고 기능 및 무분별한 중복 허위 신고를 막기 위한 검증 로직 구현
- **디스코드 연동 로그인:** Discord OAuth2를 활용한 간편 로그인 및 유저 프로필 자동 동기화
- **다이내믹 프로필:** 접속자 권한(본인/타인/관리자)에 따라 유동적으로 UI가 변하는 마이페이지
- **관리자 대시보드:** 악성 빌런 강제 제재 및 플랫폼 관리를 위한 전용 관리 시스템

<br>

## 🛠 기술 스택 및 API
**Frontend & Build**
- React, React Router, CSS3, Vite

**Backend & Database**
- Firebase Authentication, Firestore Database

**🔌 3rd Party API & Libraries**
- **OverFast API:** 오버워치 2 유저 배틀태그 유효성 검증 및 게임 전적 데이터 실시간 스크래핑/연동
- **Discord OAuth2 API:** 유저 간편 로그인 및 정보 동기화
- **Cloudflare Turnstile API:** 봇 및 악성 트래픽 가입 방지를 위한 보안 캡챠(CAPTCHA) 적용
- **UI Avatars API:** 프로필 사진 미설정 유저를 위한 닉네임 기반 다이내믹 썸네일 자동 생성

**Deployment**
- Vercel (Serverless Function 포함)

<br>

## 📁 폴더 구조
```text
📦 project-root
├── 📂 api/             # Vercel Serverless Function (디스코드 콜백 등)
├── 📂 public/          # 정적 파일 (파비콘 등)
├── 📂 src/             # React 소스 코드
│   ├── 📂 assets/      # 이미지, 아이콘 등 에셋 파일
│   ├── 📂 components/  # 재사용 가능한 UI 컴포넌트
│   ├── 📂 firebase/    # 파이어베이스 초기화 및 설정 파일
│   ├── 📂 hooks/       # 커스텀 훅 (비즈니스 로직 분리)
│   ├── 📂 pages/       # 각 화면 페이지 (Home, Login, Profile, Report 등)
│   ├── 📂 utils/       # 공통 유틸리티 함수 (유효성 검사 등)
│   ├── App.jsx         # 메인 앱 컴포넌트 (레이아웃 등)
│   ├── index.css       # 전역 스타일 시트
│   ├── main.jsx        # React 엔트리 포인트
│   └── routes.jsx      # 라우터 설정 파일
├── index.html          # 메인 HTML 템플릿
├── package.json        # 프로젝트 의존성 관리
├── vercel.json         # Vercel 배포 설정 파일
├── vite.config.js      # Vite 빌드 설정 파일
└── README.md           # 프로젝트 설명서
```

<br>

## 👤 기여자
| 이름 | 담당 역할 및 구현 내용 | github |
| --- | --- | --- |
|권량현|ㅇㅇ|ㅇㅇ|
|김동인|ㅇㅇ|ㅇㅇ|
|변지환|ㅇㅇ|ㅇㅇ|