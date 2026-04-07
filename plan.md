# Storybook 작성 계획

## 개요
`src/components/` 하위의 모든 컴포넌트에 대해 Storybook 스토리를 작성한다.
- **제외**: `tiptap-*` 디렉토리 전부
- **제외**: `ui/` 중 `tiptap-ui-primitive`에서 재작성된 컴포넌트 (badge, button, button-group, card, dropdown-menu, input, popover, separator, tooltip)
- **제외**: `ui/` 중 App 컴포넌트에서 래핑/재정의한 컴포넌트 (alert, alert-dialog, breadcrumb, carousel, dialog, pagination, select, sidebar) → App 컴포넌트 스토리에서 다룸
- 스토리 파일 위치: 각 컴포넌트와 같은 디렉토리에 `[ComponentName].stories.tsx`

---

## Phase 1: Storybook 설치 및 설정

### 1-1. 패키지 설치
```bash
npx storybook@latest init --type react_vite --skip-install
npm install
```

### 1-2. `.storybook/main.ts` 설정
```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/components/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    // vite.config.ts의 alias 설정 상속됨 (react-vite 플러그인이 자동 처리)
    return config;
  },
};

export default config;
```

### 1-3. `.storybook/preview.tsx` 글로벌 데코레이터
아래 Provider들이 필요한 컴포넌트가 있으므로 글로벌 데코레이터로 감싼다:
- **ThemeProvider** — 테마(light/dark/green) 전환
- **i18next** — 번역 (react-i18next)
- **MemoryRouter** — react-router-dom 의존 컴포넌트
- **SidebarProvider** — sidebar 계열 컴포넌트
- **Tailwind CSS** — `../src/index.css` import

```tsx
import type { Preview } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../src/components/theme-provider";
import { SidebarProvider } from "../src/components/ui/sidebar";
import "../src/index.css";
import "../src/i18n"; // i18n 초기화

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider defaultTheme="light" storageKey="storybook-theme">
          <SidebarProvider>
            <Story />
          </SidebarProvider>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ],
  parameters: {
    controls: { expanded: true },
  },
};

export default preview;
```

---

## Phase 2: App 컴포넌트 스토리 (26개 파일)

각 컴포넌트의 props, 의존성, 필요 mock 데이터를 정리한다.

### 2-1. `alert/AppAlert.stories.tsx`
- **컴포넌트**: `AppAlert`
- **Props**: `title: string`, `variant?: "default" | "destructive"`, `children: ReactNode`
- **의존성**: i18n (글로벌 데코레이터에서 처리)
- **Stories**:
  - `Default` — variant="default", 기본 알림
  - `Destructive` — variant="destructive", 에러 알림

### 2-2. `alert/AppAlertDialog.stories.tsx`
- **컴포넌트**: `AppAlertDialog`
- **Props**: `open`, `onOpenChange`, `title`, `description?`, `confirmText?`, `cancelText?`, `variant?`, `onConfirm?`
- **Stories**:
  - `Default` — 기본 확인 다이얼로그 (open=true)
  - `Destructive` — variant="destructive" 삭제 확인
  - `AsyncConfirm` — onConfirm이 Promise를 반환하는 경우 (로딩 상태 표시)

### 2-3. `breadcrumb/AppBreadcrumb.stories.tsx`
- **컴포넌트**: `AppBreadcrumb`
- **Props**: `appName: string`, `data: BreadcrumbInfo[]`, `firstItemClass?`, `itemClass?`
- **Stories**:
  - `Default` — 2~3단계 breadcrumb
  - `SingleLevel` — 1단계
  - `ManyLevels` — 5단계 이상

### 2-4. `carousel/AppCarousel.stories.tsx`
- **컴포넌트**: `AppCarousel`
- **Props**: `children`, `className?`, `itemClassName?`, `verticalHeight?`, `prevButtonDisable?`, `nextButtonDisable?`, `autoScroll?`, `autoScrollTime?`, `innerArrow?`, `orientation?`
- **Stories**:
  - `Horizontal` — 기본 가로 캐러셀 (이미지 placeholder 사용)
  - `Vertical` — orientation="vertical"
  - `AutoScroll` — autoScroll=true, autoScrollTime=3000
  - `InnerArrow` — innerArrow=true
  - `NoButtons` — prevButtonDisable=true, nextButtonDisable=true

