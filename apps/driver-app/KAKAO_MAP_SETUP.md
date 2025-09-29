# 카카오 지도 API 설정 가이드

## 1. 카카오 개발자 계정 생성 및 앱 등록

1. [카카오 개발자 센터](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인
3. **내 애플리케이션** > **애플리케이션 추가하기** 클릭
4. 앱 정보 입력:
   - 앱 이름: `DRT LocationApp`
   - 회사명: 본인 회사명
   - 카테고리: `교통`

## 2. JavaScript 키 발급

1. 생성된 앱 클릭
2. **앱 키** 탭에서 **JavaScript 키** 복사
3. 이 키를 `KakaoMap.tsx` 파일의 `YOUR_KAKAO_API_KEY` 부분에 입력

## 3. 플랫폼 설정

### Web 플랫폼 등록 (WebView 사용을 위해 필요)

1. **플랫폼** 탭 클릭
2. **Web 플랫폼 등록** 클릭
3. 사이트 도메인 입력:
   ```
   http://localhost
   https://localhost
   ```
   (WebView에서 로컬 HTML을 로드하기 때문)

## 4. 코드에 API 키 적용

`components/KakaoMap.tsx` 파일에서 다음 부분을 수정:

```javascript
// 변경 전
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_API_KEY"></script>

// 변경 후 (발급받은 JavaScript 키로 교체)
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=abcdef1234567890abcdef1234567890"></script>
```

## 5. 환경변수 설정 (권장)

보안을 위해 API 키를 환경변수로 관리:

1. `.env` 파일 생성:

```bash
EXPO_PUBLIC_KAKAO_MAP_API_KEY=your_javascript_key_here
```

2. `KakaoMap.tsx`에서 환경변수 사용:

```javascript
const KAKAO_API_KEY =
  process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY || "YOUR_KAKAO_API_KEY";

// HTML 템플릿에서 사용
<script
  type="text/javascript"
  src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}"></script>;
```

## 6. 사용량 확인

- 카카오 개발자 센터 > **통계** 탭에서 API 사용량 확인 가능
- 무료 할당량: **월 300만 건**
- 일 1,000번 호출은 월 30,000번 = 전체 할당량의 1%만 사용

## 7. 테스트

1. 앱 실행
2. 정류장 선택 화면에서 **지도 보기** 탭 클릭
3. 지도가 정상적으로 로드되는지 확인
4. 정류장 마커 클릭 시 선택되는지 확인

## 문제 해결

### 지도가 로드되지 않는 경우:

1. API 키가 올바른지 확인
2. 플랫폼 설정이 되어있는지 확인
3. 네트워크 연결 상태 확인

### 마커가 표시되지 않는 경우:

1. Stop 데이터에 latitude, longitude가 있는지 확인
2. 좌표값이 유효한 범위인지 확인 (한국: 위도 33-43, 경도 124-132)

## 추가 기능

필요시 다음 기능들도 추가 가능:

- 실시간 위치 추적
- 경로 탐색
- 주소 검색
- 장소 검색 (키워드)
