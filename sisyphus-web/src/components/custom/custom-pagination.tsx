import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface CustomPaginationProps {
  className?: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export const CustomPagination = ({
  className,
  page,
  setPage,
  totalPages,
}: CustomPaginationProps) => {
  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink isActive={i === page} onClick={() => setPage(i)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
