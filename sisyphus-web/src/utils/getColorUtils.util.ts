interface HexColor {
  r: number;
  g: number;
  b: number;
}

interface Luminance {
  L1: number;
  L2: number;
}

export const getColorUtils = () => {
  // HEX 변환 유틸리티 (3자리 → 6자리 변환)
  const expandHex = (hex: string): string => {
    if (hex.length === 3) {
      return hex
        .split('')
        .map((char) => char + char)
        .join('');
    }
    return hex;
  };

  // 휘도(luminance) 계산 함수
  const calculateLuminance = ({ r, g, b }: HexColor): number => {
    const srgbToLinear = (c: number): number => {
      c = c / 255.0;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const R = srgbToLinear(r);
    const G = srgbToLinear(g);
    const B = srgbToLinear(b);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };

  // 명암 대비 계산 함수
  const contrastRatio = ({ L1, L2 }: Luminance): number => {
    return (L1 + 0.05) / (L2 + 0.05);
  };

  // 적절한 텍스트 색상을 결정하는 함수
  const getTextColor = ({ r, g, b }: HexColor) => {
    const bgLuminance = calculateLuminance({ r, g, b });
    const whiteLuminance = calculateLuminance({ r: 255, g: 255, b: 255 });
    const blackLuminance = calculateLuminance({ r: 0, g: 0, b: 0 });

    // 항상 더 밝은 색을 L1, 어두운 색을 L2로 설정
    const contrastWithWhite = contrastRatio({
      L1: Math.max(whiteLuminance, bgLuminance),
      L2: Math.min(whiteLuminance, bgLuminance),
    });
    const contrastWithBlack = contrastRatio({
      L1: Math.max(bgLuminance, blackLuminance),
      L2: Math.min(bgLuminance, blackLuminance),
    });

    // 올바르게 대비를 비교하고 높은 쪽 선택
    const resultColor =
      contrastWithWhite < contrastWithBlack ? 'Black' : 'White';
    return resultColor === 'White' ? '#fff' : '#000';
  };

  // 특정 HEX 색상에 대한 적절한 텍스트 색상 추천 함수
  const getTextColorForHex = (hexColor: string) => {
    // HEX -> RGB 변환
    let hex = hexColor.replace('#', '').toLowerCase();
    hex = expandHex(hex); // 3자리 HEX 확장

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return getTextColor({ r, g, b });
  };

  return { getTextColorForHex, getTextColor };
};
