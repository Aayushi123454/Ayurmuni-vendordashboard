import { useCallback, useMemo, useState } from "react";

export default function usePagination({ initialPage = 1, pageSize = 10, total = 0 } = {}) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(pageSize);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / size)), [total, size]);

  const goToPage = useCallback(
    (next) => {
      setPage(Math.min(Math.max(1, next), totalPages));
    },
    [totalPages]
  );

  const nextPage = useCallback(() => goToPage(page + 1), [goToPage, page]);
  const prevPage = useCallback(() => goToPage(page - 1), [goToPage, page]);

  return {
    page,
    pageSize: size,
    setPage: goToPage,
    setPageSize: setSize,
    totalPages,
    nextPage,
    prevPage,
    offset: (page - 1) * size,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