### 2-5. `common/GridCard.stories.tsx`
- **컴포넌트**: `GridCard<T>`
- **Props**: `title`, `count?`, `className?`, + AgGridReactProps
- **의존성**: ThemeProvider, ag-grid
- **Mock 데이터**: 간단한 rowData + columnDefs 준비
- **Stories**:
  - `Default` — 기본 그리드 카드 (5행 샘플 데이터)
  - `WithCount` — count 표시
  - `Empty` — 빈 데이터

### 2-6. `common/SectionCard.stories.tsx`
- **컴포넌트**: `SectionCard`
- **Props**: `title?`, `children`, `className?`, `cardClassName?`
- **Stories**:
  - `WithTitle` — 제목 있는 섹션
  - `WithoutTitle` — 제목 없는 섹션
  - `CustomContent` — 다양한 콘텐츠

### 2-7. `datepicker/DatePicker.stories.tsx`
- **컴포넌트**: `DatePicker`
- **Props**: `id`, `value?`, `label?`, `defaultValue?`, `format?`, `onChange?`, `placeholder?`, `disabled?`
- **Stories**:
  - `Default` — 기본 날짜 선택
  - `WithLabel` — label 포함
  - `CustomFormat` — format="MM/dd/yyyy"
  - `Disabled` — disabled=true
  - `Controlled` — value + onChange 사용

### 2-8. `datepicker/RangeDatePicker.stories.tsx`
- **컴포넌트**: `RangeDatePicker`
- **Props**: `id`, `label?`, `value?`, `defaultValue?`, `format?`, `onChange?`, `placeholder?`, `disabled?`
- **Stories**:
  - `Default` — 기본 범위 선택
  - `WithLabel` — label 포함
  - `Disabled` — disabled=true

### 2-9. `dialog/AppDialog.stories.tsx`
- **컴포넌트**: `AppDialog`
- **Props**: 없음 (하드코딩된 데모 컴포넌트)
- **Stories**:
  - `Default` — 기본 렌더링

### 2-10. `feedback/ErrorFallback.stories.tsx`
- **컴포넌트**: `ErrorFallback`
- **Props**: `error`, `resetErrorBoundary`, `title?`, `showDetails?`
- **Stories**:
  - `Default` — 기본 에러 화면
  - `CustomTitle` — 커스텀 제목
  - `HideDetails` — showDetails=false
  - `NetworkError` — 네트워크 에러 시뮬레이션

### 2-11. `feedback/Spinner.stories.tsx`
- **컴포넌트**: `Spinner`
- **Props**: `size?`, `label?`, `fullscreen?`
- **Stories**:
  - `Default` — 기본 스피너
  - `Large` — size=64
  - `CustomLabel` — label="데이터 로딩 중..."
  - `Fullscreen` — fullscreen=true

### 2-12. `grid/AppGrid.stories.tsx`
- **컴포넌트**: `AppGrid<T>`
- **Props**: AgGridReactProps 확장
- **의존성**: i18n, ag-grid
- **Mock 데이터**: 간단한 테이블 데이터
- **Stories**:
  - `Default` — 기본 그리드
  - `WithSorting` — 정렬 가능
  - `Empty` — 빈 데이터

### 2-13. `layouts/Logo.stories.tsx`
- **컴포넌트**: `PlantCommunityLogo`
- **Props**: `width?`, `height?`, `className?`
- **Stories**:
  - `Default` — 기본 크기 (200x200)
  - `Small` — width=100, height=100
  - `Large` — width=400, height=400

### 2-14. `layouts/UserInfo.stories.tsx`
- **컴포넌트**: `UserInfo`
- **Props**: `children?`
- **의존성**: ThemeProvider, i18n
- **Stories**:
  - `Default` — 기본 사용자 정보
  - `WithChildren` — 추가 버튼 포함

