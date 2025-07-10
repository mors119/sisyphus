import { useMemo } from 'react';

// 비밀번호 강도를 평가하는 유틸 함수
function evaluatePasswordStrength(password: string) {
  let strength = 0;

  // 길이 체크
  if (password.length >= 8) strength += 33;
  // 숫자 포함
  if (/[0-9]/.test(password)) strength += 33;
  // 특수 문자 포함
  if (/[^A-Za-z0-9]/.test(password)) strength += 33;

  return strength;
}

// 현재 비밀번호의 강도를 계산
export function usePasswordStrength(password: string): number {
  return useMemo(() => evaluatePasswordStrength(password), [password]);
}
