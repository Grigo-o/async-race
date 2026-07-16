import type { JSX } from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  disabled = false,
}: PaginationProps): JSX.Element | null {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const handlePrevious = (): void => onPageChange(currentPage - 1);
  const handleNext = (): void => onPageChange(currentPage + 1);

  return (
    <div className="pagination">
      <button type="button" onClick={handlePrevious} disabled={disabled || isFirstPage}>
        Previous
      </button>
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
      <button type="button" onClick={handleNext} disabled={disabled || isLastPage}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
