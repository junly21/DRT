# DRT 모노레포

승객용·기사용 React Native(Expo) 앱을 한 저장소에서 관리하는 **DRT(Demand Responsive Transit)** 클라이언트입니다. 아래는 인수인계 및 온보딩용 **A to Z** 안내입니다.

---

## 1. 프로젝트 한 줄 요약

| 항목 | 내용 |
|------|------|
| 이름 | `drt-monorepo` |
| 형태 | **pnpm + Turborepo** 모노레포 |
| 앱 | `apps/user-app` — 승객용 **DRT User**, `apps/driver-app` — 기사용 **DRT Driver** |
| 프레임워크 | **Expo SDK 52**, **React Native 0.76**, **expo-router**, **TypeScript** |
| UI | **NativeWind v4** + Tailwind, 공통 컴포넌트는 `packages/ui-native` |
| 서버 통신 | `packages/api-client`의 `apiClient` + 앱별 `services/*.ts`에서 백엔드 `.do` 엔드포인트 호출 |

---

## 2. 사전 요구사항(개발자 PC)

| 도구 | 버전·비고 |
|------|-----------|
| **Node.js** | `>= 18` (루트 `package.json`의 `engines` 참고) |
| **pnpm** | `>= 8` — 루트에 `packageManager: "pnpm@8.15.0"` 고정 |
| **Turbo** | 루트 devDependency로 설치됨 (`pnpm`으로 함께 설치) |
| **모바일** | Android: Android Studio / SDK, USB 디버깅 또는 에뮬레이터. iOS: macOS + Xcode(기사 앱은 저장소에 `ios/` 포함) |
| **EAS(선택)** | 스토어 배포·클라우드 빌드 시 [Expo EAS](https://docs.expo.dev/build/introduction/) |

**참고(Windows)**: 루트·앱의 `clean` 스크립트에 `rm -rf`가 있어 PowerShell만으로는 실패할 수 있습니다. Git Bash, WSL, 또는 수동으로 `node_modules`·`.expo` 삭제를 권장합니다.

---

## 3. 저장소 최상위 구조

```
drt/
├── apps/
│   ├── user-app/          # 승객용 Expo 앱
│   └── driver-app/        # 기사용 Expo 앱 (+ android/, ios/ 네이티브 프로젝트 포함)
├── packages/
│   ├── api-client/        # HTTP 클라이언트, 타입, 레거시 mock `api`
│   ├── domain/            # 노선 등 도메인 상수·타입 (금오도 등 시나리오 데이터)
│   ├── store/             # Zustand 스토어 (메뉴, 위치, 호출 상태 등)
│   ├── ui-native/         # 공통 RN UI (지도·정류장 선택 등)
│   ├── utils/             # 공통 유틸 (거리, 쿼리 키, 디자인 토큰 등)
│   └── config/            # ESLint/Prettier/Tailwind 등 공유 설정(레거시)
├── docs/                  # 보조 문서(카카오 설정 등 앱별 README 참고)
├── README.md              # 본 문서 — 프로젝트 안내·인수인계
├── package.json           # 워크스페이스 루트 스크립트
├── pnpm-workspace.yaml    # apps/*, packages/*
├── turbo.json             # Turbo 파이프라인(dev, build, lint …)
├── metro.config.js        # 루트에 파일 존재(실사용은 앱별 metro)
├── babel.config.js        # 루트 설정 존재
├── eas.json               # 루트 EAS 프로파일(앱별 eas.json과 병행 가능)
├── tsconfig.json          # 경로 별칭 예시 수준(앱은 자체 tsconfig 확장)
├── tailwind.config.js, postcss.config.js, global.css  # 웹/공통 스타일 관련
└── package-lock.json      # npm 잔재 가능성 — **의존성 설치는 pnpm 기준**
```

### 3.1 `apps/user-app` (승객)

| 경로 | 역할 |
|------|------|
| `app/` | **expo-router** 파일 기반 라우팅 (`_layout.tsx`, `index.tsx`, `(flows)/`, `(menu)/`, `(main)/`) |
| `services/` | 백엔드 연동: 정류장, 호출, 취소, 여객선, 이용내역 등 |
| `components/` | 앱 전용 UI (맵 `KakaoMap`, `Menu` 등) |
| `hooks/` | 디바이스 ID, 위치 초기화, 예약 상태 등 |
| `app.config.ts` | 동적 Expo 설정(카카오 키 `extra` 등). **`app.json`과 함께 존재** |
| `app.json` | 정적 Expo 설정, **EAS `projectId`** 등 |
| `metro.config.js` | 모노레포 `packages/`·루트 `node_modules` watch |
| **네이티브** | 저장소 기준 **`android/`·`ios/` 폴더 없음** → 로컬 네이티브 빌드 시 `npx expo prebuild` 등으로 생성하는 흐름이 일반적 |

### 3.2 `apps/driver-app` (기사)

| 경로 | 역할 |
|------|------|
| `app/` | `index`, `common/select-route`, `operating` 등 운행 플로우 |
| `services/` | 차량 ID 조회, 노선 목록, 운행 시작·보고·종료 API |
| `hooks/` | 기사 위치 추적, 운행 리포트, 디바이스·차량 ID 동기화 |
| `android/`, `ios/` | **커밋된 네이티브 프로젝트**(cleartext HTTP 등 개발용 설정 포함 가능) |
| `KAKAO_MAP_SETUP.md` | 카카오 지도 JS 키·플랫폼 등록 안내 |

### 3.3 `packages/*` 워크스페이스 패키지

| 패키지 | npm 이름 | 용도 |
|--------|-----------|------|
| `api-client` | `@drt/api-client` | `apiClient`(fetch 래퍼), 레거시 **mock** 객체 `api` |
| `domain` | `@drt/domain` | 버스·여객 연계 노선 데이터 등 |
| `store` | `@drt/store` | Zustand 전역 상태 |
| `ui-native` | `@drt/ui-native` | 공통 화면·지도·정류장 UI |
| `utils` | `@drt/utils` | 지리 계산, 디자인 시스템 헬퍼 등 |
| `config` | `@drt/config` | 팀 공용 lint/format 설정 모음 |

**잔여물**: `packages/api/` 아래에 `src/stations/types.ts`만 있고 `package.json`이 없어 **pnpm 워크스페이스 패키지가 아님**. 미사용·실험 잔재로 보이며, 신규 담당자는 혼동 시 삭제·통합 여부를 결정하면 됩니다.

---

## 4. 앱별 식별 정보(스토어·딥링크)

| 항목 | User | Driver |
|------|------|--------|
| 앱 표시 이름 | DRT User | DRT Driver |
| Expo slug | `drt-user` | `drt-driver` |
| Scheme | `drt-user` | `drt-driver` |
| Android package | `com.drt.user` | `com.drt.driver` |
| iOS bundle id | `com.drt.user` | `com.drt.driver` |
| Metro 개발 포트 | **8081** | **8082** (동시에 띄우기 위해 분리) |
| New Architecture | `app.json` 기준 **enabled** | `app.json` 기준 **disabled** — `app.config.ts`는 **enabled**로 다시 켜 둠 → **설정 불일치**. 실제 빌드 시 어떤 값이 최종 적용되는지 `npx expo config`로 확인 필요 |

**기사 앱 EAS**: `apps/driver-app/app.json`의 `extra.eas.projectId`가 문자열 `"driver-app-project-id"`로 되어 있어 **플레이스홀더**입니다. 실제 Expo 프로젝트에 맞게 교체해야 EAS 빌드·제출이 정상 동작합니다. 유저 앱은 UUID 형태의 `projectId`가 들어가 있습니다.

---

## 5. 처음부터 실행하기(로컬)

### 5.1 의존성 설치

저장소 루트에서:

```bash
pnpm install
```

모노레포이므로 **반드시 루트에서** 설치하는 것이 맞습니다. `apps/*`에 남아 있는 `package-lock.json`은 레거시로 보이며, 일관성을 위해 제거·`.gitignore` 여부는 팀 정책으로 정리하는 것이 좋습니다.

### 5.2 개발 서버

| 목적 | 명령 |
|------|------|
| 유저 앱만 | `pnpm run dev:user` |
| 기사 앱만 | `pnpm run dev:driver` |
| 유저 웹(Expo web) | `pnpm run dev:user:web` |
| 기사 웹 | `pnpm run dev:driver:web` |

내부적으로 `turbo run dev --filter=user-app` 형태로 해당 앱의 `expo start`가 실행됩니다.

### 5.3 네이티브 런(앱 디렉터리에서도 가능)

```bash
cd apps/user-app && pnpm android
cd apps/driver-app && pnpm android
```

유저 앱은 저장소에 `android` 폴더가 없을 수 있으므로, 처음이면 Expo 문서에 따라 `expo prebuild` 또는 `expo run:android`가 네이티브 디렉터리를 생성하는지 확인하세요. 기사 앱은 이미 `android/`가 있어 바로 Gradle 빌드가 가능한 구조입니다.

---

## 6. 품질·빌드 스크립트(루트)

| 스크립트 | 설명 |
|----------|------|
| `pnpm run build` | Turbo로 전체 `build` (앱은 `eas build`에 연결) |
| `pnpm run build:user` / `build:driver` | 필터 단일 앱 |
| `pnpm run lint` / `typecheck` / `test` | Turbo 파이프라인. 일부 패키지·앱은 lint가 `echo`로 스킵됨 |
| `pnpm run format` | Prettier 일괄 포맷 |

---

## 7. 환경 변수·시크릿

### 7.1 카카오 지도(JavaScript 키)

- 코드: `EXPO_PUBLIC_KAKAO_MAP_API_KEY`  
- 사용처: `apps/*/components/map/KakaoMap.tsx`, 유저 `app.config.ts`의 `extra.kakaoMapApiKey`  
- 상세 절차: `apps/driver-app/KAKAO_MAP_SETUP.md`(유저 앱도 동일 패턴)

Expo에서는 보통 앱 루트에 `.env`를 두고 `EXPO_PUBLIC_*`를 주입합니다. **키를 저장소에 커밋하지 말 것.**

### 7.2 백엔드 API 베이스 URL

**현재 `packages/api-client/src/index.ts`에서 `API_BASE_URL`이 하드코딩**되어 있습니다(주석에 과거 IP·포트·`EXPO_PUBLIC_API_URL` 후보만 존재).

인수인계 시 반드시 전달할 정보:

- 운영·개발·스테이징 각각의 **베이스 URL**(예: `https://.../drt`)  
- **HTTP 허용 여부**: Android 9+에서는 cleartext 기본 차단. 기사 앱 `network_security_config.xml`에 특정 IP에 대해 cleartext 허용이 있음 — **보안·스토어 정책 검토 필요**  
- 실제 서버가 바뀌면 `api-client` 수정 또는 `EXPO_PUBLIC_API_URL`로 전환하는 리팩터 권장

---

## 8. 백엔드 연동 개요(클라이언트가 호출하는 엔드포인트)

베이스 URL 뒤에 붙는 경로 예시입니다. **백엔드 팀에 스펙·인증 방식을 별도 문서로 받는 것**이 안전합니다.

### 8.1 유저 앱 (`apps/user-app/services`)

| 서비스 파일 | 엔드포인트(예) |
|-------------|----------------|
| `stations.ts` | `/selectNearbyStationPostGIS.do`, `/selectAlghStationList.do`, `/selectStartStnIdForFerry.do` |
| `callVehicle.ts` | `/callVehicle.do` |
| `cancelVehicleCall.ts` | `/callVehicleCancel.do` |
| `validateCallVehicle.ts` | `/validateCallVehicle.do` |
| `selectVehicleCallStatus.ts` | `/selectVehicleCallStatus.do` |
| `ferrySchedule.ts` | `/getFerryScheduleInfo.do` |
| `usageHistory.ts` | `/selectVehicleCallLogList.do` |
| `devicePayment.ts` | `/selectDeviceList.do` |

정류장 API 실패 시 `stations.ts`는 **`@drt/api-client`의 mock `api.getStops()`로 폴백**합니다.

### 8.2 기사 앱 (`apps/driver-app/services`)

| 서비스 파일 | 엔드포인트(예) |
|-------------|----------------|
| `vehicle.ts` | `/selectDetailCode.do` (디바이스 → 차량 ID) |
| `routes.ts` | `/selectRouteList.do` |
| `operations.ts` | `/startOper.do`, `/reportOper.do`, `/endOper.do` |

---

## 9. 상태 관리·데이터 패칭

- **서버 상태**: `@tanstack/react-query`, 앱별 `lib/queryClient.ts`  
- **클라이언트 전역**: `@drt/store` (Zustand) — 예: 유저 앱 메뉴 열림 상태

---

## 10. EAS 빌드·배포

1. [Expo](https://expo.dev) 계정 및 **프로젝트(앱별)** 연결  
2. `npm i -g eas-cli` 후 `eas login`  
3. 빌드는 보통 앱 디렉터리에서:

   ```bash
   cd apps/user-app
   eas build --profile production --platform android
   ```

4. 프로파일은 각 앱의 `eas.json` 및 루트 `eas.json` 참고 (`development` = dev client, `preview` = 내부 배포·iOS 시뮬레이터 등)

**제출 전 확인**: 번들 ID·서명·EAS projectId·카카오 키 도메인·API URL(운영 HTTPS).

---

## 11. 모노레포·번들러 유의사항

- 각 앱의 `metro.config.js`가 `../../packages`와 루트 `node_modules`를 **watch**하도록 되어 있어, 공통 패키지 수정 시 핫 리로드가 가능해야 합니다.  
- `babel.config.js`는 **앱별로 다름**: 유저는 `react-native-reanimated/plugin`, 루트 예시에는 `react-native-worklets/plugin`이 있어 혼동하지 말 것.  
- `driver-app`의 `babel-preset-expo` 버전이 `user-app`과 다를 수 있음 — 장기적으로 맞추는 편이 유지보수에 유리합니다.

---

## 12. 인수인계 체크리스트(담당자 간 질문)

다음에 답이 있으면 운영 인수가 수월합니다.

1. **백엔드** 베이스 URL(환경별), 인증(토큰·디바이스 ID), 방화벽·VPN  
2. **카카오** JavaScript 키 발급 주체, 도메인 화이트리스트(웹·WebView)  
3. **Expo/EAS** 조직, 앱별 `projectId`, 스토어 계정(Google Play / App Store)  
4. **실제 기기 테스트** 시나리오(호출~배차~취소, 기사 운행 보고 주기)  
5. **개인정보·위치** 정책(권한 문구는 `app.json` / `app.config.ts`에 한국어로 이미 기술됨)  
6. **유저 앱 네이티브 폴더**를 CI에서 어떻게 생성하는지( prebuild 캐시 여부 )

---

## 13. 알려진 문서·코드 불일치(신규 담당자용)

| 항목 | 내용 |
|------|------|
| `apps/*/README.md` | 예전 위치앱 튜토리얼 템플릿일 수 있음 → **루트 README(본 문서)** 를 우선 |
| `API_BASE_URL` | 환경 변수 미사용·하드코딩 |
| `driver-app` EAS projectId | 플레이스홀더 |
| `newArchEnabled` | user의 `app.json` vs `app.config.ts`, driver의 `app.json` vs `app.config.ts` 불일치 가능 |
| `packages/api` | 패키지 미완성 상태 |

---

## 14. 빠른 참고 — 루트 `package.json` 스크립트

```json
"dev:user": "turbo run dev --filter=user-app",
"dev:driver": "turbo run dev --filter=driver-app",
"dev:user:web": "turbo run dev:web --filter=user-app",
"dev:driver:web": "turbo run dev:web --filter=driver-app",
"build": "turbo run build",
"build:user": "turbo run build --filter=user-app",
"build:driver": "turbo run build --filter=driver-app",
"lint": "turbo run lint",
"typecheck": "turbo run typecheck",
"test": "turbo run test"
```

---

문서에 없는 운영 비밀(계정, URL, 키)은 **코드 외 안전한 채널**로 전달하고, 코드에는 **환경 변수 + EAS Secret**만 남기는 방향을 권장합니다.