### 2-15. `layouts/BasicHeader.stories.tsx`
- **컴포넌트**: `BasicHeader`
- **Props**: `navMain: NavMainItem[]`
- **의존성**: Router, SidebarProvider
- **Mock 데이터**: NavMainItem[] 샘플
- **Stories**:
  - `Default` — 기본 헤더

### 2-16. `layouts/BasicLayout.stories.tsx`
- **컴포넌트**: `BasicLayout`
- **Props**: 없음 (하드코딩)
- **의존성**: Router(Outlet), ThemeProvider, SidebarProvider, Toaster
- **참고**: 전체 레이아웃이므로 스토리에서는 MemoryRouter에 초기 경로 지정
- **Stories**:
  - `Default` — 기본 레이아웃

### 2-17. `namuwiki/FeedCard.stories.tsx`
- **컴포넌트**: `FeedCard`
- **Props**: `post: FeedPost`
- **Mock 데이터**: FeedPost 객체 (author, crop, timeAgo, avatarColor, content, badge, sensors, tags, likes, comments, barCount, activeBarCount)
- **Stories**:
  - `Default` — 기본 피드 카드
  - `ManyTags` — 태그 많은 경우
  - `HighEngagement` — 좋아요/댓글 많은 경우

### 2-18. `pagination/AppPagination.stories.tsx`
- **컴포넌트**: `AppPagination`
- **Props**: `totalRow`, `maxRow?`, `onPageClick`
- **Stories**:
  - `FewPages` — totalRow=15, maxRow=5 (3페이지)
  - `ManyPages` — totalRow=100, maxRow=5 (20페이지)
  - `SinglePage` — totalRow=3

### 2-19. `postcode/Postcode.stories.tsx`
- **컴포넌트**: `Postcode`
- **Props**: `onAddressSelect: (addrInfo: PostInfo) => void`
- **의존성**: react-daum-postcode (외부 팝업), i18n
- **참고**: 실제 Daum 팝업은 외부 서비스이므로 action으로만 확인
- **Stories**:
  - `Default` — 주소 검색 버튼 렌더링

### 2-20. `select/AppSelect.stories.tsx`
- **컴포넌트**: `AppSelect`
- **Props**: `id`, `items: ItemType[]`, `label?`, `description?`, `placeholder?`, `value?`, `onValueChange?`, `defaultValue?`, `disabled?`, `className?`
- **Mock 데이터**: ItemType[] 샘플
- **Stories**:
  - `Default` — 기본 셀렉트
  - `WithLabel` — label + description
  - `Disabled` — disabled=true
  - `Empty` — items=[] (자동 비활성화)

### 2-21. `sidebar/AppSidebar.stories.tsx`
- **컴포넌트**: `AppSidebar`
- **Props**: `data: SidebarData`, `contentTitle?`
- **의존성**: SidebarProvider, Router
- **Mock 데이터**: SidebarData (teams, user, navMain, projects)
- **Stories**:
  - `Default` — 전체 사이드바
  - `WithContentTitle` — contentTitle 설정

### 2-22. `sidebar/NavMain.stories.tsx`
- **컴포넌트**: `NavMain`
- **Props**: `items: NavMainItem[]`, `contentTitle?`
- **의존성**: SidebarProvider, Router
- **Mock 데이터**: NavMainItem[] (아이콘 포함, 서브아이템 포함)
- **Stories**:
  - `Default` — 기본 네비게이션
  - `WithSubItems` — 서브 아이템 포함
  - `WithContentTitle` — 그룹 라벨 포함

### 2-23. `sidebar/NavProjects.stories.tsx`
- **컴포넌트**: `NavProjects`
- **Props**: `projects: Project[]`
- **의존성**: SidebarProvider
- **Mock 데이터**: Project[] (name, url, icon)
- **Stories**:
  - `Default` — 프로젝트 목록

### 2-24. `sidebar/NavUser.stories.tsx`
- **컴포넌트**: `NavUser`
- **Props**: `user: User`
- **의존성**: SidebarProvider
- **Mock 데이터**: User (name, email, avatar)
- **Stories**:
  - `Default` — 기본 사용자
  - `WithAvatar` — 아바타 이미지 포함
  - `WithoutAvatar` — 아바타 없음 (폴백)

