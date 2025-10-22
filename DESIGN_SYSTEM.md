# DRT 앱 디자인 시스템 가이드

## 🎨 디자인 원칙

### 1. 레이아웃 방식

- **컨테이너 기반 구조**: 관련된 요소들을 논리적으로 그룹화하여 컨테이너로 묶기
- **반응형 레이아웃**: `absolute` 위치 대신 flexbox 레이아웃 우선 사용
- **일관된 간격**: `mb-4`, `mb-6`, `mb-8` 등의 표준 마진 사용
- **화면 크기 대응**: `w-full max-w-sm`, `px-6` 등을 사용하여 다양한 화면 크기 지원

### 2. 색상 시스템

```css
/* Tailwind 커스텀 색상 (tailwind.config.js에서 정의) */
bg-drt-background    /* #ececec - 메인 배경색 */
text-drt-text        /* #222222 - 주요 텍스트 */
bg-drt-ferry         /* #499c73 - 여객선 버튼 */
bg-drt-bus           /* #349eb5 - 버스 버튼 */
text-white           /* #ffffff - 흰색 텍스트 */
```

### 3. 타이포그래피

```css
/* 폰트 크기 */
text-2xl font-bold     /* 메인 타이틀 */
text-xl font-bold      /* 버튼 타이틀 */
text-base font-medium  /* 서브타이틀 */
text-sm font-medium    /* 설명 텍스트 */

/* 폰트 색상 */
text-drt-text          /* 주요 텍스트 */
text-white             /* 버튼 내 텍스트 */
opacity-50             /* 보조 텍스트 */
opacity-70             /* 버튼 내 보조 텍스트 */
```

### 4. 버튼 디자인

```css
/* 반응형 버튼 스타일 */
className="w-full max-w-sm rounded-2xl items-center justify-center px-6 py-8"

/* 여객선 버튼 */
className="w-full max-w-sm bg-drt-ferry rounded-2xl items-center justify-center px-6 py-8"

/* 버스 버튼 */
className="w-full max-w-sm bg-drt-bus rounded-2xl items-center justify-center px-6 py-8"

/* 그림자 효과 */
style={{
  shadowColor: "#000",
  shadowOffset: { width: 3, height: 3 },
  shadowOpacity: 0.16,
  shadowRadius: 3,
  elevation: 3,
}}
```

### 5. 아이콘 디자인

```css
/* 아이콘 컨테이너 */
className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-6"

/* 아이콘 크기 */
className="w-12 h-12"
```

## 🏗️ 레이아웃 패턴

### 1. 헤더 컨테이너 패턴 (반응형)

```tsx
<View className="flex-1 justify-center items-center px-6">
  {/* 로고 */}
  <Image source={...} className="w-24 h-12 mb-4" />

  {/* 타이틀 */}
  <Text className="text-drt-text text-2xl font-bold text-center mb-2">
    메인 타이틀
  </Text>

  {/* 서브타이틀 */}
  <Text className="text-drt-text text-base font-medium text-center opacity-50 mb-8">
    서브타이틀 텍스트
  </Text>
</View>
```

### 2. 버튼 컨테이너 패턴 (반응형)

```tsx
<View className="w-full items-center space-y-6">
  <TouchableOpacity
    className="w-full max-w-sm bg-drt-ferry rounded-2xl items-center justify-center px-6 py-8"
    style={{ shadowColor: "#000", shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.16, shadowRadius: 3, elevation: 3 }}>

    {/* 아이콘 */}
    <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-4">
      <Image source={...} className="w-12 h-12" />
    </View>

    {/* 타이틀 */}
    <Text className="text-white text-xl font-bold text-center mb-2">
      버튼 타이틀
    </Text>

    {/* 설명 */}
    <Text className="text-white text-sm font-medium text-center opacity-70 leading-5">
      버튼 설명 텍스트
    </Text>
  </TouchableOpacity>
</View>
```

### 3. 푸터 패턴 (반응형)

```tsx
<View className="px-6 pb-8">
  {/* Footer Text */}
  <View className="items-center mb-4">
    <Text className="text-drt-text text-sm font-medium text-center opacity-50 leading-5">
      푸터 텍스트
    </Text>
  </View>

  {/* Footer Logo */}
  <View className="items-center">
    <Image source={...} className="w-48 h-10" />
  </View>
</View>
```

## 📱 화면별 적용 가이드

### 새로운 화면 생성 시 체크리스트:

1. **배경색**: `bg-drt-background` 사용
2. **반응형 레이아웃**: `flex-1`, `w-full`, `max-w-sm` 사용
3. **버튼**: 반응형 버튼 패턴 사용 (`w-full max-w-sm`)
4. **텍스트**: 일관된 타이포그래피 적용 (`text-drt-text`)
5. **간격**: 표준 마진 값 사용 (`mb-4`, `mb-6`, `space-y-6`)
6. **그림자**: 표준 그림자 효과 적용
7. **패딩**: `px-6`을 사용하여 화면 가장자리 여백 확보

### 반응형 레이아웃 우선순위:

1. **Flexbox 레이아웃** (`flex-1`, `justify-center`, `items-center`)
2. **반응형 크기** (`w-full`, `max-w-sm`, `px-6`)
3. **절대 위치** (최후의 수단, 피해야 함)

## 🎯 프롬프트 템플릿

### 새 화면 개발 시 사용할 프롬프트:

```
"DRT 앱의 반응형 디자인 시스템을 따라 새로운 [화면명] 화면을 만들어줘.

요구사항:
- 배경색: bg-drt-background 사용
- 반응형 레이아웃: flex-1, w-full, max-w-sm 사용
- 버튼은 반응형 버튼 패턴 적용 (w-full max-w-sm)
- 텍스트는 일관된 타이포그래피 사용 (text-drt-text)
- 컨테이너 기반 구조로 레이아웃 구성
- flexbox 레이아웃 우선 사용 (절대 위치 피하기)
- 반응형 간격 사용 (px-6, space-y-6, mb-4 등)

구현해야 할 요소들:
1. [요소1]
2. [요소2]
3. [요소3]
"
```

이 가이드를 따라하면 모든 화면에서 일관된 디자인을 유지할 수 있습니다.
