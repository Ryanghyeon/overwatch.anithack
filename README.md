# 🚨 OW Watch (오버워치 커뮤니티 신고 플랫폼)

> 오버워치 유저들의 건전한 게임 환경을 위한 배틀태그 기반 악성 유저 신고 및 전적 조회 서비스입니다.

<br>

## 🎮 주요 기능
- **통합 검색:** 배틀태그 검색을 통해 해당 유저의 누적 신고 횟수 실시간 조회
- **신고 접수:** 비인가 프로그램, 트롤링 등 카테고리별 세부 신고 및 중복 신고 방지
- **디스코드 연동:** Discord OAuth2를 활용한 간편 로그인 및 프로필 자동 동기화
- **다이내믹 프로필:** 접속자 권한(본인/타인/관리자)에 따라 유동적으로 변하는 마이페이지
- **관리자 대시보드:** 악성 빌런 제재 및 허위 신고 관리를 위한 전용 관리 시스템

<br>

## 🛠 기술 스택
- **Frontend:** React, React Router, CSS3 (Vite)
- **Backend/Database:** Firebase Authentication, Firestore Database
- **Deployment:** Vercel

<br>

## 📁 폴더 구조
```text
📦 project-root
├── 📂 api/             # Vercel Serverless Function (디스코드 콜백 등)
├── 📂 public/          # 정적 파일
├── 📂 src/             # React 소스 코드
│   ├── 📂 components/  # 공통 컴포넌트
│   ├── 📂 firebase/    # 파이어베이스 초기 설정 파일
│   ├── 📂 pages/       # 각 화면 페이지 (Home, Login, Profile, Report 등)
│   ├── App.jsx         # 라우터 설정 및 루트 컴포넌트
│   └── main.jsx        # 엔트리 포인트
├── vercel.json         # Vercel 배포 설정 파일
├── vite.config.js      # Vite 설정 파일
└── README.md           # 프로젝트 설명서
```

## 👤 기여자
| 이름 | 담당 역할 및 구현 내용 | github |
| --- | --- | --- |
|권량현|ㅇㅇ|ㅇㅇ|
|김동인|ㅇㅇ|ㅇㅇ|
|변지환|ㅇㅇ|ㅇㅇ|