### 2-25. `sidebar/TeamSwitcher.stories.tsx`
- **컴포넌트**: `TeamSwitcher`
- **Props**: `teams: Team[]`, `useDropdown?`
- **의존성**: SidebarProvider
- **Mock 데이터**: Team[] (name, logo, plan)
- **Stories**:
  - `Static` — useDropdown=false
  - `Dropdown` — useDropdown=true

### 2-26. `upload/ImageUploader.stories.tsx`
- **컴포넌트**: `ImageUploader`
- **Props**: `files: File[]`, `onChange`, `usePreview?`, `multiple?`
- **Stories**:
  - `Default` — 빈 상태 (업로드 대기)
  - `SingleFile` — multiple=false
  - `NoPreview` — usePreview=false

---

## Phase 3: UI 컴포넌트 스토리 (13개 파일)

> **제외 (tiptap-ui-primitive 재작성 9개)**: badge, button, button-group, card, dropdown-menu, input, popover, separator, tooltip
> **제외 (App 컴포넌트에서 래핑 8개)**: alert, alert-dialog, breadcrumb, carousel, dialog, pagination, select, sidebar

### 3-1. `ui/avatar.stories.tsx`
- **컴포넌트**: Avatar, AvatarImage, AvatarFallback
- **Stories**: WithImage, Fallback

### 3-2. `ui/calendar.stories.tsx`
- **컴포넌트**: Calendar
- **의존성**: react-day-picker, Button
- **Stories**: Default, WithSelectedDate, DateRange

### 3-3. `ui/checkbox.stories.tsx`
- **컴포넌트**: Checkbox
- **Stories**: Default, Checked, Disabled, WithLabel

### 3-4. `ui/collapsible.stories.tsx`
- **컴포넌트**: Collapsible 계열
- **Stories**: Default (collapsed), Expanded

### 3-5. `ui/field.stories.tsx`
- **컴포넌트**: Field 계열
- **Stories**: Vertical, Horizontal, Responsive, WithError

### 3-6. `ui/input-otp.stories.tsx`
- **컴포넌트**: InputOTP 계열
- **Stories**: Default (6자리), WithSeparator

### 3-7. `ui/label.stories.tsx`
- **컴포넌트**: Label
- **Stories**: Default, WithInput

### 3-8. `ui/resizable.stories.tsx`
- **컴포넌트**: ResizablePanelGroup, ResizablePanel, ResizableHandle
- **Stories**: Horizontal, Vertical, WithHandle

### 3-9. `ui/sheet.stories.tsx`
- **컴포넌트**: Sheet 계열
- **Stories**: Left, Right, Top, Bottom

### 3-10. `ui/skeleton.stories.tsx`
- **컴포넌트**: Skeleton
- **Stories**: Default, Card (카드 스켈레톤 조합), List

### 3-11. `ui/slider.stories.tsx`
- **컴포넌트**: Slider
- **Stories**: Default, Range, Disabled

### 3-12. `ui/sonner.stories.tsx`
- **컴포넌트**: Toaster (+ toast 함수)
- **Stories**: Success, Error, WithAction
- **참고**: `toast()` 함수 호출 트리거 버튼 필요

### 3-13. `ui/textarea.stories.tsx`
- **컴포넌트**: Textarea
- **Stories**: Default, WithPlaceholder, Disabled

---

## Phase 4: 검증

### 4-1. Storybook 실행
```bash
npm run storybook
```

### 4-2. 체크리스트
- [ ] 모든 스토리가 에러 없이 렌더링되는지 확인
- [ ] ThemeProvider 데코레이터로 테마 전환 동작 확인
- [ ] i18n 번역 키가 정상 표시되는지 확인
- [ ] 라우터 의존 컴포넌트(Breadcrumb, NavMain 등)가 정상 렌더링되는지 확인
- [ ] ag-grid 컴포넌트(GridCard, AppGrid)가 정상 렌더링되는지 확인
- [ ] 인터랙션(클릭, 입력 등)이 Storybook controls/actions에서 동작하는지 확인

---

## 파일 생성 목록 요약

