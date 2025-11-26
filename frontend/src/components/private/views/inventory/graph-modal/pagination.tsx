import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "./pagination-sheet";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export default function InventoryPagination() {
  return (
    <Pagination className="">
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#" aria-label="Go to previous page" size="icon">
            <ChevronsLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" aria-label="Go to next page" size="icon">
            <ChevronsRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
