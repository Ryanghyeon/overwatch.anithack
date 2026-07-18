# 🛠️ OW Watch 팀 기여 가이드 (Contributing Guide)

새로운 TypeScript + Vite 환경에 오신 것을 환영합니다!
원활한 협업과 일관된 코드 품질을 유지하기 위해 아래 가이드를 읽고 작업을 진행해 주세요.

## 🚀 로컬 개발 환경 실행 (Getting Started)

이 프로젝트는 Vercel Serverless Function(백엔드 API)과 React(프론트엔드)가 결합된 구조입니다.
정상적인 API 통신(디스코드 로그인, 캡챠 검증 등)을 포함하여 로컬에서 테스트하려면, 일반적인 명령어 대신 **Vercel CLI**를 사용해야 합니다.

**1. Vercel CLI 전역 설치 (최초 1회)**

```bash
npm i -g vercel
```

**2. 패키지 설치**

```bash
npm i
```

**3. 로컬 서버 실행**

```bash
vercel dev
```

⚠️ 주의: npm run dev로 실행하면 프론트엔드 화면만 구동되어 API 서버 통신이 불가능합니다. 무조건 vercel dev 명령어를 사용해 주세요! (최초 실행 시 Vercel 계정 로그인 및 프로젝트 Link 과정이 필요할 수 있습니다.)

---

## 📁 상세 폴더 구조 및 역할 (Directory Structure)

- 프로젝트 최상단(Root)에는 코드 품질 유지와 빌드 환경을 위한 설정 파일들이 위치해 있습니다.

- 루트 레벨에서 백엔드(서버리스)와 프론트엔드가 물리적으로 분리되어 있습니다.

```text
📦 project-root
 ├── 📂 .github/         # GitHub Actions (CI 워크플로우 자동화)
 ├── 📂 .husky/          # Git 훅 (커밋 전 린트 및 코드 포맷팅 자동 검사)
 ├── 📂 .vscode/         # 팀 공통 에디터 설정 (추천 확장 프로그램 및 세팅)
 ├── 📂 api/             # Vercel Serverless Functions (백엔드 로직)
 ├── 📂 src/             # 프론트엔드 소스 코드 (React + TypeScript)
 ├── 📜 eslint.config.js # 팀 공통 린트(Lint) 규칙
 ├── 📜 .prettierrc      # 팀 공통 코드 포맷팅 규칙
 ├── 📜 tsconfig.*.json  # TypeScript 환경 분리 설정 (app: 프론트, node: 빌드/서버)
 ├── 📜 vite.config.ts   # Vite 빌드 도구 설정 파일
 ├── 📜 renovate.json5   # 의존성 패키지 자동 업데이트 봇 설정
 └── 📜 package.json     # 프로젝트 의존성 및 스크립트 관리
```

### 1. `api/` (Vercel Serverless Functions)

- **역할:** 프론트엔드에서 직접 처리할 수 없는 서버 로직을 담당합니다.
- **포함 내용:** Discord OAuth 콜백 로직, Cloudflare 캡챠 검증, Firebase Admin SDK 초기화.

### 2. `src/` (Frontend React App)

- `api/`: Axios 인스턴스 및 백엔드 엔드포인트 호출 함수 (서버 통신 계층).
- `components/`: 재사용 가능한 UI 컴포넌트 (`common/`, `Layout/` 분리).
- `hooks/`: 커스텀 훅. (서버 상태 관리를 위한 React Query 로직은 `queries/` 폴더 내 작성).
- `pages/`: 라우터에 연결되는 각 화면 단위 컴포넌트 (Home, Login, MyPage 등).
- `router/`: 라우팅 설정 파일 (`AsyncBoundary` 적용).
- `store/`: Zustand를 활용한 클라이언트 전역 상태 관리 (`useAuthStore` 등).
- `types/`: 공통으로 사용되는 TypeScript 도메인 타입 및 인터페이스.
- `utils/`: 공통 유틸리티 함수 (`cn.ts`, 정규식 유효성 검사 등).

**Tip**: _자잘한 설정 파일(package-lock.json, .gitignore 등)은 생략되었으며, 코드 작성 시 eslint.config.js와 .prettierrc의 룰이 .husky를 통해 커밋 단계에서 강제 적용됩니다._
---

## 🛡️ 개발 컨벤션 (Conventions)

### 1. TypeScript Strict Mode

현재 프로젝트는 `tsconfig.json`을 통해 매우 엄격한 타입 검사를 강제하고 있습니다.

- **`any` 사용 지양:** 타입을 알기 어려운 경우 `any` 대신 `unknown`을 사용하거나 팀 리뷰를 요청해 주세요.
- **인터페이스 활용:** 새로운 API 응답 데이터나 컴포넌트 Props는 반드시 `src/types/` 내부에 타입을 정의해 주세요.

### 2. 상태 관리의 분리

- **서버 상태 (Data Fetching):** `src/hooks/queries/` 내부에서 React Query를 활용하여 캐싱 및 상태를 관리합니다.
- **클라이언트 상태 (UI State):** `src/store/` 내부에서 Zustand를 활용하여 관리합니다.

### 3. 절대 경로 사용

프론트엔드(`src/`) 내부에서는 `../../components/` 같은 상대 경로 대신 `@/components/` 형태의 절대 경로를 사용합니다.

---

## ⚙️ 코드 품질 (Code Quality)

- **Husky & Lint-staged:** 커밋(`git commit`) 시 자동으로 ESLint와 Prettier 검사가 실행됩니다. 코드 포맷팅 에러가 있다면 커밋이 거절될 수 있습니다.
- **GitHub Actions (CI):** 메인 브랜치로 Pull Request를 생성하면 자동으로 CI 워크플로우가 돌아가며 타입 검사와 빌드 테스트를 수행합니다. 에러나 노란 줄(Warning)은 로컬에서 미리 해결 후 푸시해 주세요.