| # | Phase | 파일 경로 | 컴포넌트 |
|---|-------|----------|---------|
| 1 | App | `src/components/alert/AppAlert.stories.tsx` | AppAlert |
| 2 | App | `src/components/alert/AppAlertDialog.stories.tsx` | AppAlertDialog |
| 3 | App | `src/components/breadcrumb/AppBreadcrumb.stories.tsx` | AppBreadcrumb |
| 4 | App | `src/components/carousel/AppCarousel.stories.tsx` | AppCarousel |
| 5 | App | `src/components/common/GridCard.stories.tsx` | GridCard |
| 6 | App | `src/components/common/SectionCard.stories.tsx` | SectionCard |
| 7 | App | `src/components/datepicker/DatePicker.stories.tsx` | DatePicker |
| 8 | App | `src/components/datepicker/RangeDatePicker.stories.tsx` | RangeDatePicker |
| 9 | App | `src/components/dialog/AppDialog.stories.tsx` | AppDialog |
| 10 | App | `src/components/feedback/ErrorFallback.stories.tsx` | ErrorFallback |
| 11 | App | `src/components/feedback/Spinner.stories.tsx` | Spinner |
| 12 | App | `src/components/grid/AppGrid.stories.tsx` | AppGrid |
| 13 | App | `src/components/layouts/Logo.stories.tsx` | PlantCommunityLogo |
| 14 | App | `src/components/layouts/UserInfo.stories.tsx` | UserInfo |
| 15 | App | `src/components/layouts/BasicHeader.stories.tsx` | BasicHeader |
| 16 | App | `src/components/layouts/BasicLayout.stories.tsx` | BasicLayout |
| 17 | App | `src/components/namuwiki/FeedCard.stories.tsx` | FeedCard |
| 18 | App | `src/components/pagination/AppPagination.stories.tsx` | AppPagination |
| 19 | App | `src/components/postcode/Postcode.stories.tsx` | Postcode |
| 20 | App | `src/components/select/AppSelect.stories.tsx` | AppSelect |
| 21 | App | `src/components/sidebar/AppSidebar.stories.tsx` | AppSidebar |
| 22 | App | `src/components/sidebar/NavMain.stories.tsx` | NavMain |
| 23 | App | `src/components/sidebar/NavProjects.stories.tsx` | NavProjects |
| 24 | App | `src/components/sidebar/NavUser.stories.tsx` | NavUser |
| 25 | App | `src/components/sidebar/TeamSwitcher.stories.tsx` | TeamSwitcher |
| 26 | App | `src/components/upload/ImageUploader.stories.tsx` | ImageUploader |
| 27 | UI | `src/components/ui/avatar.stories.tsx` | Avatar |
| 28 | UI | `src/components/ui/calendar.stories.tsx` | Calendar |
| 29 | UI | `src/components/ui/checkbox.stories.tsx` | Checkbox |
| 30 | UI | `src/components/ui/collapsible.stories.tsx` | Collapsible |
| 31 | UI | `src/components/ui/field.stories.tsx` | Field |
| 32 | UI | `src/components/ui/input-otp.stories.tsx` | InputOTP |
| 33 | UI | `src/components/ui/label.stories.tsx` | Label |
| 34 | UI | `src/components/ui/resizable.stories.tsx` | Resizable |
| 35 | UI | `src/components/ui/sheet.stories.tsx` | Sheet |
| 36 | UI | `src/components/ui/skeleton.stories.tsx` | Skeleton |
| 37 | UI | `src/components/ui/slider.stories.tsx` | Slider |
| 38 | UI | `src/components/ui/sonner.stories.tsx` | Sonner |
| 39 | UI | `src/components/ui/textarea.stories.tsx` | Textarea |

**총 39개 스토리 파일 생성 예정**

### 제외된 ui/ 컴포넌트 (17개)

| 제외 사유 | 컴포넌트 |
|----------|---------|
| tiptap-ui-primitive 재작성 | badge, button, button-group, card, dropdown-menu, input, popover, separator, tooltip |
| App 컴포넌트에서 래핑 | alert, alert-dialog, breadcrumb, carousel, dialog, pagination, select, sidebar |
