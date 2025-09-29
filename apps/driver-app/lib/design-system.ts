// DRT 앱 브랜드 디자인 시스템

export const BRAND_COLORS = {
  // 메인 브랜드 컬러 (파란색 계열)
  primary: {
    50: "#eff6ff", // 매우 연한 파랑
    100: "#dbeafe", // 연한 파랑
    200: "#bfdbfe", // 밝은 파랑
    300: "#93c5fd", // 중간 파랑
    400: "#60a5fa", // 진한 파랑
    500: "#3b82f6", // 메인 브랜드 컬러
    600: "#2563eb", // 진한 브랜드 컬러
    700: "#1d4ed8", // 매우 진한 파랑
    800: "#1e40af", // 어두운 파랑
    900: "#1e3a8a", // 가장 어두운 파랑
  },

  // 보조 컬러 (초록색 계열 - 성공/확인)
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // 성공 메인 컬러
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // 경고 컬러 (주황색 계열)
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // 경고 메인 컬러
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // 위험 컬러 (빨간색 계열)
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // 위험 메인 컬러
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // 중성 컬러 (회색 계열)
  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563", // 기본 텍스트
    700: "#374151", // 진한 텍스트
    800: "#1f2937", // 매우 진한 텍스트
    900: "#111827", // 가장 진한 텍스트
  },
};

// WCAG 2.1 AA 기준 컬러 조합 (4.5:1 대비율)
export const ACCESSIBLE_COLORS = {
  // 메인 텍스트 (흰 배경)
  textPrimary: BRAND_COLORS.neutral[900], // #111827
  textSecondary: BRAND_COLORS.neutral[600], // #4b5563
  textTertiary: BRAND_COLORS.neutral[500], // #6b7280

  // 브랜드 컬러 텍스트 (흰 배경)
  textBrand: BRAND_COLORS.primary[700], // #1d4ed8
  textSuccess: BRAND_COLORS.success[700], // #15803d
  textWarning: BRAND_COLORS.warning[700], // #b45309
  textDanger: BRAND_COLORS.danger[700], // #b91c1c

  // 배경 컬러
  backgroundPrimary: "#ffffff",
  backgroundSecondary: BRAND_COLORS.neutral[50], // #f9fafb
  backgroundTertiary: BRAND_COLORS.neutral[100], // #f3f4f6
};

// 버튼 스타일 정의
export const BUTTON_STYLES = {
  primary: {
    background: BRAND_COLORS.primary[600], // #2563eb
    text: "#ffffff",
    hover: BRAND_COLORS.primary[700], // #1d4ed8
    disabled: BRAND_COLORS.neutral[300], // #d1d5db
    disabledText: BRAND_COLORS.neutral[500], // #6b7280
  },
  success: {
    background: BRAND_COLORS.success[600], // #16a34a
    text: "#ffffff",
    hover: BRAND_COLORS.success[700], // #15803d
    disabled: BRAND_COLORS.neutral[300],
    disabledText: BRAND_COLORS.neutral[500],
  },
  secondary: {
    background: BRAND_COLORS.neutral[100], // #f3f4f6
    text: BRAND_COLORS.neutral[700], // #374151
    hover: BRAND_COLORS.neutral[200], // #e5e7eb
    border: BRAND_COLORS.neutral[300], // #d1d5db
  },
};

// 상태별 스타일
export const STATUS_STYLES = {
  available: {
    background: BRAND_COLORS.success[50], // #f0fdf4
    text: BRAND_COLORS.success[800], // #166534
    icon: "✓",
    badge: BRAND_COLORS.success[600], // #16a34a
  },
  limited: {
    background: BRAND_COLORS.warning[50], // #fffbeb
    text: BRAND_COLORS.warning[800], // #92400e
    icon: "⚠",
    badge: BRAND_COLORS.warning[600], // #d97706
  },
  full: {
    background: BRAND_COLORS.danger[50], // #fef2f2
    text: BRAND_COLORS.danger[800], // #991b1b
    icon: "✕",
    badge: BRAND_COLORS.danger[600], // #dc2626
  },
  selected: {
    background: BRAND_COLORS.primary[50], // #eff6ff
    text: BRAND_COLORS.primary[800], // #1e40af
    border: BRAND_COLORS.primary[600], // #2563eb
  },
};

// Material Icons 스타일 아이콘 매핑
export const MATERIAL_ICONS = {
  // 네비게이션
  back: "←",
  forward: "→",
  close: "✕",

  // 교통수단
  bus: "🚌",
  ferry: "⛴️",
  location: "📍",

  // 액션
  search: "🔍",
  check: "✓",
  warning: "⚠️",
  error: "❌",
  info: "ℹ️",

  // UI 요소
  menu: "☰",
  plus: "+",
  minus: "−",
  star: "★",
  heart: "♥",

  // 상태
  loading: "⏳",
  success: "✅",
  pending: "⏰",
};

// 공통 스타일 클래스 생성 함수
export const getButtonClasses = (
  variant: "primary" | "success" | "secondary",
  disabled: boolean = false
) => {
  const baseClasses =
    "rounded-xl py-4 px-6 shadow-sm font-bold text-lg text-center transition-colors";

  if (disabled) {
    return `${baseClasses} bg-gray-300 text-gray-500`;
  }

  switch (variant) {
    case "primary":
      return `${baseClasses} bg-blue-600 text-white active:bg-blue-700`;
    case "success":
      return `${baseClasses} bg-green-600 text-white active:bg-green-700`;
    case "secondary":
      return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-300 active:bg-gray-200`;
    default:
      return `${baseClasses} bg-blue-600 text-white active:bg-blue-700`;
  }
};

export const getCardClasses = (
  variant: "default" | "selected" | "available" | "limited" | "full" = "default"
) => {
  const baseClasses = "bg-white rounded-xl p-6 shadow-sm border-2";

  switch (variant) {
    case "selected":
      return `${baseClasses} border-blue-600 bg-blue-50`;
    case "available":
      return `${baseClasses} border-green-200 bg-green-50`;
    case "limited":
      return `${baseClasses} border-orange-200 bg-orange-50`;
    case "full":
      return `${baseClasses} border-gray-200 bg-gray-50 opacity-60`;
    default:
      return `${baseClasses} border-gray-200`;
  }
};

export const getStatusClasses = (status: "available" | "limited" | "full") => {
  switch (status) {
    case "available":
      return {
        text: "text-green-800 font-semibold",
        badge: "bg-green-600 text-white",
        icon: MATERIAL_ICONS.check,
      };
    case "limited":
      return {
        text: "text-orange-800 font-semibold",
        badge: "bg-orange-600 text-white",
        icon: MATERIAL_ICONS.warning,
      };
    case "full":
      return {
        text: "text-red-800 font-semibold",
        badge: "bg-red-600 text-white",
        icon: MATERIAL_ICONS.error,
      };
  }
};

