# 🌿 NamuWiki Farm — 웹 플랫폼

> 스마트팜 SNS 웹 서비스 | React 19 + Vite + TypeScript

NamuWiki Farm 프로젝트의 **웹 프론트엔드**입니다.
농장주·일반 사용자·관리자를 위한 역할 분리 UI, IoT 기기 모니터링 대시보드, SNS 피드, 실시간 DM 채팅 등을 제공합니다.

<br/>

## 📦 관련 레포지토리

| 역할 | 레포지토리 |
|------|-----------|
| 📱 모바일 앱 | [namuwiki-app](https://github.com/james14kr/namuwiki-app) |
| 🖥️ 백엔드 (Spring Boot) | [namuwiki](https://github.com/james14kr/namuwiki) |
| 🤖 IoT (Raspberry Pi) | [namuwiki-IoT](https://github.com/james14kr/namuwiki-IoT) |

<br/>

## ✨ 주요 기능

### 👤 역할 기반 화면 분리
- **농장주** — 농장·농작물·IoT 기기 등록 및 관리, 대시보드, SNS 피드
- **일반 사용자** — SNS 피드 탐색, 팔로우, 농작물 건강도 조회
- **관리자** — 회원·게시글·기기 관리, 기기 인증코드 발급

### 🤖 IoT 모니터링 대시보드
- 온도·습도·조도·토양수분 센서 데이터 실시간 차트 (recharts)
- 팬·LED·펌프 수동 ON/OFF 및 자동 제어 임계값 설정

### 📝 SNS 커뮤니티
- 게시글 작성 — **Tiptap 3** 리치텍스트 에디터 (이미지·코드블록·인용구 등)
- 댓글·좋아요·해시태그·카테고리 분류
- 팔로우·팔로워 관리, 무한 스크롤 피드

### 💬 실시간 DM 채팅
- **WebSocket STOMP** 기반 1:1 다이렉트 메시지
- 읽지 않은 메시지 카운트 뱃지

### 🗂 관리자 대시보드
- **AG Grid** 기반 대용량 데이터 테이블 (정렬·필터·페이지네이션)
- 기기 인증코드 발급 및 회원·게시글 일괄 관리

### 🌐 기타
- 다국어 지원 — **i18next** (한국어 / English)
- 다크·라이트·그린 3가지 테마 전환
- **Storybook 10** — 39개 컴포넌트 스토리 문서화
- 주소 검색 — 다음 우편번호 API 연동

<br/>

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19, TypeScript 5 |
| 빌드 도구 | Vite 7 |
| 라우팅 | react-router-dom 7 |
| 서버 상태 관리 | TanStack Query v5 |
| UI 컴포넌트 | shadcn/ui, Radix UI, Tailwind CSS 3 |
| 리치텍스트 에디터 | Tiptap 3 |
| 데이터 그리드 / 차트 | AG Grid 35, recharts 3 |
| 실시간 통신 | WebSocket / STOMP.js |
| 폼 & 유효성 검사 | react-hook-form 7, zod 4 |
| 다국어 | i18next, react-i18next |
| 테마 | next-themes |
| 컴포넌트 문서화 | Storybook 10 |
| HTTP 클라이언트 | axios |

<br/>

## 📁 프로젝트 구조

```
src/
├── api/              # API 호출 모듈 (farm, crop, device, sensor, post, dm ...)
├── components/       # 재사용 컴포넌트
│   ├── ui/           # shadcn/ui 기반 원자 컴포넌트
│   ├── layouts/      # BasicLayout, FarmSidebar, ManagerSidebar, UserSidebar
│   ├── namuwiki/     # 도메인 컴포넌트 (FeedCard, DeviceCard, SensorChart ...)
│   ├── tiptap-*/     # 리치텍스트 에디터 관련 (extension, node, ui, icons)
│   └── upload/       # 이미지 업로더
├── hooks/            # 커스텀 훅
├── i18n/             # 다국어 리소스 (ko.json, en.json)
├── queries/          # TanStack Query 훅 (farm, device, sensor, post ...)
├── routes/           # 라우터 설정 + 페이지 컴포넌트
│   └── pages/namuwiki/
│       ├── farm/     # 농장·농작물·기기 관련 페이지
│       ├── post/     # 게시글 CRUD 페이지
│       ├── dm/       # DM 채팅 페이지
│       └── admin/    # 관리자 페이지
├── types/            # TypeScript 타입 정의
└── utils/            # axios 설정, 인증, 업로드, 공통 유틸
```

<br/>

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (기본 포트: 5173)
npm run dev

# 빌드
npm run build

# 타입 검사
npm run typecheck

# 린트
npm run lint

# Storybook 실행 (포트: 6006)
npm run storybook
```

<br/>

## 👥 팀원

| 이름 | 역할 |
|------|------|
| 황민서 | 웹 프론트엔드 전반 · Storybook · IoT 대시보드 · 농장·기기·센서 UI |
| 김유정 | 로그인 / DM 실시간 채팅 |
| 김재근 | 게시글 / 홈 피드 |
