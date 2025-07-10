import { QueryClient } from '@tanstack/react-query';

interface RemoveQueryOptions {
  queryKey: unknown[];
  exact?: boolean; // 정확히 일치하는 쿼리 (false일 경우 모든 쿼리 키)
  // 필요하면 다른 옵션 추가 가능
}

// 1. 전역에서 공유할 QueryClient 인스턴스
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 실패 시 재시도 횟수
      staleTime: 1000 * 60, // 1분 동안은 fresh 상태 유지
      refetchOnWindowFocus: false, // 창 전환 시 자동 refetch 비활성화
    },
  },
});

// 2. 특정 쿼리 무효화 → 데이터 재요청 유도
export function invalidateQuery(key: unknown[]) {
  return queryClient.invalidateQueries({ queryKey: key });
}

// 3. 특정 쿼리 즉시 삭제 (캐시 제거)
// 페이지를 떠날 때 쿼리 캐시가 메모리를 차지하지 않게 하려고
export function removeQuery(key: unknown[]) {
  return queryClient.removeQueries({ queryKey: key });
}

export function removeOptionsQuery(options: RemoveQueryOptions) {
  return queryClient.removeQueries(options);
}

// 4. 특정 쿼리 프리패치 (미리 데이터 요청)
export function prefetchQuery<T>(key: unknown[], fetcher: () => Promise<T>) {
  return queryClient.prefetchQuery({ queryKey: key, queryFn: fetcher });
}

// 5. 전 캐시 초기화 (로그아웃 등)
// 모든 쿼리와 뮤테이션 캐시를 전부 삭제
export function clearQueryCache() {
  queryClient.clear();
}

// 6. 특정 Query의 'data' undefined로 초기화
// 사용자가 폼을 리셋하면 캐시된 데이터도 같이 초기화
export function resetQuery() {
  queryClient.resetQueries();
}

// 7. 특정 쿼리 즉시 refetch
export function refetchQuery(key: unknown[]) {
  return queryClient.refetchQueries({ queryKey: key });
}

//  invalidate → refetch 를 연속적으로 확실히 실행하고 싶을 때 사용
export async function invalidateAndRefetchQuery(key: unknown[]) {
  await queryClient.invalidateQueries({ queryKey: key });
  return queryClient.refetchQueries({ queryKey: key });
}
