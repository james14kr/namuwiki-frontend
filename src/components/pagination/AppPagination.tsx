import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

interface PaginationProps {
  totalRow: number;
  maxRow?: number;
  onPageClick: (currentPageNum: number) => void;
}

const MAX_PAGE_NUMBER = 5;

const AppPagination = ({
  totalRow,
  maxRow = 5,
  onPageClick,
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const currentGroup = Math.floor(currentPage / MAX_PAGE_NUMBER);
  const totalPageCount = totalRow <= maxRow ? 1 : Math.ceil(totalRow / maxRow);

  const startPage = currentGroup * MAX_PAGE_NUMBER;
  const endPage = Math.min(startPage + MAX_PAGE_NUMBER, totalPageCount);
  const currentPageArr = Array.from(
    { length: endPage - startPage },
    (_, i) => startPage + i
  );

  const handlePrev = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    onPageClick(newPage);
  };

  const handleNext = () => {
    if (currentPage >= totalPageCount - 1) return;
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    onPageClick(newPage);
  };

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 0 && (
          <PaginationItem>
            <PaginationPrevious onClick={handlePrev} />
          </PaginationItem>
        )}
        {currentPageArr.map((x) => {
          return (
            <PaginationItem key={x}>
              <PaginationLink
                isActive={x === currentPage}
                onClick={() => {
                  setCurrentPage(x);
                  onPageClick(x);
                }}
              >
                {x + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {currentPage < totalPageCount - 1 && (
          <PaginationItem>
            <PaginationNext onClick={handleNext} />
          </PaginationItem>
        )}
        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
      </PaginationContent>
    </Pagination>
  );
};

export default AppPagination;
