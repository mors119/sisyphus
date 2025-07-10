import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface CustomPaginationProps {
  className?: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  last?: boolean;
}

export const CustomPagination = ({
  className,
  page,
  setPage,
  totalPages,
  last,
}: CustomPaginationProps) => {
  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          {/* shadcn pagination을 새로 받으면 컴포넌트 수정해야 이름 변경됨 */}
          <PaginationPrevious
            aria-disabled={page === 0}
            className={cn({
              'opacity-50 pointer-events-none cursor-not-allowed': page === 0,
            })}
            onClick={(e) => {
              if (page === 0) {
                e.preventDefault(); // 링크 이동 막기
                return;
              }
              setPage((prev) => Math.max(prev - 1, 0));
            }}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink isActive={i === page} onClick={() => setPage(i)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem aria-disabled={last}>
          <PaginationNext
            aria-disabled={last || page === totalPages - 1}
            className={cn({
              'opacity-50 pointer-events-none cursor-not-allowed':
                last || page === totalPages - 1,
            })}
            onClick={(e) => {
              if (last || page === totalPages - 1) {
                e.preventDefault(); // 링크 이동 막기
                return;
              }
              setPage((prev) => Math.min(prev + 1, totalPages - 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
