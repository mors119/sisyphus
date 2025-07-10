import { useRef, useCallback } from 'react';

/**
 * 무한 스크롤을 위한 IntersectionObserver ref 콜백
 *
 * @param {boolean} isLoading          - 첫 페이지 로딩 여부
 * @param {boolean} isFetchingNextPage - 다음 페이지를 가져오는 중인지 여부
 * @param {boolean} hasNextPage        - 더 불러올 페이지가 남아 있는지 여부
 * @param {() => void} fetchNextPage   - 다음 페이지 데이터를 요청하는 함수
 * @returns {(node: HTMLElement | null) => void} - 마지막 요소에 부착할 ref 콜백
 */
export const useInfiniteScrollRef = (
  isLoading: boolean,
  isFetchingNextPage: boolean,
  hasNextPage: boolean,
  fetchNextPage: () => void,
) => {
  /** 현재 IntersectionObserver 인스턴스를 유지 */
  const observer = useRef<IntersectionObserver | null>(null);

  /**
   * 리스트의 마지막 DOM 요소에 연결될 ref 콜백
   * 요소가 뷰포트와 교차하면 fetchNextPage()를 호출
   */
  const lastItemRef = useCallback(
    (node: HTMLElement | null) => {
      // 이미 로딩 중이거나 더 가져올 데이터가 없으면 관찰 종료
      if (isLoading || isFetchingNextPage || !hasNextPage) return;

      // 기존 관찰자는 해제 (중복 관찰 방지)
      if (observer.current) observer.current.disconnect();

      // 새로운 IntersectionObserver 생성
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      });

      // 마지막 요소를 관찰 대상으로 등록
      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  return lastItemRef;
};
