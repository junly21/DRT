# 📍 위치정보 앱 - React Native + Expo

안드로이드에서 위치정보를 사용하는 간단한 앱입니다.

## 🚀 기능

- 현재 위치 정보 가져오기 (위도, 경도)
- 위치 정확도, 고도, 속도 정보 표시
- 구글 맵 링크 생성
- 한국어 UI

## 📱 테스트 방법

### 1. Expo Go 앱 사용 (가장 빠른 방법)

1. 안드로이드 폰에서 Google Play Store에서 "Expo Go" 앱을 다운로드
2. 터미널에서 다음 명령어 실행:
   ```bash
   npm start
   # 또는
   npx expo start
   ```
3. QR 코드가 나타나면 Expo Go 앱으로 스캔
4. 앱이 자동으로 로드됩니다

### 2. 안드로이드 에뮬레이터 사용

1. Android Studio에서 에뮬레이터 실행
2. 터미널에서 다음 명령어 실행:
   ```bash
   npm run android
   # 또는
   npx expo run:android
   ```

### 3. 실제 APK 빌드 (EAS Build 필요)

EAS Build를 사용하여 실제 APK 파일을 생성하려면:

1. Expo 계정 생성 (https://expo.dev)
2. EAS CLI로 로그인:
   ```bash
   eas login
   ```
3. 빌드 설정:
   ```bash
   eas build:configure
   ```
4. 안드로이드 빌드:
   ```bash
   eas build --platform android
   ```

## 🛠 설정된 권한

- `ACCESS_FINE_LOCATION`: 정확한 위치 정보 접근
- `ACCESS_COARSE_LOCATION`: 대략적인 위치 정보 접근

## 📦 사용된 라이브러리

- `expo-location`: 위치 정보 API
- `react-native`: React Native 프레임워크
- `expo`: Expo SDK

## 🎯 주요 파일

- `App.tsx`: 메인 앱 컴포넌트
- `app.json`: Expo 설정 및 권한
- `package.json`: 의존성 관리

## 💡 사용법

1. 앱 실행 후 "현재 위치 가져오기" 버튼 터치
2. 위치 권한 허용
3. 현재 위치 정보 확인
4. "구글 맵에서 보기" 버튼으로 지도에서 위치 확인
