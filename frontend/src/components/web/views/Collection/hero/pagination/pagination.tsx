import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "./pagination-sheet";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationWithIcon({ currentPage, totalPages, onPageChange }: Props) {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <Pagination className="py-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label="Anterior"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              if (canGoPrev) {
                onPageChange(currentPage - 1);
              }
            }}
            className={!canGoPrev ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
          >
            <ChevronsLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        {start > 1 && (
          <PaginationItem>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); onPageChange(1); }}>
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {start > 2 && (
          <PaginationItem>
            <PaginationLink href="#" onClick={(e) => e.preventDefault()}>...</PaginationLink>
          </PaginationItem>
        )}

        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={p === currentPage}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(p);
              }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {end < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink href="#" onClick={(e) => e.preventDefault()}>...</PaginationLink>
          </PaginationItem>
        )}

        {end < totalPages && (
          <PaginationItem>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); onPageChange(totalPages); }}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label="Próxima"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              if (canGoNext) {
                onPageChange(currentPage + 1);
              }
            }}
            className={!canGoNext ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
          >
            <ChevronsRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
